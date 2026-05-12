# Claude Code Skills, Plugins, and Agent Patterns for TCG Development

## Honest baseline

As of training cutoff Jan 2026, **no canonical TCG-specific Claude Code skill is known to me**. There is no `tcg:design`, `tcg:balance`, or `card-engine` skill in the broader Claude Code ecosystem that I'm aware of. The skills useful for Dad TCG are general-purpose ones repurposed for game work.

## Skills available in this project

### Design / UX (Killer UI family)

These are well-suited for the visual layer of a TCG:

- **`KUI:system`** — Highest leverage for Dad TCG. Use it once early to establish the card-frame token system: cost pip color, card-type background, rarity gem, text-box treatment. Re-running it later costs less than fixing inconsistent cards.
- **`KUI:screen`** — Use for the play-board layout (player area, opponent area, hand, deck/graveyard zones, log). Card games have well-established conventions; KUI:screen will surface them.
- **`KUI:brand`** — Run once for "Dad TCG" identity (logo, palette, voice). The dad theming should drive personality choices.
- **`KUI:darkmode`** — Card games are often played in evening/low-light. Worth a pass after the basic visual system is in place.
- **`KUI:a11y`** — TCGs have a brutal accessibility surface: tiny text on cards, color-coded resources, drag gestures. Run this skill before launch and after every UI overhaul.
- **`KUI:review`** — Use periodically as a critique pass. Card games accumulate visual debt fast.
- **`KUI:figma`** — Useful only if you're handing specs to an artist. Skip if you're solo-coding.
- **`KUI:trends`** — Probably skip; TCG visual conventions are stable and the trends in card-game UI (Marvel Snap, Hearthstone, Slay the Spire) are well-documented in player communities.
- **`KUI:code`** — Useful for translating a Figma board layout into HTML/CSS, but the cost is moderate; you can probably hand-code a 5-screen TCG.

### iOS (all-ios-skills family)

The most relevant for Dad TCG's iOS client:

- **`all-ios-skills:swiftui-patterns`** — Essential. The `@Observable` `GameStore` pattern is exactly the architecture you want.
- **`all-ios-skills:swiftui-animation`** — Card movement, flip, draw, attack — animation is 60% of TCG game-feel.
- **`all-ios-skills:swiftui-gestures`** — Drag-to-play is the dominant interaction. Custom gesture recognizers may be needed for "drag from hand to target."
- **`all-ios-skills:swiftui-performance`** — TCG boards have many simultaneously animating views. Audit before ship.
- **`all-ios-skills:swiftdata`** — For card catalog and saved games.
- **`all-ios-skills:swiftui-navigation`** — Modest relevance; TCGs have shallow nav (menu → match → end-screen).
- **`all-ios-skills:ios-accessibility`** — Same reasoning as `KUI:a11y`. VoiceOver on a TCG is genuinely hard; this skill helps.
- **`all-ios-skills:swift-concurrency`** — AI thinking on a background actor; animations sequenced via async/await.
- **`all-ios-skills:swift-testing`** — The engine should be 100% unit tested. Easier in Swift Testing than XCTest.
- **`all-ios-skills:debugging-instruments`** — When animation jank appears (it will), this is the right tool.
- **`all-ios-skills:app-store-review`** — Run before TestFlight submission; card games hit specific review patterns (gambling-adjacent, IAP, packs).
- **`all-ios-skills:storekit`** — Only if you're selling card packs. Skip for v1.
- **`all-ios-skills:codable-patterns`** — Critical for sharing the JSON card catalog between web and iOS. The Codable models should mirror the JSON schema 1:1.
- **`all-ios-skills:swiftui-liquid-glass`** — Optional flair. Probably skip until v2.
- **`all-ios-skills:push-notifications`** / **`live-activities`** / **`widgetkit`** / **`app-intents`** — All deferrable to v2.

For multiplayer, you specifically want anything covering **GameKit** — there's no dedicated `gamekit` skill in the available list, so you'll be working from Apple docs and `swiftui-patterns` general guidance.

### Code quality / process

- **`simplify`** — Run after every meaningful card-effect addition. Effect interpreters accumulate special cases; this skill catches them.
- **`claude-api`** — Only relevant if you're calling Claude for in-game features (e.g., generating flavor text). Skip otherwise.
- **`init`**, **`status`**, **`milestone`**, **`decision`** — These are your project-management spine. Use `decision` whenever you make an architectural call (e.g., "JSON DSL chosen over scripted cards"). Use `milestone` to close M0/M1/M2 deliberately.
- **`review`** — Worth running on PRs that touch the engine.
- **`security-review`** — Low priority for a no-backend, no-auth TCG. Run before any feature that adds networking.

### Settings / harness

- **`update-config`**, **`fewer-permission-prompts`**, **`keybindings-help`**, **`loop`**, **`schedule`** — Process tools. `fewer-permission-prompts` is worth running once after the project is a few weeks in.

## Skills you might *want* but probably need to build yourself

For TCG work specifically, these would be high-value if you create them as project-local skills (`.claude/skills/`):

1. **`add-card`** — Reads the schema, prompts for name/cost/effect, generates the JSON, adds tests, updates the catalog index. After ~5 hand-written cards, the schema will be stable enough to automate.
2. **`balance-pass`** — Runs the simulator, reads the win-rate matrix, suggests cost adjustments. Wraps the playtest tooling described in `playtest-balance-tooling.md`.
3. **`card-art-spec`** — Generates an art brief for a card given its mechanics and flavor (composition, mood, palette).
4. **`port-to-ios`** — Reads a JS module and ports it to Swift, preserving the engine's pure-functional shape. Useful once the web engine stabilizes.

These don't exist canonically; they're in scope for a focused afternoon each.

## Agent patterns

For TCG dev specifically, two patterns recur:

- **Engine-then-UI**: build the rules engine as a pure module with full unit-test coverage *before* writing any UI. Both web and iOS UIs become thin views over the same engine logic.
- **Catalog-as-source-of-truth**: the JSON card catalog is the canonical artifact. Both platforms consume it. Edits to a card propagate everywhere by re-reading the catalog.

A subagent worth setting up: a "balance bot" that runs the simulator nightly and posts a diff of win rates. Easy with the `loop` or `schedule` skills.

## Plugins / MCP

I don't know of TCG-specific MCP servers as of Jan 2026 cutoff. The Supabase MCP listed in your environment is irrelevant for a no-backend v1.
