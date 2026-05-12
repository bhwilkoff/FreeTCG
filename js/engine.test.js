// js/engine.test.js — engine integration tests.
//
// Run with: node js/engine.test.js

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { test, assert, assertEqual, assertGt, assertGte, assertIncludes, run } from './test-runner.js';
import { rngCreate, rngNext, rngShuffle } from './rng.js';
import * as Engine from './engine.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

function loadJson(relPath) {
  return JSON.parse(readFileSync(resolve(repoRoot, relPath), 'utf-8'));
}

// ─────────────────────────────────────────────────────────────────────────────
// RNG
// ─────────────────────────────────────────────────────────────────────────────

test('rng is deterministic with same seed', () => {
  const r1 = rngCreate(42);
  const r2 = rngCreate(42);
  for (let i = 0; i < 100; i++) {
    const [v1, n1] = rngNext(r1);
    const [v2, n2] = rngNext(r2);
    assertEqual(v1, v2, `mismatch at step ${i}`);
    Object.assign(r1, n1);
    Object.assign(r2, n2);
  }
});

test('rng produces different values for different seeds', () => {
  const [v1] = rngNext(rngCreate(1));
  const [v2] = rngNext(rngCreate(2));
  assert(v1 !== v2, 'different seeds should produce different values');
});

test('rngShuffle is deterministic and pure', () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const r = rngCreate(123);
  const [shuffled1] = rngShuffle(r, arr);
  const [shuffled2] = rngShuffle(rngCreate(123), arr);
  assertEqual(shuffled1, shuffled2, 'same seed should produce same shuffle');
  assertEqual(arr, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'input should not mutate');
});

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function loadCatalogs() {
  const cardsData = loadJson('data/cards.json');
  const archetypesData = loadJson('data/archetypes.json');
  const cardCatalog = {};
  for (const c of cardsData.cards) cardCatalog[c.id] = c;
  // Year card stub catalog (will load real data when /data/year-cards.json lands)
  const yearCatalog = {};
  for (let i = 0; i < 30; i++) {
    yearCatalog[`stub-year-${i}`] = { id: `stub-year-${i}`, name: `Stub Year ${i}`, flavor: '', modifier: null };
  }
  return { cardCatalog, archetypesData, yearCatalog };
}

function makeDeckFromCatalog(cardCatalog) {
  // Repeat available cards to make a 40-card deck
  const ids = Object.keys(cardCatalog).filter(id => cardCatalog[id].type !== 'kin');
  const deck = [];
  while (deck.length < 40) {
    for (const id of ids) {
      if (deck.length >= 40) break;
      const c = cardCatalog[id];
      // Cap at 4 copies per non-Kin card; 1 Kin per archetype
      const count = deck.filter(x => x === id).length;
      if (count < 4) deck.push(id);
    }
  }
  // Add 2 Kin
  const kinIds = Object.keys(cardCatalog).filter(id => cardCatalog[id].type === 'kin');
  if (kinIds.length > 0) {
    deck.push(kinIds[0]);
    deck.push(kinIds[0]);
  }
  return deck;
}

function makeYearDeck(yearCatalog) {
  return Object.keys(yearCatalog).slice(0, 18);
}

// ─────────────────────────────────────────────────────────────────────────────
// Engine basics
// ─────────────────────────────────────────────────────────────────────────────

test('initialState builds a valid pre-game state', () => {
  const { cardCatalog, yearCatalog } = loadCatalogs();
  const deck = makeDeckFromCatalog(cardCatalog);
  const yearDeck = makeYearDeck(yearCatalog);
  const state = Engine.initialState({
    cardCatalog, yearCatalog,
    deckP1: deck.slice(),
    deckP2: deck.slice(),
    yearDeck,
    seed: 42,
  });
  assertEqual(state.phase, Engine.Phase.PRE_GAME);
  assertEqual(state.turn, 0);
  assertEqual(state.activePlayer, 0);
  assertEqual(state.players.length, 2);
  assertEqual(state.players[0].hand.length, 0);
  assertEqual(state.players[0].deck.length, deck.length);
  assert(state.yearDeck.length > 0, 'year deck should be populated');
});

test('startMatch deals opening hands and gives P2 +1 Attention', () => {
  const { cardCatalog, yearCatalog } = loadCatalogs();
  const deck = makeDeckFromCatalog(cardCatalog);
  const state = Engine.initialState({
    cardCatalog, yearCatalog,
    deckP1: deck.slice(), deckP2: deck.slice(),
    yearDeck: makeYearDeck(yearCatalog),
    seed: 42,
  });
  const after = Engine.applyIntent(state, { type: 'start_match' });
  assertEqual(after.players[0].hand.length, Engine.OPENING_HAND);
  assertEqual(after.players[1].hand.length, Engine.OPENING_HAND);
  assertEqual(after.players[1].inkwell, Engine.P2_INITIATIVE_BONUS_ATTENTION);
  assertEqual(after.turn, 1);
  assert([Engine.Phase.REFRESH, Engine.Phase.DRAW].includes(after.phase));
});

test('engine is pure: applyIntent does not mutate input state', () => {
  const { cardCatalog, yearCatalog } = loadCatalogs();
  const deck = makeDeckFromCatalog(cardCatalog);
  const state = Engine.initialState({
    cardCatalog, yearCatalog,
    deckP1: deck.slice(), deckP2: deck.slice(),
    yearDeck: makeYearDeck(yearCatalog),
    seed: 42,
  });
  const snapshot = JSON.stringify({
    phase: state.phase, turn: state.turn,
    p0Hand: state.players[0].hand.length, p0Deck: state.players[0].deck.length,
  });
  Engine.applyIntent(state, { type: 'start_match' });
  const after = JSON.stringify({
    phase: state.phase, turn: state.turn,
    p0Hand: state.players[0].hand.length, p0Deck: state.players[0].deck.length,
  });
  assertEqual(snapshot, after, 'state was mutated by applyIntent');
});

test('declare_intention sets the player intention and advances phase', () => {
  const state = playUntilIntention();
  assertEqual(state.phase, Engine.Phase.INTENTION);
  const after = Engine.applyIntent(state, { type: 'declare_intention', player: 0, virtue: 'Showing-Up' });
  assertEqual(after.phase, Engine.Phase.MAIN);
  assertEqual(after.players[0].legacy.intention, 'Showing-Up');
});

test('pitching a card adds Attention to inkwell and removes from hand', () => {
  const state = playUntilMain(0, 'Showing-Up');
  const cardId = state.players[0].hand[0];
  const c = state.cardCatalog[cardId];
  if (c.type === 'kin') return; // skip if first card is Kin
  const before = { hand: state.players[0].hand.length, ink: state.players[0].inkwell };
  const after = Engine.applyIntent(state, { type: 'pitch', player: 0, cardId });
  assertEqual(after.players[0].hand.length, before.hand - 1, 'hand decreased');
  assertGt(after.players[0].inkwell, before.ink, 'inkwell increased');
});

// ─────────────────────────────────────────────────────────────────────────────
// Match-flow integration
// ─────────────────────────────────────────────────────────────────────────────

test('full 18-turn match runs to completion with naive AI', () => {
  const result = runNaiveAIMatch(99);
  assertEqual(result.phase, Engine.Phase.MATCH_OVER);
  assert(result.winner === 0 || result.winner === 1 || result.winner === null, 'winner must be 0, 1, or null (tie)');
  assert(result.matchSummary, 'matchSummary should be populated');
  assertGte(result.matchSummary.p0.practicedCount, 0);
  assertGte(result.matchSummary.p1.practicedCount, 0);
});

test('Virtues Practiced increases when Intention matches a played card', () => {
  // Find a card with the Showing-Up tag in the catalog
  const { cardCatalog, yearCatalog } = loadCatalogs();
  const showUpCardId = Object.keys(cardCatalog).find(id => (cardCatalog[id].tags || []).includes('Showing-Up') && cardCatalog[id].type !== 'kin');
  if (!showUpCardId) return; // no such card in slice; skip
  // Build a deck heavy in this card
  const deck = Array(20).fill(showUpCardId).concat(Array(20).fill(Object.keys(cardCatalog).find(id => cardCatalog[id].type === 'action' && cardCatalog[id].id !== showUpCardId) || showUpCardId));
  const state = Engine.initialState({
    cardCatalog, yearCatalog,
    deckP1: deck.slice(), deckP2: deck.slice(),
    yearDeck: makeYearDeck(yearCatalog),
    seed: 7,
  });
  let s = Engine.applyIntent(state, { type: 'start_match' });
  // Force advance to intention
  while (s.phase !== Engine.Phase.INTENTION && s.phase !== Engine.Phase.MATCH_OVER) {
    s = Engine.applyIntent(s, { type: 'end_phase', player: s.activePlayer });
  }
  s = Engine.applyIntent(s, { type: 'declare_intention', player: 0, virtue: 'Showing-Up' });
  // Pitch a card to gain Attention
  for (let i = 0; i < 3 && s.players[0].hand.length > 0; i++) {
    const id = s.players[0].hand[0];
    if (s.cardCatalog[id].type !== 'kin') {
      s = Engine.applyIntent(s, { type: 'pitch', player: 0, cardId: id });
    }
  }
  // Play a Showing-Up tagged card (action type so it doesn't need a zone slot check beyond that)
  const playable = s.players[0].hand.find(id => s.cardCatalog[id].id === showUpCardId);
  if (!playable) return;
  const card = s.cardCatalog[playable];
  const playIntent = card.type === 'action'
    ? { type: 'play_card', player: 0, cardId: playable }
    : { type: 'play_card', player: 0, cardId: playable, zone: Engine.Zone.FAMILY };
  if (s.players[0].inkwell >= (card.cost || 0)) {
    const after = Engine.applyIntent(s, playIntent);
    assertIncludes(after.players[0].legacy.practiced, 'Showing-Up', 'Showing-Up should be Practiced after intentioned play');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — drive engine through phases with naive AI
// ─────────────────────────────────────────────────────────────────────────────

function playUntilIntention(seed = 42) {
  const { cardCatalog, yearCatalog } = loadCatalogs();
  const deck = makeDeckFromCatalog(cardCatalog);
  let s = Engine.initialState({
    cardCatalog, yearCatalog,
    deckP1: deck.slice(), deckP2: deck.slice(),
    yearDeck: makeYearDeck(yearCatalog),
    seed,
  });
  s = Engine.applyIntent(s, { type: 'start_match' });
  while (s.phase !== Engine.Phase.INTENTION && s.phase !== Engine.Phase.MATCH_OVER) {
    s = Engine.applyIntent(s, { type: 'end_phase', player: s.activePlayer });
  }
  return s;
}

function playUntilMain(playerId, virtue, seed = 42) {
  let s = playUntilIntention(seed);
  s = Engine.applyIntent(s, { type: 'declare_intention', player: s.activePlayer, virtue });
  return s;
}

function runNaiveAIMatch(seed) {
  const { cardCatalog, yearCatalog } = loadCatalogs();
  const deck = makeDeckFromCatalog(cardCatalog);
  let s = Engine.initialState({
    cardCatalog, yearCatalog,
    deckP1: deck.slice(), deckP2: deck.slice(),
    yearDeck: makeYearDeck(yearCatalog),
    seed,
  });
  s = Engine.applyIntent(s, { type: 'start_match' });

  const MAX_INTENTS = 5000;
  let i = 0;
  while (s.phase !== Engine.Phase.MATCH_OVER && i < MAX_INTENTS) {
    const intent = pickNaiveIntent(s);
    if (!intent) break;
    s = Engine.applyIntent(s, intent);
    i++;
  }
  if (s.phase !== Engine.Phase.MATCH_OVER) {
    throw new Error(`Match did not finish in ${MAX_INTENTS} intents (stuck at turn ${s.turn} phase ${s.phase})`);
  }
  return s;
}

function pickNaiveIntent(state) {
  const legals = Engine.getLegalIntents(state);
  if (legals.length === 0) return null;

  // Phase-specific simple choices
  switch (state.phase) {
    case Engine.Phase.PRE_GAME:
      return { type: 'no_mulligan', player: state.activePlayer };
    case Engine.Phase.INTENTION:
      // Pick first virtue
      return legals.find(l => l.type === 'declare_intention') || legals[0];
    case Engine.Phase.MAIN: {
      // Try to play a card we can afford that matches our intention
      const ap = state.players[state.activePlayer];
      const intention = ap.legacy.intention;
      const playables = legals.filter(l => l.type === 'play_card');
      if (intention) {
        const intentMatch = playables.find(l => {
          const c = state.cardCatalog[l.cardId];
          return (c.tags || []).includes(intention);
        });
        if (intentMatch) return intentMatch;
      }
      if (playables.length > 0) return playables[0];
      // Otherwise pitch one card if we have any pitchable cards in hand
      const pitches = legals.filter(l => l.type === 'pitch');
      if (pitches.length > 0 && ap.inkwell < 3) return pitches[0];
      return { type: 'pass_main', player: state.activePlayer };
    }
    default:
      return legals.find(l => l.type === 'end_phase') || legals.find(l => l.type === 'start_match') || legals[0];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────────────────────────

await run();
