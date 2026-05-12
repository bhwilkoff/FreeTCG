# AI Opponents for Dad TCG

A "good enough" TCG AI is one of the highest-leverage features you can ship: it's the difference between a polished single-player experience and a tech demo. Fortunately, for an 80-card TCG, you don't need anything fancy.

## Approaches

### Rule-based heuristic AI

*Used by:* the vast majority of indie and mid-budget TCGs. Hearthstone's first-party AI was famously simple. Most Slay the Spire enemies are scripted.

The AI scores each legal action with a hand-rolled weight function and picks the highest score (or samples from the top-N). Scoring considers:
- damage dealt to opponent
- damage dealt to opponent's board
- card value gained (drawing, generating)
- resource efficiency (mana spent vs. effect)
- threat removed
- own life total preserved
- tempo (cards-played-this-turn, board presence)

**Pros:** fast (microseconds per decision); easy to debug ("why did the AI cast that?" → print the score table); deterministic given a seed; no training data needed; designer-tunable.

**Cons:** ceiling on play strength; misses combos and multi-turn plans; lacks bluffing.

**Verdict for Dad TCG: this is the baseline. Ship this first.**

### Monte Carlo Tree Search (MCTS)

*Used by:* AlphaZero, some Hearthstone bots in research literature, advanced board-game AIs.

The AI simulates many random playouts from the current state, weighted by which moves win. Strong play emerges from the simulation rather than from hand-coded knowledge.

**Pros:** discovers combos the designer didn't anticipate; scales play strength with compute budget; handles hidden information via determinization (sample possible opponent hands and average).

**Cons:** much slower (tens of ms to seconds per move); requires the engine to support fast cloning + simulation; harder to make *intentionally weak* (random rollouts are weirdly bad in specific ways).

**Verdict for Dad TCG: probably skip in v1.** If playtesting reveals heuristic AI is genuinely flat, MCTS is the next step. The engine you'll build (pure-functional, immutable state) is *exactly* the shape MCTS needs, so adding it later is feasible.

### Neural-net / AlphaZero-style

*Used by:* academic TCG research (e.g., DeepStack for poker; various MTG and Hearthstone AI papers).

Train a neural network on millions of self-play games to evaluate states and select moves.

**Pros:** strongest possible play.

**Cons:** training infrastructure is non-trivial; inference adds runtime cost; the model is a black box (debugging "why did it play that?" is nearly impossible); model size may not fit on-device for iOS without quantization work.

**Verdict for Dad TCG: out of scope.** Indie TCGs do not ship neural-net AI. Don't even prototype this.

### Hand-evaluator + simulation hybrid

*Used by:* some MTG bots; poker bots (Pluribus, etc.).

A hand-coded heuristic provides the leaf evaluation; tree search wraps around it. This is essentially "MCTS with a smart rollout policy" or "minimax with a heuristic eval."

**Pros:** stronger than pure heuristics; faster than pure MCTS; debuggable.

**Cons:** more code than pure heuristics; tuning two systems instead of one.

**Verdict for Dad TCG: this is the right answer for "Hard" difficulty.** See below.

## Recommendation for Dad TCG

A two-layer system:

### Layer 1: Action scorer (heuristic)

For every legal action `a` in the current state, compute `score(a, state) = w1*damage + w2*tempo + w3*card_advantage + ...` with hand-tuned weights. The scorer reads the JSON effect data directly — for a `deal_damage` op, the scorer adds the damage value; for a `draw_cards` op, it adds card-advantage value, and so on. This means *the AI generalizes to new cards automatically* — you don't write per-card AI code.

### Layer 2: Lookahead (for harder difficulties)

For each candidate top-N action from layer 1, simulate forward 1-2 turns (assuming the AI plays its top action and the opponent plays a *plausible* action drawn from the same scorer applied to known-public state), and pick the action with the best simulated outcome.

### Difficulty knobs

Three difficulty levels with no separate code paths:

- **Easy:** lookahead depth 0; pick a uniformly random action from the top 5 scored actions.
- **Normal:** lookahead depth 0; pick the top-1 scored action 80% of the time, otherwise sample from top 3.
- **Hard:** lookahead depth 2; always pick the best score after lookahead.

This is a single AI codebase, three configurations. Easy doesn't feel "dumb" — it feels like a player who sees the right plays sometimes but doesn't always pick them, which is what novice opponents *actually* feel like.

## The "AI never cheats" principle

The AI must operate only on information the player can see — the opponent's life, the cards in play, the cards in graveyard, the count of cards in opponent's hand and deck. **It must not peek at the player's hand or upcoming draws.**

Implementation: the AI receives a `publicView(state, asPlayer: 'ai')` projection of the state, with the opponent's hand replaced by a count and the deck replaced by a count. For lookahead, when the AI needs to simulate the player's response, it samples a plausible hand from the cards it has seen leave the opponent's deck (deck list inference — for Dad TCG with constructed decks, this is somewhat tractable since the AI knows the legal card pool).

This principle matters because:
- Players can usually feel cheating AI within 5 minutes (the AI plays around hidden info too perfectly).
- Streamers and reviewers will accuse the game of cheating if the AI looks omniscient.
- It's a learning-orientation value: the AI is a worthy opponent, not an obstacle that bends the rules.

## Design checks

For an 80-card pool with ~15-25 archetypes:
- The scorer's weights need ~10-20 dimensions, no more. If you find yourself adding a 30th weight, you're patching symptoms; rethink the scoring instead.
- Build a "what would the AI do here?" debug overlay showing the top 5 candidate actions and their scores. This is the single most valuable AI debugging tool you'll build. (Per CLAUDE.md: "Add console diagnostics immediately.")
- Run AI vs. AI in the simulator (`playtest-balance-tooling.md`). If the AI's win rate against itself is wildly skewed by player order or by deck archetype, the scorer is biased.

## Honest gaps

There is no public, reusable, MIT-licensed TCG AI library that would slot into Dad TCG as of Jan 2026 cutoff. There are research papers and game-specific bots; there is no `npm install tcg-ai`. You'll be writing this; the good news is the heuristic version is ~300 lines.
