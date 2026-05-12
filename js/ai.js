// js/ai.js — Dad TCG AI opponent.
//
// Heuristic action scorer that reads card effect ops and game state to score
// each legal intent. The AI never cheats — it only sees information that the
// player can also see (no peeking at opponent's hand or upcoming draws).
//
// Per /research/claude-skills/ai-opponents.md:
//   - Layer 1 (this file): action scorer reading effect ops directly.
//   - Layer 2 (deferred to v0.2): 1-2 ply lookahead for Hard difficulty.
//
// Difficulty configurations:
//   - easy: random pick from top 5 scored actions
//   - normal: top-1 with 80% probability, sample top-3 otherwise
//   - hard: always pick top-1 (lookahead added in v0.2)

import * as Engine from './engine.js';
import { rngInt, rngNext } from './rng.js';

export const Difficulty = Object.freeze({
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard',
});

// ─────────────────────────────────────────────────────────────────────────────
// Scoring weights (tunable; M1 simulator will calibrate)
// ─────────────────────────────────────────────────────────────────────────────

const W = {
  INTENTION_MATCH: 20,
  RESONANCE_OPPORTUNITY: 10,
  CARD_DRAW_PER_CARD: 5,
  KIN_MATURITY_PER_POINT: 8,
  MOMENT_CAPTURE: 5,
  HOME_ZONE_PREF: 1,
  PITCH_WHEN_LOW_ATT: 3,
  PITCH_WHEN_MED_ATT: 1,
  PLAY_OVER_PITCH_BIAS: 2,
  END_PHASE_DEFAULT: 0.5,
  PASS_MAIN_DEFAULT: 0.5,
};

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export function chooseIntent(state, difficulty = Difficulty.NORMAL) {
  const legals = Engine.getLegalIntents(state);
  if (legals.length === 0) return null;

  // Phase-specific quick paths
  switch (state.phase) {
    case Engine.Phase.PRE_GAME: {
      // Always skip mulligan in v0; the AI's deck is always playable
      const noMul = legals.find(l => l.type === 'no_mulligan');
      const start = legals.find(l => l.type === 'start_match');
      return noMul || start || legals[0];
    }
    case Engine.Phase.REFRESH:
    case Engine.Phase.DRAW:
    case Engine.Phase.END:
      return legals.find(l => l.type === 'end_phase') || legals[0];
    case Engine.Phase.INTENTION:
      return chooseIntention(state, legals, difficulty);
    case Engine.Phase.MAIN:
      return chooseMainPhaseIntent(state, legals, difficulty);
    default:
      return legals[0];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Intention selection
// ─────────────────────────────────────────────────────────────────────────────

function chooseIntention(state, legals, difficulty) {
  const ap = state.players[state.activePlayer];
  const intentionLegals = legals.filter(l => l.type === 'declare_intention');
  if (intentionLegals.length === 0) return legals[0];

  // Score: pick a virtue we can actually Practice this turn.
  // Look at our hand for cards whose tags we could realize.
  const handTagCounts = new Map();
  for (const cardId of ap.hand) {
    const c = state.cardCatalog[cardId];
    for (const t of c.tags || []) {
      handTagCounts.set(t, (handTagCounts.get(t) || 0) + 1);
    }
  }

  // Don't re-declare a virtue we've already Practiced (no benefit)
  const practiced = new Set(ap.legacy.practiced);

  let best = null, bestScore = -Infinity;
  for (const intent of intentionLegals) {
    const v = intent.virtue;
    let score = 0;
    if (handTagCounts.has(v)) score += handTagCounts.get(v) * 5;
    if (practiced.has(v)) score -= 10; // Strongly avoid already-practiced
    // Slight randomization to avoid AI-vs-AI mirror determinism
    score += hashStr(`${state.turn}-${state.activePlayer}-${v}`) * 0.01;
    if (score > bestScore) { bestScore = score; best = intent; }
  }
  return best || intentionLegals[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// Main phase scoring
// ─────────────────────────────────────────────────────────────────────────────

function chooseMainPhaseIntent(state, legals, difficulty) {
  const ap = state.players[state.activePlayer];
  const opp = state.players[1 - state.activePlayer];
  const intention = ap.legacy.intention;

  const scored = legals.map(intent => ({
    intent,
    score: scoreIntent(state, intent, ap, opp, intention),
  }));

  // Filter out plays we cannot afford (already filtered by getLegalIntents,
  // but defensive)
  const valid = scored.filter(s => s.score > -Infinity);
  valid.sort((a, b) => b.score - a.score);

  if (valid.length === 0) return legals.find(l => l.type === 'pass_main') || legals[0];

  return pickByDifficulty(state, valid, difficulty);
}

function scoreIntent(state, intent, ap, opp, intention) {
  switch (intent.type) {
    case 'play_card':       return scorePlayCard(state, intent, ap, opp, intention);
    case 'pitch':           return scorePitch(state, intent, ap);
    case 'pass_main':       return W.PASS_MAIN_DEFAULT;
    default:                return 0;
  }
}

function scorePlayCard(state, intent, ap, opp, intention) {
  const c = state.cardCatalog[intent.cardId];
  let score = W.PLAY_OVER_PITCH_BIAS;

  // Intention match: huge bonus
  if (intention && (c.tags || []).includes(intention)) {
    if (!ap.legacy.practiced.includes(intention)) {
      score += W.INTENTION_MATCH;
    } else {
      score += 2; // Already practiced — small bonus only
    }
  }

  // Resonance opportunity: any of this card's tags matched in the same zone by opponent
  if (intent.zone) {
    const oppZone = opp.zones[intent.zone];
    for (const oppId of oppZone) {
      const oppInst = opp.instances[oppId];
      if (!oppInst) continue;
      const oppTags = Engine.effectiveTags(state, opp.id, oppInst);
      for (const t of (c.tags || [])) {
        if (oppTags.includes(t)) {
          // Practicing a new virtue via Resonance
          if (!ap.legacy.practiced.includes(t)) score += W.RESONANCE_OPPORTUNITY;
          else score += 2;
          // Both players gain Resonance count (joy track tiebreaker)
          score += 1;
        }
      }
    }
  }

  // Card draw effects (read effect ops)
  const onEnter = (c.effects && c.effects.onEnter) || [];
  for (const op of onEnter) {
    if (op.op === 'draw') score += (op.count || 1) * W.CARD_DRAW_PER_CARD;
    else if (op.op === 'mature_kin') score += (op.amount || 1) * W.KIN_MATURITY_PER_POINT;
    else if (op.op === 'recall') score += (op.count || 1) * W.CARD_DRAW_PER_CARD * 0.7;
    else if (op.op === 'gain_attention') score += (op.amount || 1) * 2;
  }

  // Moment capture potential
  if (c.moment) score += W.MOMENT_CAPTURE * 0.6; // discount for uncertainty of trigger

  // Home zone preference
  // (Look up archetype's home zone if available)
  if (c.archetypeId) {
    // Lazy lookup; archetype catalog isn't passed in, so skip in v0
    // In M1 build extension, pass archetypes catalog into the AI for this lookup
  }

  // Cost penalty (the more expensive, the more we should be sure)
  const cost = c.cost || 0;
  if (cost > ap.inkwell) return -Infinity;
  // Slight preference for spending Attention vs hoarding
  score += Math.min(cost, 2) * 0.5;

  return score;
}

function scorePitch(state, intent, ap) {
  // Pitch is good when you have low Attention OR a card you don't want to play
  let score = 0;
  if (ap.inkwell <= 1) score += W.PITCH_WHEN_LOW_ATT;
  else if (ap.inkwell <= 3) score += W.PITCH_WHEN_MED_ATT;

  const c = state.cardCatalog[intent.cardId];
  // Prefer pitching cards we don't need this turn (e.g., no intention match)
  const intention = ap.legacy.intention;
  if (intention && (c.tags || []).includes(intention)) score -= 5;

  // Prefer pitching low-pitch-value cards LAST (so pitchValue 2+ first)
  score += (c.pitchValue || 1) * 0.5;

  return score;
}

// ─────────────────────────────────────────────────────────────────────────────
// Difficulty: how to pick from the scored list
// ─────────────────────────────────────────────────────────────────────────────

function pickByDifficulty(state, scoredSorted, difficulty) {
  const top = scoredSorted.slice(0, 5);
  // Get and update RNG state via state.rng (we don't mutate state here; we
  // rely on the engine's RNG to seed AI's randomness via a hash of the turn)
  const rngSeed = hashStr(`${state.turn}-${state.activePlayer}-${state.phase}-${scoredSorted[0].intent.type}-${(scoredSorted[0].intent.cardId || '')}`);
  const r = rngFromSeed(rngSeed);

  switch (difficulty) {
    case Difficulty.EASY:
      return r.pick(top).intent;
    case Difficulty.NORMAL:
      if (r.next() < 0.8) return scoredSorted[0].intent;
      return r.pick(scoredSorted.slice(0, 3)).intent;
    case Difficulty.HARD:
    default:
      return scoredSorted[0].intent;
  }
}

// Tiny embedded RNG for AI-internal randomness (separate from engine's RNG so
// AI choices are deterministic given the state, but vary across decisions
// within a turn).
function rngFromSeed(seed) {
  let s = (seed | 0) >>> 0;
  function next() {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function pick(arr) {
    return arr[Math.floor(next() * arr.length)];
  }
  return { next, pick };
}

function hashStr(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}
