# Architectural Lessons from BOBA Playbook for Dad TCG

*Source: read-only review of /Users/user/Documents/GitHub/BOBA-Playbook/ on 2026-05-08.
Goal: extract architectural patterns, NOT card content or domain logic. Dad TCG is unrelated to Bo Jackson, sports, or any BOBA theme.*

---

## Top-Line Summary

**BOBA Playbook succeeds because it decouples concerns ruthlessly and ships shared contracts across platforms.** Five key takeaways for Dad TCG:

1. **Canonical data model (`play-effects.json`) drives both platforms.** One authoritative JSON schema becomes the source of truth for game logic; both web (a 359KB `practice.js`) and iOS (an 1,868-line `PlayEffects.swift`) consume the same structure.
2. **State machine, not callbacks.** Battle phases (Reveal → Substitution → Play → Resolution → Cleanup) are explicit enums; phase progression is deterministic and testable.
3. **Executor pattern decouples effect resolution from state mutation.** Effects parse to immutable *intents*; state gets applied *after* the op resolves, avoiding cascade bugs.
4. **Platform differences are acceptable; feature parity is mandatory.** iOS gets device-specific features; web stays vanilla JS. But core gameplay logic is identical.
5. **Instrument first, iterate second.** When debugging, add diagnostics before changing code. Remove them before shipping.

---

## 1. Repository Structure Overview

```
BOBA-Playbook/
├── /js/                    # Web game engine (~510KB across 12 files)
│   ├── practice.js         # Deck builder + battle engine + CPU AI (8,177 lines)
│   ├── app.js              # App shell, view switching
│   ├── api.js              # Supabase client (BOBA-specific; Dad TCG has no backend)
│   └── ...
├── /BOBAPlaybook/          # iOS Xcode project root
│   ├── /Store/             # Game state (@Observable singletons)
│   │   ├── PracticeStore.swift   # Battle state machine (5,247 lines)
│   │   ├── PlayEffects.swift     # Effect executor (1,868 lines)
│   │   └── ...
│   ├── /Views/             # SwiftUI screens per feature tab
│   ├── /Models/            # Card, Deck, UserCard
│   └── /Services/          # Networking, Vision scanning
├── /assets/data/           # Static JSON: cards.json, play-effects.json
├── /Game Rules/            # PDF references
├── PLAY_EFFECTS_SCHEMA.md  # Effect DSL canonical reference (~594 lines)
└── index.html              # Web app entry (148KB monolithic single-page)
```

**Gameplay logic concentrates in three files:**
- Web: `js/practice.js` (engine + CPU AI)
- iOS: `PracticeStore.swift` (battle state machine)
- iOS: `PlayEffects.swift` (effect executor — mirrors web executor)

---

## 2. Game Loop & Turn Structure

**BOBA models a battle as a finite state machine with five phases:**

```swift
enum BattlePhase {
    case reveal       // Heroes flip; persistents fire on_reveal
    case sub          // Substitution window
    case play         // Play window (both players run cards)
    case resolution   // Calculate power; declare winner
    case cleanup      // Discard played cards; advance battle
    case matchOver
}
```

**Per-battle deterministic flow:**

1. **Reveal** — both players' active cards flip; fire `on_reveal` persistents; declare honors winner.
2. **Substitution** — optional swap; honors player moves first; fire `on_substitute` persistents.
3. **Play** — both players run plays sequentially; each call goes through the effect executor; state applies after each card resolves.
4. **Resolution** — sum base power + play deltas + global modifiers; compare; fire `on_win`/`on_loss`/`on_tie` persistents.
5. **Cleanup** — discard played cards; reset; advance battle index or end match.

**Critical insight:** `(currentBattle, phase)` fully defines execution context. Given those two values, you can deterministically step the game forward without querying UI state.

**For Dad TCG:** model phases the same way. Whatever a Dad TCG turn looks like (TBD in M1), make every phase an explicit enum value with explicit entry/exit rules. Don't use booleans or implicit derivations.

---

## 3. Card Data Model

**Two-file split — catalog + effects:**

```json
// cards.json (catalog only, ~17,968 entries in BOBA)
{
  "bobaId": "BP-42-Low_Turnover-Base_Set-First_Edition",
  "name": "Low Turnover",
  "cardType": "Hero|Play|HotDog|Bonus Play",
  "rarity": "Common|Uncommon|...",
  "imageFile": "...",
  "imageAvailable": true
  // No effect details here — purely metadata + display
}
```

```json
// play-effects.json (executable behavior, keyed by name)
{
  "name": "Low Turnover",
  "cost": 1,
  "ability": "...human-readable rules text...",
  "effects": [ /* ordered ops, branches, choices */ ],
  "persistent": [ /* effects that fire later */ ],
  "ui": { /* hints for choice/targeting */ },
  "strategy": "...designer commentary..."
}
```

**Primary key:** `bobaId` is collision-free across all 17,739 cards. Survives reprints, variant spellings, art printings.

**For Dad TCG:**
- Use `id` as a slug-form primary key (e.g., `the-coach-pep-talk`).
- Split catalog (display metadata) from effects (executable logic). Different audiences edit different files.
- Effects file is keyed by stable id, not by name (names can collide if you do alt-art / promo printings later).

---

## 4. Effect/Rules DSL

**`play-effects.json` is a mini-language for card behaviors. Every play is data-driven; no card logic is hardcoded.**

### Op vocabulary (90+ ops in BOBA, covering all mechanics)

**Power modification:**
- `power` — delta to active power
- `power_double`, `power_swap`, `power_steal`, `power_set`, `power_cap_min`

**Resource management:**
- `hd` (cost currency delta), `draw`, `discard`, `shuffle_hand_into_deck`

**Deck/search manipulation:**
- `search` — find card in deck/discard; to hand or active
- `reveal` — peek top N with conditional branches
- `peek_unrevealed`, `reorder_unrevealed` — manipulate face-down cards

**Randomness (extensible, aggregate-capable):**
- `coin_flip` — single or multiple with aggregate outcomes (`all_heads`, `per_tail`, etc.)
- `dice_roll` — single-player or versus, with rerolls
- `compound_roll` — coin + die combined patterns

**Meta/control:**
- `cancel_opponent_plays`, `protect_self`, `force_sub`, `block_sub`, `cancel_persistent`
- `choice` — player picks option (branching)

### Branches & conditions

```json
{
  "if": { "type": "weapon", "target": "self", "weapon": "FIRE" },
  "then": [ /* ops */ ],
  "else": [ /* ops */ ]
}
```

Condition types: `weapon`, `hd_count`, `hand_count`, `discard_count`, `battle_num`, `battles_won_streak`, `power_threshold`, plus logical combinators `all`, `any`, `not`.

### Formulas (for "+N per X" scaling)

```json
{
  "op": "power", "target": "self",
  "delta": {
    "factor": 10, "metric": "plays_used_this_battle",
    "target": "self", "offset": -10, "min": 0, "max": 100
  }
}
```

Resolves to: `max(min, min(max, factor * metric + offset))`.

### Persistent effects

```json
"persistent": [{
  "scope": "rest_of_game | next_battle | battles_4_7",
  "trigger": "on_reveal | on_win | on_substitute | continuous",
  "target_filter": { /* condition */ },
  "effect": { /* op or branch */ }
}]
```

**Critical pattern:** Effects are **immutable specs** parsed from JSON. Executor walks the spec tree, returns deltas + intents. **State is only applied after execution completes.** This prevents cascading side effects and makes debugging deterministic.

**For Dad TCG:** budget real time to design the DSL before writing cards. BOBA spent ~2 months on PLAY_EFFECTS_SCHEMA.md and that investment paid off — once the DSL stabilized, new cards became data instead of code.

---

## 5. Web Architecture

**index.html is monolithic (148KB) but structured:**

```html
<body>
  <header id="mobile-header">…</header>
  <header id="desktop-header">…</header>
  <nav id="channels-sidebar">
    <button>Find</button><button>Learn</button><button>Decks</button>
    <button>Collection</button><button>Purchase</button>
  </nav>
  <main id="main-content">
    <section id="find-view" hidden>…</section>
    <section id="learn-view" hidden>…</section>
    …
  </main>
</body>
```

**Structural rules (binding spec in WEB-DESIGN.md):**
- Body = fixed-height flex column. No `viewport-fit=cover`. Header pins as first flex item; main scrolls internally. (Prevents Safari Dynamic Island bleed.)
- **Native HTML first** — `<dialog>` for modals, `<details>` for collapsibles, Popover API for dropdowns.
- **One verb per tab** — Find / Learn / Decks / Collection / Purchase. Single-word verbs; clear mental model.
- **Navigation depth ≤ 2** — view → list → detail. Anything deeper = filter or new tab.
- **Search is the navigator** — sticky-top `<input type="search">` with URL-encoded filters.
- **No framework, no build step.** Vanilla HTML, CSS custom properties, ES2022+ JS, third-party SDKs via CDN.

**CSS:** single `/css/styles.css`, mobile-first `min-width` queries, native CSS Nesting + Container Queries, no Sass, no Tailwind, no utility-first framework.

**JS organization:** `app.js` (shell + view switching), `api.js` (data layer), feature files `practice.js`, `collection.js`, `auth.js`, etc. **Hot path (game engine) lives in its own file.**

**For Dad TCG:**
- Same architecture. Vanilla. One stylesheet. View system via `hidden` toggling.
- Game engine (`js/game/*`) gets its own module(s), no DOM access.
- Don't let `index.html` cross ~10K JS lines without splitting.

---

## 6. iOS Architecture

**SwiftUI + @Observable + SwiftData (iOS 17+).**

```swift
@main
struct BOBAPlaybookApp: App {
  @State var appStore: AppStore
  var body: some Scene {
    WindowGroup {
      ContentView().environment(appStore)
    }
  }
}
```

**State management — neither MVVM nor Redux:**
- `@Observable` macros on singletons (AppStore, PracticeStore, DeckBuilderStore).
- Views read via `@Environment(StoreType.self)`.
- State mutations directly: `store.playerScore += 10`.
- No view models; stores ARE the view models.
- SwiftData for local persistence (catalog, saved decks, in-progress games).

**Effect execution (PlayEffects.swift) mirrors the web executor:**
- Pure function: takes effect spec + game context; returns deltas + intents.
- Caller (PracticeStore) applies intents.
- Unknown ops log but don't abort (forward compatibility for new cards added later via JSON update).

**Two-phase card loading:**
1. **Sync load** of `cards-head.json` (~500 cards, 192KB) blocks startup ~50ms — eliminates blank-screen.
2. **Async load** of full catalog (~12K cards, 4.7MB) in background — UI stays responsive.

**For Dad TCG:**
- Same `@Observable` + `@Environment` pattern.
- Game engine in `DadTCG/Game/` imports nothing UI-related — testable in pure Swift Testing.
- If catalog ever grows large, adopt the two-phase load. With our ~80 starter cards, single-phase is fine.

---

## 7. What Worked Well — Adopt for Dad TCG

1. **Canonical data-driven effects DSL.** Don't hardcode card logic. Write every effect as JSON that *both* platforms execute. Eliminates the plague of platform divergence.
2. **Explicit state machine (enum-based phases).** Never rely on derived state. Phase as enum; phase rules locally obvious.
3. **Executor-intent pattern.** Effects resolve to immutable intents *before* state mutates. Bugs become local and testable.
4. **One primary key per card.** `bobaId`-style stable slug. Don't use names (collide), don't use numbers (vary by printing).
5. **Platform parity is non-negotiable.** Build the engine once; port it twice.
6. **Static data + dynamic logic.** JSON is the catalog, JS/Swift code is the executor. Update JSON → redeploy fast.
7. **Document the binding rules.** DESIGN.md and WEB-DESIGN.md as binding specs (not guidelines). Every new feature must justify itself by an existing rule.
8. **CPU AI as test oracle.** A working CPU is proof your game state is well-defined.

---

## 8. What to Avoid — Anti-Patterns Observed

1. **No "TBD" / `note`-only entries in effects JSON.** BOBA had 118 placeholders that took months to clear. Dad TCG: every card mechanic must be expressible in the DSL or it doesn't ship.
2. **Avoid callback hell in effect resolution.** If you write `playCard(id, () => draw(3, () => …))`, refactor to immutable specs.
3. **Don't hardcode card lists in the engine.** No `if (card.name === 'X') doY()` in executor code. Special cases live in JSON.
4. **Platform divergence accrues debt.** Adding a web shortcut "just for now" that iOS doesn't have starts a branch that compounds.
5. **Don't trust derived state.** `currentBattle` and `phase` as source of truth. Don't infer "what battle it is" from `heroDeck.length`.
6. **Avoid monolithic index.html beyond ~10K JS lines.** Split into multiple `<script>` tags.
7. **Don't mix hot-path and cold-path in the same JS file.** Keep game engine separate from non-critical UI.
8. **iOS: avoid scattered `@State` across the view hierarchy.** Single `@Observable` store + `@Environment` to pass it down.
9. **Don't skip intent-based deltas.** If tempted to mutate state mid-effect, you're about to introduce a bug. Queue, then apply.
10. **Avoid implicit turn order.** Make `enum Honors { case player, opponent }` explicit; don't infer from conditions.

---

## 9. Concrete Recommendations for Dad TCG

Apply in order:

1. **Write `EFFECTS.md` (Dad TCG's PLAY_EFFECTS_SCHEMA.md equivalent) BEFORE writing cards.** Define the DSL vocabulary. Settle: what ops does Dad TCG need? Get it right once. Budget the time — this is the most leveraged decision in the project.
2. **Implement the executor in JavaScript first.** Build it in isolation with unit tests. No UI coupling. Once solid, port to Swift. Cross-validate by running both implementations against a fixture set of card scenarios with seeded RNG.
3. **Define turn phases as enums** — both platforms. Every phase transition explicit and logged.
4. **Build a CPU player early — even a naïve one.** Forces state determinism. If the CPU can play, the game is well-defined. If it can't, your state machine is missing information.
5. **Use stable slug IDs for cards from day one.** `the-coach-pep-talk`, not "Pep Talk".
6. **Separate the catalog (`cards.json` — display metadata) from the effects (`effects.json` — executable behavior).** Different files, different audiences, both linked by stable id.
7. **Keep rules documents alive.** `RULES.md` (player-facing), `EFFECTS.md` (DSL spec), `DECISIONS.md` (architectural rationales). Binding, not aspirational. New features need a rule entry first.
8. **Commit to one architecture layer at a time.** Phase order before effects; effects before UI. Don't parallelize. BOBA's phased approach (Stage 1 → Stage 2 → v1 → v2) ensured each layer was solid.
9. **Log everything during development; instrument before debugging.** When a result is wrong, add diagnostics first, change code second. Remove diagnostics before shipping.

---

## Quick Reference

| File / Concept | What we steal | What we don't |
|---|---|---|
| `PLAY_EFFECTS_SCHEMA.md` | DSL structure, op categories, branch/condition pattern | Specific BOBA ops (FIRE/ICE/STEEL etc. are sport-themed) |
| `practice.js` | Module split (engine in own file), executor pattern | Sport/Hero/HotDog vocabulary |
| `PracticeStore.swift` | `@Observable` store + `@Environment` pattern, phase enum | 7-battle match structure (Dad TCG turn structure TBD) |
| `PlayEffects.swift` | Mirroring the web executor in Swift, intent-based deltas | Specific persistents (`battles_4_7`, weapon-element conditionals) |
| Two-phase card load | Pattern is sound | Not needed at our scale (80 cards, not 17K) |
| Supabase backend | (none — Dad TCG has no backend in v1) | Don't introduce a backend casually |
| `bobaId` primary key | Slug-form, collision-free, survives reprints | Specific encoding (we'll use shorter slugs) |

---

**Final note:** BOBA Playbook is a mature, well-engineered companion app. The executor pattern, the canonical data model, the explicit state machine — these aren't quirks; they're hard-won lessons. Adopt the patterns. Skip the domain.
