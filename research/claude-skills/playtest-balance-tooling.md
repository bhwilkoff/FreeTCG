# Playtesting and Balancing Dad TCG

The single most undervalued tool in TCG development is a fast simulator. The single most overvalued is a balance dashboard. This file covers both, plus the human element neither can replace.

## The foundational layer: pen-and-paper playtesting

Print the cards. Cut them out. Play with humans. **Nothing replaces this.** A simulator can tell you which deck wins more games; it cannot tell you that a deck is *boring to play against*, that a key card is confusing, that the resource curve feels punishing in turn 3 specifically, or that the match ends 2 turns later than it should for ideal pacing.

For a "dad" themed game, this matters double — you're targeting a specific player feel, and feel only emerges in human play. Run a weekly playtest while card design is active. Take notes. Watch where players hesitate.

This isn't tooling — it's discipline. But CLAUDE.md's "deepens understanding / invites participation / supports agency" check applies to your *playtesters*, not just the eventual players. Make playtesting a real activity, not a debugging session.

## Match simulators

A simulator is the JS engine running AI vs. AI thousands of times, recording outcomes. **Build this on day one of card design.** It's the cheapest way to surface "this card is broken" before you've drawn art for 80 of them.

### Architecture

```js
// sim.js (web, vanilla JS)
import { applyIntent, initialState } from './engine.js';
import { chooseAction } from './ai.js';

function playMatch(deckA, deckB, seed) {
  let state = initialState({ p0: deckA, p1: deckB, seed });
  while (!state.winner) {
    const intent = chooseAction(state, state.activePlayer);
    state = applyIntent(state, intent);
  }
  return { winner: state.winner, turns: state.turn, log: state.log };
}

function batch(deckA, deckB, n) {
  let aWins = 0;
  for (let i = 0; i < n; i++) {
    const r = playMatch(deckA, deckB, i);
    if (r.winner === 0) aWins++;
  }
  return aWins / n;
}
```

That's the core. Run it in Node directly (vanilla JS, no build) for faster iteration than browsers. Per CLAUDE.md, the engine has zero DOM dependencies, which is exactly what makes this possible.

### Determinism

Seed the RNG. Every random call (shuffles, coin flips, random targets) goes through a seeded generator, not `Math.random()`. With a seed, runs are reproducible: you can compare "matchup A vs. B" today and tomorrow and get identical numbers, which means changes to win rates can be attributed to *card changes* not noise.

When you do want to sample over RNG variation, run with seeds 0..N and average.

### Speed targets

A simulator should finish 10,000 matches in under a minute on a laptop. If it doesn't, the engine is doing too much per turn (probably allocating new state objects with deep copies; consider structural sharing or in-place mutation in a copy of the state struct).

## Win-rate matrix

For a TCG with archetypes, the most useful single artifact is the *matchup matrix*: rows are deck A, columns are deck B, cells are A's win rate.

```
            Aggro   Midrange   Combo   Control
Aggro       50%     58%        65%     35%
Midrange    42%     50%        55%     58%
Combo       35%     45%        50%     62%
Control     65%     42%        38%     50%
```

(Self-matchups should hit 50% as a sanity check — if `Aggro vs. Aggro` isn't ~50%, your AI has a player-order bias or your engine has a non-deterministic bug.)

The classic balance signal: every deck should beat *some* matchups and lose *some*. If one deck has all green cells, it's overpowered. If one has all red, it's underpowered. The interesting design space is the rock-paper-scissors structure where each archetype has counters.

For Dad TCG with ~15-25 archetypes, the matrix is large but tractable. Run nightly via a `loop` or `schedule` skill; diff today's matrix against yesterday's; flag matchups that moved more than X percentage points. This catches accidental balance regressions when you tweak a single card.

## Solitaire test

Before considering opponent interaction, ask: **does this deck function alone?** Strip the opponent out (or reduce them to a passive damage clock) and play the deck against itself. Does it draw enough? Does it have enough mana acceleration? Does it ever fail to play any card on turn 3?

This catches deck-construction problems that opponent-vs.-opponent simulation hides. A combo deck that wins 65% against one specific opponent might still fail to assemble its combo 40% of the time, which is a deck-quality problem visible only in solitaire.

## Balance dashboards

Public dashboards (Marvel Snap's published win-rate data, MTG Arena's metagame trackers like 17lands and untapped.gg) are aspirational; you don't need them in v1. What you do need:

- **Daily matrix** (HTML output from the simulator, viewable in a browser).
- **Card-level stats:** for each card, win rate when played vs. when not played, average turn played, average mana spent on it.
- **Game length distribution:** if average game is 12 turns and you wanted 8, the resource curve is wrong.
- **Concession rate:** in human playtests, when do players feel the game is over before it actually is?

These are HTML pages or terminal outputs, not a hosted dashboard. Don't build infrastructure; build artifacts.

## Mathematical proxies

Cheap, useful evaluators that don't require simulation:

- **Mana curve evaluator:** plot card cost distribution; flag decks where the curve is pathological (e.g., all 5-drops).
- **Average cost calculator:** mean and median mana cost.
- **Expected value of card draw:** for a deck of 60 cards, what's the expected damage / utility / threat per drawn card?
- **Vancouver Mulligan or London Mulligan equivalent:** if Dad TCG has a mulligan, simulate opening hands and report "% of opening hands that have at least one playable turn-1 card."

These are spreadsheet-tier calculations and run in milliseconds. Use them as fast feedback during card design.

## Recommendation for Dad TCG

A four-tier system:

1. **`sim.js`** — JS engine reused for AI vs. AI, runs 10K matches in under a minute.
2. **`balance.js`** — generates the matchup matrix, card-level stats, game-length distribution as static HTML in `/sim-out/`.
3. **Daily run** via the `loop` or `schedule` skill (or a GitHub Action triggered on commits to `cards.json`). Output committed to a `balance/` branch for diff visibility.
4. **Weekly human playtest** — non-negotiable.

Total tooling code: probably 500-800 lines. Smaller than the engine itself.

## Anti-patterns to avoid

- **Don't build a balance "tool" with a UI.** It's a script that outputs HTML/JSON. UIs absorb effort that should go into card design.
- **Don't simulate before the engine is correct.** A simulator amplifies engine bugs into convincing-looking nonsense. Get unit-test coverage on the engine first.
- **Don't trust simulator results for "feel" questions.** Win rate is a real signal. Fun is not. Pen-and-paper or in-app human playtesting is the only source for fun.
- **Don't over-tune to the simulator's AI.** If the AI plays oddly, the matrix reflects oddly. Improve the AI first; then trust the matrix.

## Honest gaps

There is **no canonical TCG balance tool I know of as of Jan 2026 cutoff** that you can plug Dad TCG's catalog into. Every studio builds their own. The good news: with a JSON card catalog and a pure-functional engine, your tooling is genuinely small. The bad news: it's still your problem.

Marvel Snap and MTG Arena have well-known *internal* tools that are not public. Academic TCG balance papers exist but apply to specific games. You will be writing this; the patterns above are the well-trodden path.
