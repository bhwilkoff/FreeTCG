# Open-Source TCG Rules Engines — What to Lift, What to Avoid

The "TCG engine" landscape divides into three groups: massive MTG-specific projects, generic turn-based frameworks, and single-game fan implementations. Almost none are appropriate for code reuse in an indie commercial TCG; most are valuable as architectural references.

## MTG-specific giants

### Forge
*Java. GPL-licensed. Comprehensive MTG rules implementation.* (unverified URL — recall from training: github.com/Card-Forge/forge)

What it does: implements essentially the entire Magic: The Gathering rule set, including the stack, priority, layered effects, replacement effects, triggered abilities, and tens of thousands of cards. It has its own DSL for card scripting.

What to lift: the *concept* of a layered effect resolution model (continuous effects applied in dependency order), the stack-as-data-structure idea, and the separation of "static abilities" from "triggered abilities" from "activated abilities."

What to avoid: don't try to vendor any code (GPL is incompatible with most indie commercial paths), don't try to learn from its DSL (deeply MTG-specific), don't try to read the whole codebase (it's hundreds of thousands of lines). MTG is a far more complex rules system than Dad TCG should be — Forge's complexity is justified for MTG and ruinous anywhere else.

### XMage
*Java. Networked play. Alternative MTG implementation.* (unverified URL — recall from training: github.com/magefree/mage)

Same lessons as Forge. Worth a glance for its server architecture (separating game state from network sync) but again GPL and overkill.

## Tabletop platforms

### OCTGN
*Generic table-with-cards platform; per-game scripts in Python.*

What it does: provides a virtual table where players manipulate cards manually; per-game packs add Python scripts that automate effects.

What to lift: the *idea* that each card can have a small associated script. This validates the "scripted per-card" approach but doesn't mean you should adopt it (see `card-dsls.md`).

What to avoid: OCTGN's "honor system" rules enforcement model — Dad TCG should be authoritative on rules, not advisory.

### Cockatrice
*MTG-focused; networked play; Qt client.* (unverified URL — recall from training: github.com/Cockatrice/Cockatrice)

Like OCTGN, it doesn't enforce rules — it's a multiplayer card-pusher. Useful only as a reference for *networking* a card game (server, lobby, room, sync), not for rules.

### Tabletop Simulator
*Commercial Steam app; Lua scripting; physics-based.*

Largely irrelevant to a code-driven TCG. Mentioned only because community TCG implementations exist there. The Lua scripting model is interesting but the physics-first design is the wrong abstraction for a digital-native game.

## Generic turn-based frameworks

### boardgame.io
*TypeScript. MIT-licensed. Generic turn-based game framework.* (unverified URL — recall from training: boardgame.io)

**This is the most relevant project on the list for Dad TCG's web side.** It provides:
- A reducer-style move system (`moves: { drawCard: (G, ctx) => {...} }`)
- Turn/phase management
- Deterministic game logs
- Optional client/server split with built-in networking
- Vanilla JS, React, and other client adapters

What to lift: the entire `(G, ctx) => newG` move signature, the phase/turn lifecycle abstraction, the immer-based state mutation pattern (move functions look mutating but produce immutable new states), and the move log as a first-class entity (essential for replays and debugging).

What to avoid: don't pull boardgame.io in as a dependency for the web app — it'll bloat the GitHub Pages footprint and add abstractions you don't need for an 80-card TCG. Reimplement the patterns yourself; the implementation is small.

### XState
*JavaScript/TypeScript. MIT. State machine library.*

Useful for modeling game phases (untap → upkeep → draw → main → combat → end → cleanup, or whatever Dad TCG's structure is). For a TCG, an explicit state machine for the *phase loop* prevents whole categories of bugs ("can the player play a sorcery during the end step?").

What to lift: the explicit state-machine modeling. Worth pulling in (~10KB) if you find yourself with phase-related bugs; not worth pulling in pre-emptively.

### swift-composable-architecture (TCA)
*Swift. MIT. Reducer architecture for SwiftUI.* (unverified URL — recall from training: github.com/pointfreeco/swift-composable-architecture)

Provides a Redux-flavored architecture for SwiftUI: `Reducer`, `Store`, `Effect`. For Dad TCG iOS, it's a strong fit if the team is comfortable with reducer patterns.

What to lift: the mental model. The actual library is heavyweight for an indie game; `@Observable` + a hand-rolled `applyIntent` function gives you 80% of TCA's value for 5% of the complexity.

## Single-game fan implementations

### Slay the Spire mods (ModTheSpire / BaseMod)
*Java. The original game uses LibGDX.*

While Slay the Spire is a deckbuilder roguelike rather than a head-to-head TCG, its mod ecosystem is instructive. Cards are subclasses of an `AbstractCard` base, with overridable `use()`, `triggerOnEndOfTurn()`, etc. Effects are imperative Java.

What to lift: nothing directly. The class-per-card pattern is the wrong choice for Dad TCG (see `card-dsls.md`); JSON-driven cards scale better at 80 cards and are massively easier to balance-test.

### Marvel Snap fan implementations
There are community projects attempting to recreate Marvel Snap's mechanics. None are canonical or well-known enough to recommend confidently. (no canonical option known to me as of Jan 2026 cutoff for a quotable repo URL.)

What's interesting about Marvel Snap as a *design reference*: simultaneous turn resolution, public-information game state (no hidden zones except hand and deck), short games (~6 turns). These are choices that simplify both the engine and the AI. Dad TCG could borrow any of them.

## Recommendation

**Read boardgame.io's source for two hours. Don't depend on it.** Build your own engine using the same shape: pure-functional reducers, an explicit move log, phase state machine, immutable state. For Swift, mirror the same shape with `@Observable` + intent functions. For rules-resolution complexity, study Forge's *layer* concept (continuous effects in dependency order) but only if Dad TCG actually needs it — for an 80-card game, you almost certainly don't.

The real lesson from this survey: **the engines that exist are either too big to fit or wrong-shaped for an indie TCG**. Build small, build pure, and keep the engine in one file you can read in a sitting.
