// js/engine.js — Dad TCG core game engine.
//
// Pure-functional reducer. applyIntent(state, intent) returns a NEW state;
// never mutates input. Deterministic given a seeded RNG. No DOM imports,
// no I/O — fully testable in Node, fully reusable by the simulator.
//
// Implements Decisions D011-D030 from /DECISIONS.md and the rules in
// /docs/RULES.md. Card effects use the JSON DSL spec in /docs/EFFECTS.md.
//
// v0 scope (M1 first iteration):
// - Full 18-turn match loop with Phase state machine.
// - Inkable any-card Attention (per-turn, per D023).
// - Three zones (Your Family, Your Craft, Your Community).
// - Intention declaration + Virtues Practiced tracking (win condition, D013).
// - Resonance per shared tag at End phase (D027).
// - Year card reveal at Refresh phase (mechanical modifiers logged but not
//   applied in v0; full modifier dispatch comes in v0.2).
// - Kin Maturity ticks (D017); end-of-match Kin scoring.
// - Missed Year detection + tiebreaker (D021).
// - +1 Attention initiative bonus for P2 (D025).
// - 1 card drawn per turn (D026).
// - Soft deck-out: stop drawing, no game-over.
// - Subset of EFFECTS.md ops: draw, discard, gain_attention, mature_kin,
//   capture_moment, recall, reveal, prevent_disruption, modify_cost (passive).
// - Tool attachment tracked but full effect-modifier compilation is v0.2.

import { rngCreate, rngShuffle, rngInt, rngNext } from './rng.js';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

export const Phase = Object.freeze({
  PRE_GAME: 'pre_game',     // mulligan window
  REFRESH: 'refresh',
  DRAW: 'draw',
  INTENTION: 'intention',
  MAIN: 'main',             // pitch + play + activate combined into one open phase
  END: 'end',
  MATCH_OVER: 'match_over',
});

export const Zone = Object.freeze({
  FAMILY: 'family',
  CRAFT: 'craft',
  COMMUNITY: 'community',
});
export const ZONES = [Zone.FAMILY, Zone.CRAFT, Zone.COMMUNITY];

export const Faction = Object.freeze({
  PRESENCE: 'Presence',
  CONNECTION: 'Connection',
  GROWTH: 'Growth',
  AGENCY: 'Agency',
  INTEGRITY: 'Integrity',
  RESILIENCE: 'Resilience',
});
export const FACTIONS = Object.values(Faction);

export const VIRTUES = Object.freeze([
  'Showing-Up', 'Listening', 'Holding',
  'Welcoming', 'Asking', 'Thanking',
  'Wondering', 'Trying', 'Teaching',
  'Choosing', 'Advocating', 'Naming',
  'Owning', 'Mending', 'Forgiving',
  'Adapting', 'Tending', 'Persisting',
]);

export const TURN_COUNT = 18;
export const OPENING_HAND = 5;
export const HAND_CAP = 7;
export const ZONE_SLOT_CAP = 4;
export const MULLIGAN_LIMIT = 1;
export const P2_INITIATIVE_BONUS_ATTENTION = 1;

// ─────────────────────────────────────────────────────────────────────────────
// State construction
// ─────────────────────────────────────────────────────────────────────────────

export function initialState({ cardCatalog, yearCatalog, deckP1, deckP2, yearDeck, seed }) {
  if (!cardCatalog) throw new Error('initialState: cardCatalog required');
  if (!yearCatalog) throw new Error('initialState: yearCatalog required');
  if (!Array.isArray(deckP1) || !Array.isArray(deckP2)) throw new Error('initialState: decks required');
  if (!Array.isArray(yearDeck)) throw new Error('initialState: yearDeck required');

  let rng = rngCreate(seed ?? 0);
  let shuffledP1, shuffledP2, shuffledYear;
  [shuffledP1, rng] = rngShuffle(rng, deckP1);
  [shuffledP2, rng] = rngShuffle(rng, deckP2);
  [shuffledYear, rng] = rngShuffle(rng, yearDeck);

  const player0 = makePlayer(0, shuffledP1);
  const player1 = makePlayer(1, shuffledP2);

  const state = {
    schemaVersion: '0.1',
    rng,
    cardCatalog,
    yearCatalog,
    turn: 0,
    phase: Phase.PRE_GAME,
    activePlayer: 0,
    yearDeck: shuffledYear,
    yearDiscard: [],
    currentYearCardId: null,
    players: [player0, player1],
    log: [],
    nextInstanceId: 1,
    winner: null,
    matchSummary: null,
  };
  return state;
}

function makePlayer(id, deckIds) {
  return {
    id,
    deck: deckIds,                       // top of deck = end of array (we pop)
    hand: [],
    discard: [],
    inkwell: 0,                          // resets per turn (D023)
    instances: {},                       // instanceId -> instance record
    zones: { family: [], craft: [], community: [] }, // arrays of instanceIds
    legacy: {
      practiced: [],                     // array of virtue strings (deduplicated)
      moments: [],                       // [{ year, name, flavor, source }]
      resonanceCount: 0,
      missedYears: 0,
      intention: null,
      kinMatured: 0,                     // count of Kin instances that reached maturity-1 or higher
    },
    mulligansUsed: 0,
    activeThisYear: false,               // for Missed Year detection
    protectedInstanceIds: new Set(),     // current-turn disruption immunity
  };
}

// Deal opening hands and apply P2 initiative bonus.
export function startMatch(state) {
  if (state.phase !== Phase.PRE_GAME) throw new Error('startMatch: not in pre-game');
  const newState = cloneState(state);
  for (const p of newState.players) {
    drawNCards(newState, p, OPENING_HAND);
  }
  // P2 initiative bonus per D025
  newState.players[1].inkwell = P2_INITIATIVE_BONUS_ATTENTION;
  newState.turn = 1;
  newState.phase = Phase.REFRESH;
  newState.activePlayer = 0;
  log(newState, { type: 'match_start' });
  return advanceRefresh(newState);
}

// ─────────────────────────────────────────────────────────────────────────────
// Cloning
// ─────────────────────────────────────────────────────────────────────────────

function cloneState(state) {
  // Deep clone everything except cardCatalog/yearCatalog (immutable references).
  return {
    schemaVersion: state.schemaVersion,
    rng: { ...state.rng },
    cardCatalog: state.cardCatalog,
    yearCatalog: state.yearCatalog,
    turn: state.turn,
    phase: state.phase,
    activePlayer: state.activePlayer,
    yearDeck: state.yearDeck.slice(),
    yearDiscard: state.yearDiscard.slice(),
    currentYearCardId: state.currentYearCardId,
    players: state.players.map(clonePlayer),
    log: state.log.slice(),
    nextInstanceId: state.nextInstanceId,
    winner: state.winner,
    matchSummary: state.matchSummary ? { ...state.matchSummary } : null,
  };
}

function clonePlayer(p) {
  const instances = {};
  for (const [id, inst] of Object.entries(p.instances)) {
    instances[id] = { ...inst, recordedTags: inst.recordedTags ? inst.recordedTags.slice() : [], attachedToolIds: inst.attachedToolIds ? inst.attachedToolIds.slice() : [] };
  }
  return {
    id: p.id,
    deck: p.deck.slice(),
    hand: p.hand.slice(),
    discard: p.discard.slice(),
    inkwell: p.inkwell,
    instances,
    zones: { family: p.zones.family.slice(), craft: p.zones.craft.slice(), community: p.zones.community.slice() },
    legacy: {
      practiced: p.legacy.practiced.slice(),
      moments: p.legacy.moments.slice(),
      resonanceCount: p.legacy.resonanceCount,
      missedYears: p.legacy.missedYears,
      intention: p.legacy.intention,
      kinMatured: p.legacy.kinMatured,
    },
    mulligansUsed: p.mulligansUsed,
    activeThisYear: p.activeThisYear,
    protectedInstanceIds: new Set(p.protectedInstanceIds),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Logging
// ─────────────────────────────────────────────────────────────────────────────

function log(state, event) {
  state.log.push({ turn: state.turn, phase: state.phase, ...event });
}

// ─────────────────────────────────────────────────────────────────────────────
// Card lookups
// ─────────────────────────────────────────────────────────────────────────────

export function getCard(state, cardId) {
  const c = state.cardCatalog[cardId];
  if (!c) throw new Error(`Unknown card: ${cardId}`);
  return c;
}

export function getYearCard(state, yearCardId) {
  const c = state.yearCatalog[yearCardId];
  if (!c) throw new Error(`Unknown year card: ${yearCardId}`);
  return c;
}

function newInstanceId(state) {
  return `i${state.nextInstanceId++}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Drawing
// ─────────────────────────────────────────────────────────────────────────────

function drawNCards(state, player, n) {
  let drawn = 0;
  for (let i = 0; i < n; i++) {
    if (player.deck.length === 0) break; // soft deck-out (D-decklocked-bundle)
    if (player.hand.length >= HAND_CAP) break; // hand cap
    const cardId = player.deck.pop();
    player.hand.push(cardId);
    drawn++;
  }
  log(state, { type: 'draw', player: player.id, count: drawn });
  return drawn;
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase transitions
// ─────────────────────────────────────────────────────────────────────────────

function advanceRefresh(state) {
  // Untap cards
  const ap = state.players[state.activePlayer];
  for (const inst of Object.values(ap.instances)) inst.tapped = false;

  // Reset Attention for the active player (D023)
  ap.inkwell = 0;

  // Reset disruption immunity (lasts 1 turn)
  ap.protectedInstanceIds = new Set();

  // Reset activeThisYear (for Missed Year detection on the OUTGOING player)
  // Note: we check Missed Year at start of NEW player's turn, against the JUST-FINISHED player.
  // But for v0 simplicity: each player tracks their own activeThisYear, reset here.
  ap.activeThisYear = false;

  // Reveal Year card (only at start of P1's turn — one Year per match-turn,
  // not per player-turn; simplest: only flip when P1's refresh begins)
  if (state.activePlayer === 0) {
    revealYearCard(state);
  }

  log(state, { type: 'refresh', player: ap.id });
  state.phase = Phase.DRAW;
  return state;
}

function revealYearCard(state) {
  if (state.yearDeck.length === 0) {
    state.currentYearCardId = null;
    return;
  }
  const yearCardId = state.yearDeck.pop();
  if (state.currentYearCardId) state.yearDiscard.push(state.currentYearCardId);
  state.currentYearCardId = yearCardId;
  log(state, { type: 'year_reveal', yearCardId, year: state.turn });
}

function advanceDraw(state) {
  const ap = state.players[state.activePlayer];
  drawNCards(state, ap, 1);
  state.phase = Phase.INTENTION;
  return state;
}

function advanceMain(state) {
  state.phase = Phase.MAIN;
  return state;
}

function advanceEnd(state) {
  // Resonance check (D027) — only check at the second player's End phase
  // (i.e., end of full match-turn) to avoid double-counting.
  if (state.activePlayer === 1) {
    runResonance(state);
    runKinMaturity(state);
  }

  // Missed Year detection (D021)
  const ap = state.players[state.activePlayer];
  if (!ap.activeThisYear) {
    ap.legacy.missedYears += 1;
    log(state, { type: 'missed_year', player: ap.id, year: state.turn });
  }

  // Discard down to hand cap
  while (ap.hand.length > HAND_CAP) {
    const dropped = ap.hand.pop();
    ap.discard.push(dropped);
  }

  log(state, { type: 'end_phase', player: ap.id });

  // Hand off to next player or advance turn
  if (state.activePlayer === 0) {
    state.activePlayer = 1;
    state.phase = Phase.REFRESH;
    return advanceRefresh(state);
  } else {
    // End of full match-turn
    state.activePlayer = 0;
    state.turn += 1;
    if (state.turn > TURN_COUNT) {
      return finalizeMatch(state);
    }
    state.phase = Phase.REFRESH;
    return advanceRefresh(state);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Resonance
// ─────────────────────────────────────────────────────────────────────────────

function runResonance(state) {
  for (const zoneName of ZONES) {
    const p0Insts = state.players[0].zones[zoneName];
    const p1Insts = state.players[1].zones[zoneName];
    for (const id0 of p0Insts) {
      for (const id1 of p1Insts) {
        const i0 = state.players[0].instances[id0];
        const i1 = state.players[1].instances[id1];
        if (!i0 || !i1) continue;
        const t0 = effectiveTags(state, 0, i0);
        const t1 = effectiveTags(state, 1, i1);
        for (const tag of t0) {
          if (t1.includes(tag)) {
            // Both players Practice this virtue (no double-count if already)
            markPracticed(state, 0, tag);
            markPracticed(state, 1, tag);
            state.players[0].legacy.resonanceCount += 1;
            state.players[1].legacy.resonanceCount += 1;
            log(state, { type: 'resonance', zone: zoneName, tag, p0: id0, p1: id1 });
          }
        }
      }
    }
  }
}

// Compute the effective tag set for an instance (its base tags + Tool grants + Stepdad-borrow).
export function effectiveTags(state, playerId, instance) {
  const card = getCard(state, instance.cardId);
  const tags = new Set(card.tags || []);

  // Tool attachments
  for (const toolInstId of instance.attachedToolIds || []) {
    const toolInst = state.players[playerId].instances[toolInstId];
    if (toolInst) {
      const toolCard = getCard(state, toolInst.cardId);
      for (const t of toolCard.tags || []) tags.add(t);
    }
  }

  // Stepdad-style tag borrowing: any Dad with the "Choosing,Persisting" Stepdad
  // signature borrows tags from Kin in the same zone (for Resonance only).
  // v0 implementation keyed on archetypeId.
  if (card.archetypeId === 'the-stepdad' && instance.zone) {
    const me = state.players[playerId];
    for (const otherId of me.zones[instance.zone]) {
      const other = me.instances[otherId];
      if (other && getCard(state, other.cardId).type === 'kin') {
        for (const t of other.recordedTags || []) tags.add(t);
        // Also Kin's own card tags (if the Kin definition has any)
        for (const t of getCard(state, other.cardId).tags || []) tags.add(t);
      }
    }
  }

  return Array.from(tags);
}

function markPracticed(state, playerId, virtue) {
  const p = state.players[playerId];
  if (!p.legacy.practiced.includes(virtue)) {
    p.legacy.practiced.push(virtue);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Kin maturity
// ─────────────────────────────────────────────────────────────────────────────

function runKinMaturity(state) {
  for (const playerId of [0, 1]) {
    const p = state.players[playerId];
    for (const inst of Object.values(p.instances)) {
      const card = getCard(state, inst.cardId);
      if (card.type !== 'kin') continue;
      // Did any Dad activate in the Kin's zone this turn?
      // For v0: consider any Dad in the same zone as "having activated" via presence.
      // Future: track per-card activation events explicitly.
      let dadInZone = null;
      for (const otherId of p.zones[inst.zone] || []) {
        if (otherId === inst.id) continue;
        const other = p.instances[otherId];
        if (other && getCard(state, other.cardId).type === 'dad') {
          dadInZone = other;
          break;
        }
      }
      if (dadInZone) {
        inst.maturity = (inst.maturity || 0) + 1;
        // Record the Dad's tags
        const dadCard = getCard(state, dadInZone.cardId);
        for (const t of dadCard.tags || []) {
          if (!inst.recordedTags.includes(t)) inst.recordedTags.push(t);
        }
        log(state, { type: 'kin_mature', player: playerId, kinId: inst.id, maturity: inst.maturity });
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// End of match
// ─────────────────────────────────────────────────────────────────────────────

function finalizeMatch(state) {
  // Score Kin: each Kin contributes up to (maturity) distinct virtues to its
  // controller's Practiced set, where the contributed virtues are from the
  // Kin's recordedTags AND not already Practiced by the controller.
  for (const playerId of [0, 1]) {
    const p = state.players[playerId];
    let kinMatured = 0;
    for (const inst of Object.values(p.instances)) {
      const card = getCard(state, inst.cardId);
      if (card.type !== 'kin') continue;
      if ((inst.maturity || 0) > 0) kinMatured += 1;
      const cap = inst.maturity || 0;
      let added = 0;
      for (const tag of inst.recordedTags || []) {
        if (added >= cap) break;
        if (!p.legacy.practiced.includes(tag)) {
          p.legacy.practiced.push(tag);
          added += 1;
        }
      }
    }
    p.legacy.kinMatured = kinMatured;
  }

  // Winner determination
  const p0 = state.players[0].legacy;
  const p1 = state.players[1].legacy;
  let winner = null;
  if (p0.practiced.length > p1.practiced.length) winner = 0;
  else if (p1.practiced.length > p0.practiced.length) winner = 1;
  else {
    // Tiebreakers (D012 §12 and D021):
    // 2. Most Moments collected
    if (p0.moments.length > p1.moments.length) winner = 0;
    else if (p1.moments.length > p0.moments.length) winner = 1;
    else {
      // 3. Fewer Missed Years
      if (p0.missedYears < p1.missedYears) winner = 0;
      else if (p1.missedYears < p0.missedYears) winner = 1;
      else {
        // 4-5: Kin maturity / Resonance count fallback
        const k0 = sumKinMaturity(state, 0);
        const k1 = sumKinMaturity(state, 1);
        if (k0 > k1) winner = 0;
        else if (k1 > k0) winner = 1;
        else if (p0.resonanceCount > p1.resonanceCount) winner = 0;
        else if (p1.resonanceCount > p0.resonanceCount) winner = 1;
        // else: leave winner null (rare; engine reports tie)
      }
    }
  }

  state.winner = winner;
  state.matchSummary = {
    winner,
    p0: legacySummary(state, 0),
    p1: legacySummary(state, 1),
  };
  state.phase = Phase.MATCH_OVER;
  log(state, { type: 'match_over', winner });
  return state;
}

function sumKinMaturity(state, playerId) {
  const p = state.players[playerId];
  let total = 0;
  for (const inst of Object.values(p.instances)) {
    const card = getCard(state, inst.cardId);
    if (card.type === 'kin') total += (inst.maturity || 0);
  }
  return total;
}

function legacySummary(state, playerId) {
  const p = state.players[playerId];
  return {
    practiced: p.legacy.practiced.slice(),
    practicedCount: p.legacy.practiced.length,
    moments: p.legacy.moments.slice(),
    momentCount: p.legacy.moments.length,
    resonanceCount: p.legacy.resonanceCount,
    missedYears: p.legacy.missedYears,
    kinMatured: p.legacy.kinMatured,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Intent application
// ─────────────────────────────────────────────────────────────────────────────

export function applyIntent(state, intent) {
  if (state.winner !== null) return state; // game over
  const newState = cloneState(state);

  // Validate
  const v = validateIntent(newState, intent);
  if (!v.valid) {
    log(newState, { type: 'invalid_intent', reason: v.reason, intent });
    newState.lastError = v.reason;
    return newState;
  }
  delete newState.lastError;

  switch (intent.type) {
    case 'mulligan':           return applyMulligan(newState, intent);
    case 'no_mulligan':        return applyNoMulligan(newState, intent);
    case 'start_match':        return applyStartMatchIntent(newState);
    case 'declare_intention':  return applyDeclareIntention(newState, intent);
    case 'pitch':              return applyPitch(newState, intent);
    case 'play_card':          return applyPlayCard(newState, intent);
    case 'end_phase':          return applyEndPhase(newState, intent);
    case 'pass_main':          return applyPassMain(newState, intent);
    default:
      throw new Error(`Unknown intent type: ${intent.type}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

function validateIntent(state, intent) {
  if (!intent || !intent.type) return { valid: false, reason: 'missing intent type' };
  if (typeof intent.player !== 'number' && intent.type !== 'start_match') {
    return { valid: false, reason: 'missing player' };
  }

  if (intent.type === 'start_match') {
    if (state.phase !== Phase.PRE_GAME) return { valid: false, reason: 'not in pre-game' };
    return { valid: true };
  }

  if (intent.player !== state.activePlayer && intent.type !== 'mulligan' && intent.type !== 'no_mulligan') {
    return { valid: false, reason: `not active player (active=${state.activePlayer}, intent.player=${intent.player})` };
  }

  switch (intent.type) {
    case 'mulligan':
    case 'no_mulligan':
      if (state.phase !== Phase.PRE_GAME) return { valid: false, reason: 'not in pre-game' };
      break;
    case 'declare_intention':
      if (state.phase !== Phase.INTENTION) return { valid: false, reason: 'not intention phase' };
      if (!VIRTUES.includes(intent.virtue)) return { valid: false, reason: 'unknown virtue' };
      break;
    case 'pitch':
      if (state.phase !== Phase.MAIN) return { valid: false, reason: 'not main phase' };
      {
        const p = state.players[intent.player];
        if (!p.hand.includes(intent.cardId)) return { valid: false, reason: 'card not in hand' };
        const c = state.cardCatalog[intent.cardId];
        if (!c) return { valid: false, reason: 'unknown card' };
        if (c.type === 'kin') return { valid: false, reason: 'cannot pitch Kin' };
      }
      break;
    case 'play_card':
      if (state.phase !== Phase.MAIN) return { valid: false, reason: 'not main phase' };
      {
        const p = state.players[intent.player];
        if (!p.hand.includes(intent.cardId)) return { valid: false, reason: 'card not in hand' };
        const c = state.cardCatalog[intent.cardId];
        if (!c) return { valid: false, reason: 'unknown card' };
        if (typeof c.cost === 'number' && p.inkwell < c.cost) {
          return { valid: false, reason: 'insufficient Attention' };
        }
        if (c.type === 'dad' || c.type === 'kin') {
          if (!ZONES.includes(intent.zone)) return { valid: false, reason: 'invalid zone' };
          if (p.zones[intent.zone].length >= ZONE_SLOT_CAP) {
            return { valid: false, reason: 'zone full' };
          }
        }
      }
      break;
    case 'pass_main':
    case 'end_phase':
      // Generally always allowable when in the right phase
      break;
  }

  return { valid: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Intent handlers
// ─────────────────────────────────────────────────────────────────────────────

function applyMulligan(state, intent) {
  const p = state.players[intent.player];
  if (p.mulligansUsed >= MULLIGAN_LIMIT) return state;
  // Return hand to deck, shuffle, redraw
  for (const cardId of p.hand) p.deck.push(cardId);
  p.hand = [];
  let shuffled;
  [shuffled, state.rng] = rngShuffle(state.rng, p.deck);
  p.deck = shuffled;
  drawNCards(state, p, OPENING_HAND);
  p.mulligansUsed += 1;
  log(state, { type: 'mulligan', player: p.id });
  return state;
}

function applyNoMulligan(state, intent) {
  log(state, { type: 'no_mulligan', player: intent.player });
  // Ensure both players have decided
  // (For v0, we just record the choice; startMatch is a separate intent.)
  return state;
}

function applyStartMatchIntent(state) {
  // Wrapper around startMatch but cloned-already
  for (const p of state.players) {
    if (p.hand.length === 0) drawNCards(state, p, OPENING_HAND);
  }
  state.players[1].inkwell = P2_INITIATIVE_BONUS_ATTENTION;
  state.turn = 1;
  state.phase = Phase.REFRESH;
  state.activePlayer = 0;
  log(state, { type: 'match_start' });
  return advanceRefresh(state);
}

function applyDeclareIntention(state, intent) {
  const p = state.players[intent.player];
  p.legacy.intention = intent.virtue;
  log(state, { type: 'declare_intention', player: p.id, virtue: intent.virtue });
  state.phase = Phase.MAIN;
  return state;
}

function applyPitch(state, intent) {
  const p = state.players[intent.player];
  const c = state.cardCatalog[intent.cardId];
  // Remove from hand
  const idx = p.hand.indexOf(intent.cardId);
  p.hand.splice(idx, 1);
  // Add to inkwell (Attention available this turn only)
  const pitchValue = typeof c.pitchValue === 'number' ? c.pitchValue : 1;
  p.inkwell += pitchValue;
  // Pitched cards go to "the inkwell" — for v0, we model the inkwell as a face-down
  // pile that doesn't return to play. Track them on a per-player list.
  if (!p.inkwellPile) p.inkwellPile = [];
  p.inkwellPile.push(intent.cardId);
  log(state, { type: 'pitch', player: p.id, cardId: intent.cardId, attentionGained: pitchValue });
  return state;
}

function applyPlayCard(state, intent) {
  const p = state.players[intent.player];
  const c = state.cardCatalog[intent.cardId];
  // Remove from hand, pay cost
  const idx = p.hand.indexOf(intent.cardId);
  p.hand.splice(idx, 1);
  p.inkwell -= (typeof c.cost === 'number' ? c.cost : 0);

  if (c.type === 'action') {
    // One-shot: resolve effects, then to discard
    runOnEnter(state, intent.player, intent.cardId, null);
    p.discard.push(intent.cardId);
    // Mark virtue Practiced if intention matches a tag of this card
    practiceFromIntention(state, intent.player, c);
    // Active for Missed Year purposes
    p.activeThisYear = true;
    log(state, { type: 'play_action', player: p.id, cardId: intent.cardId });
    return state;
  }

  // Dad / Kin / Tool: enter a zone
  const instId = newInstanceId(state);
  const inst = makeInstance(instId, intent.cardId, intent.player, intent.zone || (c.type === 'tool' ? null : Zone.FAMILY));
  p.instances[instId] = inst;

  if (c.type === 'tool') {
    // Tool: must specify attachToInstanceId
    const target = p.instances[intent.attachToInstanceId];
    if (!target) {
      // Invalid; refund
      p.inkwell += (typeof c.cost === 'number' ? c.cost : 0);
      p.hand.push(intent.cardId);
      delete p.instances[instId];
      log(state, { type: 'invalid_intent', reason: 'tool target missing', intent });
      return state;
    }
    if (!target.attachedToolIds) target.attachedToolIds = [];
    target.attachedToolIds.push(instId);
    inst.attachedToInstanceId = target.id;
    inst.zone = target.zone;
    log(state, { type: 'play_tool', player: p.id, cardId: intent.cardId, target: target.id });
  } else {
    // Dad or Kin: enter zone
    p.zones[intent.zone].push(instId);
    runOnEnter(state, intent.player, intent.cardId, instId);
    log(state, { type: 'play_card', player: p.id, cardId: intent.cardId, zone: intent.zone, instId });
  }

  // Mark virtue Practiced if intention matches
  practiceFromIntention(state, intent.player, c);

  // Mark active for Missed Year
  p.activeThisYear = true;

  return state;
}

function makeInstance(instId, cardId, controller, zone) {
  return {
    id: instId,
    cardId,
    controller,
    zone,
    tapped: false,
    attachedToolIds: [],
    attachedToInstanceId: null,
    growthCounters: 0,
    maturity: 0,
    recordedTags: [],
  };
}

function practiceFromIntention(state, playerId, card) {
  const p = state.players[playerId];
  if (!p.legacy.intention) return;
  if ((card.tags || []).includes(p.legacy.intention)) {
    markPracticed(state, playerId, p.legacy.intention);
    log(state, { type: 'virtue_practiced', player: playerId, virtue: p.legacy.intention, source: 'intention' });
  }
}

// Run a card's onEnter ops. v0 supports a small subset.
function runOnEnter(state, playerId, cardId, instId) {
  const card = state.cardCatalog[cardId];
  const ops = (card.effects && card.effects.onEnter) || [];
  for (const op of ops) {
    runOp(state, op, { playerId, instId, cardId });
  }
  // Capture Moment if the card has a Moment hook with a triggering condition met
  if (card.moment) {
    const fired = momentTriggerFires(state, card.moment, { playerId, instId, cardId });
    if (fired) {
      captureMoment(state, playerId, card.moment, cardId);
    }
  }
}

function captureMoment(state, playerId, momentSpec, sourceCardId) {
  const p = state.players[playerId];
  p.legacy.moments.push({
    year: state.turn,
    name: momentSpec.name,
    flavor: momentSpec.flavor || '',
    source: sourceCardId,
  });
  log(state, { type: 'moment_captured', player: playerId, name: momentSpec.name, year: state.turn });
}

function momentTriggerFires(state, momentSpec, ctx) {
  const trigger = momentSpec.trigger || {};
  if (trigger.when === 'after_play' || trigger.when === 'after_play_in_same_zone') {
    const filter = trigger.filter || {};
    if (filter.kin_in_same_zone_as) {
      // ctx.instId is the just-played card's instance
      const me = state.players[ctx.playerId];
      const myInst = me.instances[ctx.instId];
      if (!myInst || !myInst.zone) return false;
      for (const otherId of me.zones[myInst.zone]) {
        if (otherId === ctx.instId) continue;
        const other = me.instances[otherId];
        if (other && state.cardCatalog[other.cardId].type === 'kin') return true;
      }
      return false;
    }
    if (filter.card_in_play) {
      const me = state.players[ctx.playerId];
      const f = filter.card_in_play;
      for (const inst of Object.values(me.instances)) {
        const c = state.cardCatalog[inst.cardId];
        if (f.tag && (c.tags || []).includes(f.tag)) return true;
      }
      return false;
    }
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Op execution (subset for v0)
// ─────────────────────────────────────────────────────────────────────────────

function runOp(state, op, ctx) {
  switch (op.op) {
    case 'draw': {
      const p = state.players[ctx.playerId];
      drawNCards(state, p, op.count || 1);
      return;
    }
    case 'discard': {
      // Simplified v0: discard top of own hand (no chooser prompt)
      const p = state.players[ctx.playerId];
      const count = op.count || 1;
      for (let i = 0; i < count && p.hand.length > 0; i++) {
        p.discard.push(p.hand.pop());
      }
      return;
    }
    case 'gain_attention': {
      const p = state.players[ctx.playerId];
      p.inkwell += (op.amount || 1);
      return;
    }
    case 'recall': {
      const p = state.players[ctx.playerId];
      const n = op.count || 1;
      for (let i = 0; i < n && p.discard.length > 0 && p.hand.length < HAND_CAP; i++) {
        p.hand.push(p.discard.pop());
      }
      return;
    }
    case 'mature_kin': {
      const p = state.players[ctx.playerId];
      // Pick first Kin in play (v0 simple targeting)
      for (const inst of Object.values(p.instances)) {
        if (state.cardCatalog[inst.cardId].type === 'kin') {
          inst.maturity = (inst.maturity || 0) + (op.amount || 1);
          log(state, { type: 'kin_mature_op', player: ctx.playerId, kinId: inst.id, by: op.amount || 1 });
          return;
        }
      }
      return;
    }
    case 'capture_moment': {
      captureMoment(state, ctx.playerId, { name: op.name, flavor: op.flavor || '' }, ctx.cardId);
      return;
    }
    case 'reveal': {
      // No-op in headless engine (just informational); UI will show
      log(state, { type: 'reveal_op', player: ctx.playerId, op });
      return;
    }
    case 'prevent_disruption': {
      const p = state.players[ctx.playerId];
      // Simplified: protect all friendly instances in player's zones for this turn
      for (const zone of ZONES) for (const id of p.zones[zone]) p.protectedInstanceIds.add(id);
      return;
    }
    default:
      // Unknown op: log and skip (forward compatibility per BOBA-lessons.md)
      log(state, { type: 'unknown_op', op: op.op });
      return;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase advancement intents
// ─────────────────────────────────────────────────────────────────────────────

function applyEndPhase(state, intent) {
  switch (state.phase) {
    case Phase.REFRESH:    return advanceDraw(state);
    case Phase.DRAW:       state.phase = Phase.INTENTION; return state;
    case Phase.INTENTION:  return advanceMain(state);
    case Phase.MAIN:       state.phase = Phase.END; return advanceEnd(state);
    case Phase.END:        return advanceEnd(state);
    default: return state;
  }
}

function applyPassMain(state, intent) {
  state.phase = Phase.END;
  return advanceEnd(state);
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers exposed for UI / AI / tests
// ─────────────────────────────────────────────────────────────────────────────

export function getLegalIntents(state) {
  // Returns intents the active player can take from the current phase.
  if (state.winner !== null) return [];
  const ap = state.activePlayer;
  const p = state.players[ap];
  const list = [];

  switch (state.phase) {
    case Phase.PRE_GAME:
      if (p.mulligansUsed < MULLIGAN_LIMIT) list.push({ type: 'mulligan', player: ap });
      list.push({ type: 'no_mulligan', player: ap });
      list.push({ type: 'start_match' });
      break;
    case Phase.REFRESH:
    case Phase.DRAW:
      list.push({ type: 'end_phase', player: ap });
      break;
    case Phase.INTENTION:
      for (const v of VIRTUES) list.push({ type: 'declare_intention', player: ap, virtue: v });
      break;
    case Phase.MAIN:
      // Pitch any card in hand
      for (const cardId of p.hand) {
        const c = state.cardCatalog[cardId];
        if (c.type !== 'kin') list.push({ type: 'pitch', player: ap, cardId });
      }
      // Play any affordable card
      for (const cardId of p.hand) {
        const c = state.cardCatalog[cardId];
        if (typeof c.cost === 'number' && p.inkwell < c.cost) continue;
        if (c.type === 'dad' || c.type === 'kin') {
          for (const z of ZONES) {
            if (p.zones[z].length < ZONE_SLOT_CAP) list.push({ type: 'play_card', player: ap, cardId, zone: z });
          }
        } else if (c.type === 'action') {
          list.push({ type: 'play_card', player: ap, cardId });
        } else if (c.type === 'tool') {
          // Need a Dad to attach to
          for (const inst of Object.values(p.instances)) {
            if (state.cardCatalog[inst.cardId].type === 'dad') {
              list.push({ type: 'play_card', player: ap, cardId, attachToInstanceId: inst.id });
            }
          }
        }
      }
      list.push({ type: 'pass_main', player: ap });
      break;
    case Phase.END:
      list.push({ type: 'end_phase', player: ap });
      break;
  }

  return list;
}

export function snapshotForLog(state) {
  return {
    turn: state.turn,
    phase: state.phase,
    activePlayer: state.activePlayer,
    yearCard: state.currentYearCardId,
    p0: { hand: state.players[0].hand.length, deck: state.players[0].deck.length, inkwell: state.players[0].inkwell, practiced: state.players[0].legacy.practiced.length },
    p1: { hand: state.players[1].hand.length, deck: state.players[1].deck.length, inkwell: state.players[1].inkwell, practiced: state.players[1].legacy.practiced.length },
  };
}
