# Dad TCG — Claude Code Project Context

## A Note on Why We Build

Before writing a single line of code, take a moment to understand the
orientation of this work. Every feature in this app is built in service of
human learning and growth — not to replace thinking, but to deepen it. At
each decision point, ask: Does this design invite the user to engage more
fully, think more critically, or connect more meaningfully? If a feature
makes a person more passive, reconsider it. If it opens a door to curiosity
or collaboration, prioritize it. The goal is never a slick product — it is a
tool that makes someone more human.

For Dad TCG specifically: the cards are people, the players are people, the
designers are people. The game should make players think warmly about the
fathers, dads, and male role models in their own lives — not by pulling on
sentiment, but by giving them characters worth strategizing with.

---

## Debugging and Diagnostic Philosophy

**Do not iterate blindly on behavior you cannot observe.** When a feature
does not work correctly and the root cause is not immediately clear from
reading the code, the first move is always diagnostics — not another
implementation attempt.

### Rule: Instrument before iterating

1. **Add console diagnostics immediately.** One round of real data is worth
   more than ten rounds of guessing.
2. **Design diagnostics to answer a specific question.** Write down what you
   expect to see vs. what would indicate the bug.
3. **Isolate layers.** Verify each layer independently before changing any.
4. **For iOS interaction bugs, add a temporary visual overlay** when the user
   cannot easily share a console.
5. **Remove all diagnostics before considering a fix complete.**

---

## What This App Does

Dad TCG is a fast, gameplay-first trading card game where players duel using
a roster of original "dad" archetype cards — The Coach, The Tinkerer, The
Storyteller, and dozens more. Each archetype is a positive male role-model
character with mechanical hooks tied to virtues like patience, presence,
mentorship, repair, humor, and showing up. The game is built to be played in
three modes: solo vs an AI opponent, local pass-and-play on one device, and
peer-to-peer online matches (iOS uses Game Center). Dad TCG is designed for
ages roughly 10+, including kids playing with their dads, adults playing on
flights, and friends playing on a phone at the kitchen table. Tone is warm
core, witty surface — sincere about fatherhood with humor and personality.

This app is available as both a **web app** and a **native iOS app**. The two
platforms are developed separately but maintain **feature parity** as a goal.
When adding a feature to one platform, note in SCRATCHPAD.md whether the
equivalent work is needed on the other.

---

## Platforms

### Feature Parity Model

Both platforms implement the same core feature set. Platform-specific
implementation choices are acceptable and expected. What should stay in sync:

- Which views/features exist
- Core UX flows
- Game rules (the ruleset is platform-neutral and lives in /docs/RULES.md)
- Card data (/data/ is shared between platforms; iOS bundles a snapshot at build time)
- Design language and color tokens

What may diverge by platform:

- Networked play: web is local-only (pass-and-play + solo vs AI). iOS adds
  Game Center peer-to-peer.
- Persistence: web uses localStorage. iOS uses SwiftData.
- Animations: each platform leans into its native idiom (CSS transitions on
  web, SwiftUI animations on iOS).

---

## Web App

### Tech Stack

- **Rendering:** Vanilla HTML/JS — no framework, no build step required
- **Styling:** Custom CSS (mobile-first, CSS custom properties for theming)
- **Game state:** Plain JS objects + reducer-style state machine in `js/game/`
- **Persistence:** `localStorage` for in-progress games, settings, deck saves
- **API:** None for v1 — game runs entirely client-side. No backend, no auth.
- **Auth:** None for v1. (Pass-and-play and solo vs AI need no accounts.)
- **Deployment:** GitHub Pages static hosting (branch: main, root: /)

### Key Directories

- `/` — Root: index.html, CLAUDE.md, SCRATCHPAD.md, DECISIONS.md
- `/css/` — Stylesheets (styles.css is the single main stylesheet)
- `/js/` — JavaScript modules (app.js, api.js — game/ subdir to be added)
- `/data/` — Card and archetype data (JSON, schema-validated). Loaded at runtime.
- `/research/` — Reference research (TCG analysis, Claude skill survey, BOBA lessons). NOT loaded by the app — for human reference only.
- `/docs/` — Player-facing rules and developer-facing setup docs.
- `/assets/` — Static assets (icons, images — placeholders only in v1)

### How to Run Locally

```
open index.html
# or
python3 -m http.server 8080  # then visit http://localhost:8080
```

### How to Deploy

1. Push changes to `main` branch
2. GitHub Pages serves from root of `main` automatically
3. Live URL: TBD (set when GitHub Pages is enabled)

### Web Conventions

- Game logic lives in `js/game/` and is platform-neutral — no DOM access from
  game/* files. Views read game state, dispatch actions; never the reverse.
- All API calls go through `js/api.js` — never call `fetch` directly from
  other files. (For v1 there are no API calls; this is forward-looking.)
- Card and archetype data is loaded once at startup from `/data/*.json`.
  Treat it as read-only at runtime.
- CSS custom properties (variables) are defined in `:root` in `styles.css`
- Mobile-first: all media queries use `min-width` breakpoints
- Semantic HTML throughout — use `<article>`, `<section>`, `<nav>`, `<button>`
- No inline styles — all styling via CSS classes
- Error states must be user-visible (not just console logs)
- **Navigation**: All nav items live inside `#channels-sidebar`
- **IntersectionObserver cleanup**: Any `IntersectionObserver` created for a
  view must be disconnected when leaving that view to prevent memory leaks
- **View system**: Use `showView(name)` to switch between views; each view is
  a `<section>` with `hidden` attribute toggled
- **Cards on screen are pure DOM** — re-render from state, never mutate
  card-element data attributes as the source of truth.

### Web Constraints

- GitHub Pages static deployment only — no server runtime, no Node.js
- Zero-cost tools only — no paid APIs, no paid hosting
- No build pipeline — everything must work as plain HTML/CSS/JS
- No third-party JS libraries unless absolutely required (and zero-cost CDN-served)

### Do Not Touch (Web)

- `.git/` directory
- GitHub Pages deployment settings

---

## iOS App

### Tech Stack

- **Language / UI:** Swift 6, SwiftUI (`@Observable`, iOS 17+)
- **Local persistence:** SwiftData (in-progress games, deck saves, settings)
- **Card data:** Bundled JSON at build time, loaded into SwiftData on first launch
- **Auth storage:** Keychain via Security framework (only used for Game Center identity tokens, if needed)
- **Multiplayer:** GameKit (Game Center turn-based matches) — iOS only, web has no networked play
- **API:** None for v1 except Game Center. No custom backend.
- **Fonts:** System (SF Pro) for v1. Custom fonts deferred until visual identity is locked.
- **Deployment:** Xcode build → App Store Connect → TestFlight / App Store

### Project Structure — Xcode Cloud Compatible

The `.xcodeproj` lives at the **repository root** so Xcode Cloud finds it
automatically. No subdirectory nesting, no spaces in project names.

```
/                              ← repo root
├── DadTCG.xcodeproj/          ← Xcode project at root (Xcode Cloud requirement)
├── DadTCG/                    ← iOS source code
│   ├── App/                   ← Entry point, app delegate
│   ├── Models/                ← Data models (Card, Archetype, GameState)
│   ├── Game/                  ← Pure-Swift game engine (no UI imports)
│   ├── Views/                 ← SwiftUI views (one subfolder per feature)
│   ├── Components/            ← Reusable UI components (CardView, etc.)
│   ├── Networking/            ← GameKit wrapper (turn-based match plumbing)
│   ├── Store/                 ← @Observable global state
│   ├── Resources/Cards/       ← Bundled card data JSON (snapshot of /data/)
│   ├── Assets.xcassets/       ← App icons, colors, images
│   └── Info.plist
├── AppVersion.xcconfig        ← Shared version numbers (both targets read this)
├── ci_scripts/                ← Xcode Cloud build scripts
│   └── ci_post_clone.sh
├── index.html                 ← Web app (GitHub Pages serves from root)
├── css/                       ← Web stylesheets
├── js/                        ← Web JavaScript
├── data/                      ← Shared card/archetype data
└── assets/                    ← Shared static assets
```

### How to Create the Xcode Project

See `/docs/ios-setup.md` for step-by-step instructions. The Xcode project
must be created via the Xcode UI — it cannot be generated from the command
line.

### iOS Conventions (Learned from Production)

- Game engine code lives in `DadTCG/Game/` and imports nothing UI-related —
  it must be testable in pure Swift Testing without launching the app.
- All API calls go through a shared client singleton — never call `URLSession` directly from views
- Auth state owned exclusively by one manager — views read via `@Environment`
- Global navigation state lives in an `@Observable` store with `NavigationPath`
- All views use `.toolbarBackground(.regularMaterial, for: .navigationBar)` +
  `.toolbarBackground(.visible, for: .navigationBar)` to prevent content
  scrolling behind the nav bar
- **Sidebar header**: use `VStack` with `.background()` modifier — never a
  `ZStack` with a `Color` sibling (layout-greedy, expands to fill height)
- **fullScreenCover with data**: use `fullScreenCover(item:)` with an
  `Identifiable` carrier struct. Never use `fullScreenCover(isPresented:)` +
  separate `@State` arrays (SwiftUI may evaluate content before state applies)
- **Card grid cells**: always constrain both width AND height before
  `.clipped()`. `scaledToFill()` without width constraint overflows columns
- **URLCache**: configure at app launch with large capacity (100 MB memory /
  500 MB disk) — relevant if/when card art is fetched remotely.
- **Version numbers**: use `AppVersion.xcconfig` at repo root with
  `MARKETING_VERSION` and `CURRENT_PROJECT_VERSION`. Both targets reference
  it. Never edit versions via the Xcode identity panel (creates per-target
  overrides that cause drift)

### iOS Constraints

- iOS 17+ minimum deployment target
- No third-party Swift packages — use only Apple frameworks (GameKit, SwiftData, SwiftUI, Foundation, CryptoKit, Security)
- Keychain for all credential storage — never UserDefaults for secrets

---

## Game Engine Architecture (both platforms)

The Dad TCG game engine is platform-neutral and is implemented twice (once in
JS, once in Swift) from a shared specification in `/docs/RULES.md`. Both
implementations must:

1. Be pure (no UI access, no I/O) — testable in isolation.
2. Take a `GameState` and an `Action`, return a new `GameState` and a list of
   resulting events. (Reducer pattern.)
3. Be deterministic given a fixed RNG seed. AI and online play depend on this.
4. Validate every action against the rules before applying it. Invalid actions
   raise descriptive errors that the UI surfaces to the player.
5. Treat card data as read-only at runtime. Effects are described declaratively
   in JSON; the engine interprets them, never patches them.

The card-effect format (JSON DSL) is documented in `/data/cards.schema.json`
and `/docs/EFFECTS.md` (to be drafted in M1).

---

## Shared Design System

### Design Tokens (v0 — to be refined via KUI:system in M1)

```
Primary (warm clay):       #C2562F   — buttons, active states, attack indicators
Secondary (heritage navy): #1A2B3D   — headers, key text, sidebar
Accent (mustard joy):      #E8A33D   — highlights, witty moments, dad-joke beats
Parchment background:      #FAF6EE   — main background (warm off-white)
Border (soft slate):       #C9CDD3   — card borders, subtle dividers
Ink (near-black):          #16181C   — body text
```

These are placeholders consistent with "warm core, witty surface". Run
`KUI:system` in M1 to design the full palette, type scale, and component
patterns.

### Voice & Copy Rules

- Warm, never saccharine. The game should feel like a dad's hand on your
  shoulder — present, supportive, a little bit funny, never performatively
  emotional.
- Witty, never cynical. Dad jokes welcome; cruelty about fathers, men, or any
  player is out.
- Inclusive. Dad TCG is about positive male role models in many forms. Avoid
  stereotypes about race, class, family structure, or what "real" dads do.
- Card flavor text is tight (one sentence). The mechanical text earns its
  keep first; flavor adds resonance after.

---

## Standing Instructions for Claude

### Learning Orientation — Six Criteria

Evaluate before implementing any feature:

1. **Does it deepen understanding?** Active engagement, not passive delivery.
   For Dad TCG: does the mechanic make players think about *why* a dad-figure
   acts the way they do?
2. **Does it invite participation?** Ask something of the user. (E.g., draft
   your own deck, name the strategy you used, etc.)
3. **Does it support human agency?** Make people more capable, not dependent.
4. **Clarity over cleverness** — simpler implementation always wins
5. **Accessible by default** — WCAG AA from line one. Card games are
   notoriously bad for screen readers; we will be better.
6. **Responsive from the start** — mobile-first, test at 375px before 1440px

### Autonomous Work Guidelines

- When uncertain between approaches, document in DECISIONS.md and choose simpler
- No feature additions beyond what's requested
- Only fix the bug, don't refactor surrounding code
- If a feature conflicts with learning-orientation values, surface the conflict
- For new game mechanics: prototype via the JS simulator and a minimal web
  UI before building polished UI. Dad TCG is **digitally playtested only** —
  there is no paper-playtest fallback. M1 must deliver a playable web
  prototype (pass-and-play first, then solo vs AI). Mechanics validated
  in the simulator still need human playtesting through the web prototype;
  polished UI built on broken mechanics is wasted work.

---

## Claude Skills Reference

The following Claude Code skills were used in Bsky Dreams development and
are available for this project. Invoke them via the Skill tool or by name.

### UI/UX Design — Killer UI (KUI)

These skills live in `.claude/skills/killer-ui/` and `.claude/commands/KUI/`.

| Skill | When to use |
|---|---|
| `KUI:system` | Create a design system (palette, typography, spacing, components) |
| `KUI:brand` | Develop brand identity (strategy, visual language, logo direction) |
| `KUI:screen` | Design screens following platform-native patterns |
| `KUI:review` | Full design critique (heuristic evaluation, visual hierarchy) |
| `KUI:code` | Convert designs into production-ready accessible frontend code |
| `KUI:a11y` | WCAG 2.2 AA accessibility audit with remediation plan |
| `KUI:darkmode` | Audit and fix dark mode issues (contrast, inverted colors) |
| `KUI:trends` | Research current design trends for any industry |
| `KUI:figma` | Generate Figma-ready specs (auto-layout, components, tokens) |

### App Store Assets

| Skill | When to use |
|---|---|
| `app-store-screenshots` | Generate App Store screenshot pages and promotional assets |

### iOS Development — all-ios-skills

40+ specialized iOS skills available. Most relevant for Dad TCG:

| Skill | When to use |
|---|---|
| `all-ios-skills:swiftui-patterns` | MV architecture, state management, environment |
| `all-ios-skills:swiftui-navigation` | NavigationStack, NavigationPath, deep linking |
| `all-ios-skills:swiftui-animation` | Card flip, draw, attack animations |
| `all-ios-skills:swiftui-gestures` | Drag-to-play card gestures, swipe interactions |
| `all-ios-skills:swiftui-performance` | Audit and improve runtime performance |
| `all-ios-skills:swiftdata` | Card catalog persistence, save games |
| `all-ios-skills:ios-accessibility` | VoiceOver for cards, Dynamic Type |
| `all-ios-skills:swift-concurrency` | Async/await for Game Center turn-based matches |
| `all-ios-skills:swift-testing` | Game engine unit tests |
| `all-ios-skills:app-store-review` | App Store review prep, rejection prevention |
| `all-ios-skills:codable-patterns` | Decoding card JSON safely |

(GameKit / Game Center is an Apple framework with no dedicated skill yet —
see `/research/claude-skills/ios-tcg-architecture.md` for references.)

### Code Quality

| Skill | When to use |
|---|---|
| `simplify` | Review changed code for reuse, quality, and efficiency |
| `claude-api` | Build apps with Claude API or Anthropic SDK (only relevant if we ever add LLM-driven flavor text or AI commentary) |

### How to Use Skills

Skills are invoked when relevant to your task. You can also request them
directly: "Use the KUI:system skill to create a design system" or "Run
the app-store-review skill to check for rejection risks."

For iOS skills, prefix with `all-ios-skills:` — e.g., "Use
all-ios-skills:swiftui-performance to audit the deck-builder scroll performance."

---

## Current State

See @SCRATCHPAD.md for per-platform feature status and planned work.
See @DECISIONS.md for all architecture decisions (web and iOS).
See @research/README.md for an index of TCG research, Claude skill survey, and BOBA lessons.
