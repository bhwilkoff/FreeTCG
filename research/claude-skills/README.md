# Dad TCG — Tooling & Skills Research Index

This folder surveys the open-source landscape, Claude Code skills, and architectural patterns relevant to building Dad TCG as a dual-platform indie TCG (vanilla JS web on GitHub Pages + SwiftUI iOS, no backend in v1, ~80 starter cards).

Each file below is ~600-1200 words. Read in order if you're new to TCG engineering; jump directly if you're scoping a specific subsystem.

*Source caveat: assembled from training-data knowledge (cutoff Jan 2026). URLs are flagged "(unverified URL — recall from training)" where present.*

## Files

### 1. `claude-code-skills.md` — Claude Code skills, plugins, agent patterns
**What to actually use:** No canonical TCG-specific Claude skill exists as of Jan 2026 cutoff. Lean on `KUI:system` for the card-frame design language, `KUI:screen` for game-board layout, `all-ios-skills:swiftui-patterns` and `swiftui-animation` for the iOS client, `simplify` after each card-effect addition (the effect schema will accumulate cruft fast), and the `init`/`milestone`/`status` skills to keep CLAUDE.md and SCRATCHPAD.md honest. Build your own project-local skill for "add a new card" once the JSON schema stabilizes.

### 2. `rules-engines.md` — Open-source TCG engines as references
**What to actually use:** Don't try to lift code from Forge or XMage — they're huge MTG-specific Java codebases under licenses (GPL) that will infect your repo. Read `boardgame.io`'s source for its move/reducer/log architecture; that's the closest free-to-borrow pattern for a JS TCG. Look at OCTGN's per-card Python script idea as a *concept*, not as code. For Swift, study `swift-composable-architecture` (TCA) as a mental model even if you don't adopt it wholesale.

### 3. `card-dsls.md` — How to encode card effects
**What to actually use:** A JSON DSL with a small op vocabulary (~20 verbs covering draw, deal, modify, condition, target, trigger) executed by a single interpreter is the right call for 80 cards. Don't write a parser; don't write per-card scripts; don't import a rules engine. The "executor intent" pattern (every effect produces a list of `Intent` objects that the engine validates and applies) keeps the engine pure-functional and testable.

### 4. `ai-opponents.md` — Building Dad TCG's AI opponent
**What to actually use:** Rule-based heuristic AI with weighted scoring for action selection, plus a 1-2 ply lookahead for "Hard" difficulty. Skip MCTS unless playtesting reveals the AI is genuinely flat. Difficulty = lookahead depth + how often AI takes the top-scored move vs. a random top-3 move. The AI must only see public information — no peeking at the player's hand.

### 5. `web-tcg-architecture.md` — Vanilla JS patterns
**What to actually use:** Reducer pattern with a single `gameState` object, dispatch via `applyIntent(state, intent)` returning new state. Persist to `localStorage` with a `schemaVersion` field and a migration function. Render cards as DOM (CSS Grid + Flexbox), animate with the Web Animations API (`element.animate()`) — better than CSS transitions for sequenced effects. Handle local 2-player with a "Pass device to Player 2" interstitial.

### 6. `ios-tcg-architecture.md` — SwiftUI patterns
**What to actually use:** One `@Observable` `GameStore` mirroring the web reducer (same intent vocabulary). SwiftData for the card catalog and saved games. `matchedGeometryEffect` for card-to-board moves. For online play, GameKit's `GKTurnBasedMatch` is the only zero-cost option but the 64KB per-turn data limit forces a delta-encoded turn log instead of full state snapshots.

### 7. `playtest-balance-tooling.md` — Balancing the game
**What to actually use:** Build the simulator before you build the second card. Reuse the JS engine as a pure module; run AI-vs-AI 10,000-match batches; output a win-rate matrix per archetype pairing. This is cheap, fast, and catches "this card is broken" before you've drawn art for 80 of them. Pen-and-paper playtest weekly with humans regardless — sims won't catch the *feel* problems.

## Recommended reading order for Dad TCG

1. `card-dsls.md` (decide your effect representation first — everything else depends on it)
2. `web-tcg-architecture.md` (build the engine on web; iOS will mirror it)
3. `playtest-balance-tooling.md` (wire the simulator on day one of card design)
4. `ai-opponents.md` (the AI is the simulator's actor)
5. `ios-tcg-architecture.md` (port the engine; reuse the JSON catalog verbatim)
6. `rules-engines.md` (reference, when you hit specific design questions)
7. `claude-code-skills.md` (process — apply throughout)

## Honest gaps

The TCG-specific tooling ecosystem is thinner than it looks. Most "engines" are MTG-specific and licensed in ways that prevent commercial reuse. There is no widely adopted open card-game DSL standard. You will be writing more from scratch than the prompt's tone suggests — but for 80 cards that's the right scope.
