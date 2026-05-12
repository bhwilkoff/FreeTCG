# Vanilla JS Architecture for Dad TCG (Web)

GitHub Pages, no build step, no backend, no framework. The constraints are tight but a TCG fits comfortably in this envelope. The whole web app should be a few thousand lines.

## State management

### Reducer pattern (recommended)

A single `gameState` object — plain JS, no classes, fully serializable — and a single `applyIntent(state, intent) → newState` function. Every UI interaction produces an intent; the reducer applies it; subscribers re-render.

```js
// state shape
const gameState = {
  schemaVersion: 1,
  turn: 7,
  activePlayer: 0,
  phase: 'main',
  players: [
    { id: 0, life: 30, mana: { current: 4, max: 4 },
      hand: ['fireball','imp'], deck: [...], graveyard: [...],
      board: [{ instanceId: 'a1', cardId: 'imp', stats: {atk:2,hp:1} }] },
    { id: 1, ... }
  ],
  log: [...]
};

function applyIntent(state, intent) {
  // pure function — returns new state, never mutates
}
```

**Why a reducer over an event bus or observable store:**
- Pure-functional, easy to test (`assert applyIntent(s, i) === expected`).
- Time-travel debugging is free (keep the intent log; replay).
- Save/load is trivial (serialize the state, or replay the log).
- The simulator (`playtest-balance-tooling.md`) reuses the reducer directly.
- The same shape ports cleanly to SwiftUI's `@Observable` store on iOS.

### Why not an event bus

Event buses obscure data flow. In a TCG you constantly need to ask "what triggered that effect?" — a reducer + log makes this readable; an event bus turns it into a debugging nightmare.

### Why not an observable store (MobX-style)

For 5 cards on a board, MobX-style proxies are overkill. The reducer + manual subscriber notifications take ~30 lines.

## Save / load

`localStorage` with versioned schema:

```js
const SAVE_KEY = 'dadtcg.savedGame';
const CURRENT_SCHEMA = 3;

function save(state) {
  localStorage.setItem(SAVE_KEY,
    JSON.stringify({ schemaVersion: CURRENT_SCHEMA, state }));
}

function load() {
  const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
  if (!raw) return null;
  return migrate(raw.state, raw.schemaVersion, CURRENT_SCHEMA);
}

const migrations = {
  1: state => ({ ...state, log: state.log || [] }),
  2: state => /* whatever schema 2→3 needed */
};

function migrate(state, from, to) {
  for (let v = from; v < to; v++) state = migrations[v](state);
  return state;
}
```

The migration function is *non-optional*: the day a player has a saved game and you ship a schema change, you've broken their game without it. Add a migration for every schema version bump and add a unit test for each migration step.

For card catalog and decklists, also save those — but think about them as *content* (read-only between releases) versus *state* (mutated each turn).

## Local 2-player on one device

A "Pass to Player 2" interstitial covers the screen between turns, hiding hands. The interstitial requires a tap to dismiss. Trivial UX; trivial code.

If you want simultaneous play on one device (each player on a half of the screen, Marvel-Snap-style), the implementation is harder but the engine is the same — the UI gates which intents are valid for which player.

## Offline-first

In v1, no network calls of any kind. The card catalog is bundled as a static `cards.json` served from GitHub Pages. The AI runs in-process. Saves are local. This is the simplest possible architecture and avoids whole categories of bugs.

When v2 adds online play, the engine doesn't change — only the transport for intents does (local dispatch becomes "send intent to server, receive authoritative state").

## Card rendering

For ~80 cards with maybe a dozen on screen at once, **DOM is the right answer.** Each card is a `<div class="card">` with structured children for cost, name, art, text. Use CSS Grid for the board; use Flexbox for the hand fan.

**Why not Canvas or WebGL:** more code, less accessibility (screen readers can't read into a canvas), harder to make text crisp, harder to apply CSS for hover/selected states. Canvas is the right answer when you need to render a thousand particles or 3D, neither of which Dad TCG should do.

DOM-only also gives you accessibility *almost* for free: each card is a real button or article with a real `aria-label`.

## Animation

The Web Animations API (`element.animate(keyframes, options)`) over CSS transitions, because:
- It returns a `Promise` (well, `animation.finished`) so you can sequence: "deal damage, then move card to graveyard, then draw replacement."
- You can interrupt and chain animations programmatically.
- It supports complex keyframes (multi-step ease curves).

CSS transitions are fine for hover/focus states. For game-event animations (card moves, attacks, draws), use Web Animations.

A common pattern:

```js
async function playCardAnimation(cardEl, fromZone, toZone) {
  await cardEl.animate(
    [
      { transform: zoneTransform(fromZone) },
      { transform: zoneTransform(toZone) }
    ],
    { duration: 300, easing: 'ease-out' }
  ).finished;
}
```

The engine runs synchronously and produces an *intent log*; the animator walks the log and animates each intent in turn. State and presentation are decoupled.

## Reference: open-source vanilla-JS TCGs

This is genuinely thin pickings. **No canonical option known to me as of Jan 2026 cutoff** for a high-quality vanilla-JS TCG to use as a reference codebase. Closest references:

- **boardgame.io** has a vanilla-JS client mode (no React required); read its source for move-handling shape. (unverified URL — recall from training: boardgame.io)
- Hearthstone clones in JS exist but are typically incomplete or framework-laden (no canonical recommendation).
- The "Dragon Ruby" / open-source roguelike communities have small turn-based-game examples but in non-JS languages.

You will be writing this from scratch, using the patterns above. That's fine — the surface area is small.

## Layout sketch

```
/index.html             — minimal shell, no logic
/css/styles.css         — all styling, design tokens in :root
/js/engine.js           — pure reducer, applyIntent, no DOM
/js/ai.js               — heuristic action scorer, no DOM
/js/cards.json          — card catalog (also consumed by iOS)
/js/ui.js               — DOM rendering and event wiring
/js/animator.js         — Web Animations API choreography
/js/save.js             — localStorage persistence + migrations
/js/sim.js              — AI vs. AI simulator (reuses engine.js + ai.js)
```

The engine, AI, and simulator have zero DOM dependencies — they're pure JS modules. UI lives in its own file. This separation is what makes the code testable, portable, and small.
