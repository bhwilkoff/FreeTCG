# Project Scratchpad — Dad TCG

## Current State

- **Status**: M0 nearly complete — eight foundational design decisions locked (D011-D018). Ready to draft Rules v0.1.
- **Active milestone**: M0
- **Last session**: 2026-05-08 — kickoff + Masculinity-Detox integration + eight major mechanics decisions locked via two AskUserQuestion rounds.
- **Next actions**:
  1. Review the draft `/docs/RULES.md` (Rules v0.1, derived from D011-D018)
  2. Confirm or override the secondary inferences flagged in RULES.md (deck size, zone names, Intention mechanics, Resonance economy)
  3. Approve or revise the archetype draft once it's revised against the 6-faction structure
  4. Create the Xcode project at the repo root (see `/docs/ios-setup.md`)
  5. Enable GitHub Pages on `main` and pick the live URL
  6. Start M1 build: card data, JS engine, simulator
- **Open questions**: see "Open Questions" section below — most M0 questions are now resolved; new M1 questions live in RULES.md as inline callouts.

---

## Feature Parity Status

✅ Complete on both | 🌐 Web only | 📱 iOS only | ⏳ Planned | ❌ Deferred

| Feature | Web | iOS | Notes |
|---|---|---|---|
| Project scaffolding | ⏳ | ⏳ | M0 in progress |
| Card catalog viewer | ⏳ | ⏳ | M1 — read-only browse of all archetypes/cards |
| Local pass-and-play | ⏳ | ⏳ | M2 (web), M4 (iOS) — two humans on one device |
| Solo vs AI opponent | ⏳ | ⏳ | M3 (web), M5 (iOS) — rule-based heuristic AI first |
| Game Center peer-to-peer | ❌ | ⏳ | M6 — iOS only by design (web has no networked play) |
| Save/resume games | ⏳ | ⏳ | M2/M4 — localStorage on web, SwiftData on iOS |
| Accessibility (WCAG AA) | ⏳ | ⏳ | Required at every milestone, audited at M2 and M4 |

---

## Milestones

### M0 — Project Setup & Research (current)

- [x] Tone, audience, gameplay model decided (warm + witty; solo AI / pass-and-play / Game Center P2P; original archetypes)
- [x] CLAUDE.md filled in with Dad TCG project identity
- [x] DECISIONS.md updated with decisions 006-018 (project identity through full mechanics frame)
- [x] SCRATCHPAD.md milestones drafted
- [x] /research/ folder structure built
- [x] /data/ schema scaffolding written
- [x] /docs/ios-setup.md written (Xcode project creation steps)
- [x] /research/tcg-analysis/ populated (4 files)
- [x] /research/claude-skills/ populated (8 files)
- [x] /research/boba-lessons.md populated
- [x] /research/masculinity-detox-extraction.md populated (30-virtue framework)
- [x] /research/SYNTHESIS.md written + addendum after Masculinity-Detox review
- [x] /research/archetypes-draft.md written + addendum (full revision pending faction lock-in)
- [x] **Twenty foundational design decisions locked (D011-D030):** previous sixteen plus: per-shared-tag Resonance, permanent Tool attachment, 25/40/60 card text guideline, Your Family / Your Craft / Your Community zone names
- [x] **v0.2 design pivot locked (D031-D038)**: 8-Year match, Moments-as-win-condition, 15-card singleton, per-Year Attention reset, every Year has capture criteria, Snap-style board persistence, no global Resonance, no declared Intention. See `/docs/PLAYER-EXPERIENCE.md` for the design north star.
- [ ] **v0.2 rewrite phase 1**: rewrite 12 sample card texts in player-goal language (showing what good looks like)
- [ ] **v0.2 rewrite phase 2**: rewrite ~28 Year cards with explicit capture criteria
- [ ] **v0.2 rewrite phase 3**: rewrite RULES.md to v0.2 (8-Year structure, capture-driven gameplay)
- [ ] **v0.2 rewrite phase 4**: rewrite js/engine.js to match (drop Intention phase, drop Resonance, add Year capture resolution, no slot cap, 15-card singleton support)
- [ ] **v0.2 rewrite phase 5**: rewrite UI around story-and-tactics (always-visible Highlight Reel, Year card front-and-center, hover tooltips, plain-language card text, parallel-dad framing for AI)
- [ ] **v0.2 rewrite phase 6**: implement first-match tutorial (3 Years coached)
- [x] Draft `/docs/RULES.md` v0.1 (with Moments + Year deck + Missed Years; warm/dry-funny loss-frame voice)
- [ ] User reviews RULES.md and confirms secondary details (deck size, zone names, etc.)
- [ ] Xcode project created at repo root (manual step, see /docs/ios-setup.md)
- [ ] GitHub Pages enabled, live URL chosen and recorded in CLAUDE.md
- [ ] First commit to `main` after scaffolding lands

### M1 — Rules + Card Pool + Playable Web Prototype (Pass-and-Play)
*"After this milestone, two humans can play a full Dad TCG match in the browser on one device, with the engine, AI-vs-AI simulator, and full card pool all using the same JSON data."*

- **Learning checks**:
  - [ ] Deepens understanding — rules model genuine strategic depth (curve, tempo, archetype synergies), not luck-only outcomes
  - [ ] Invites participation — rules invite fan-made variants; archetypes invite "who's MY dad-figure"
  - [ ] Supports agency — players can edit a local copy of /data/cards.json to homebrew
- **Acceptance criteria**:
  - [x] `/docs/RULES.md` — complete and unambiguous (drafted v0.1)
  - [x] `/docs/EFFECTS.md` — card-effect JSON DSL specification (~21 ops, 3 worked examples)
  - [x] `/data/archetypes.json` — 18 archetypes locked with action-coded virtue tags (3-3-3-3-3-3 across factions)
  - [~] `/data/cards.json` — 12-card sample; full pool (60-80) is content-author work (post-engine)
  - [x] `/data/year-cards.json` — 28 Year cards in JSON (56% of the planned 50; rest is content-author work)
  - [x] `/js/engine.js` — pure-functional reducer; ~1000 lines; deterministic with seeded RNG; phase state machine; Resonance; Kin maturity; end-of-match Legacy summary
  - [x] `/js/rng.js` — Mulberry32 seeded PRNG, pure-functional
  - [x] `/js/ai.js` — heuristic action scorer reading effect ops directly; 3 difficulty levels (easy/normal/hard)
  - [x] `/js/ui.js`, `/js/app.js`, `/js/data-loader.js`, `/js/save.js` — minimal playable UI (menu / hand / 3 zones / Year card display / Legacy summary / Highlight Reel / hand-off interstitial)
  - [x] `/js/test-runner.js` + `/js/engine.test.js` — engine integration tests (Node-runnable; needs Node install on this machine)
  - [ ] `/js/sim.js` — AI-vs-AI batch simulator (deferred to next M1 turn)
  - [x] localStorage save/resume working (basic; Save.save/load/clear)
  - [x] Smoke test: `python3 -m http.server 8080` → all assets load (200 OK), all 3 JSON files parse, all 7 JS modules served
  - [ ] `/js/engine.js` — pure JS reducer, fully unit-tested, deterministic with seeded RNG
  - [ ] `/js/sim.js` — AI-vs-AI simulator that runs 10K matches in <1 minute, outputs matchup matrix
  - [ ] Web app: **playable pass-and-play prototype** with full game loop (draw, pitch, play, resonance check, year-card flip, end-of-match Legacy Summary + Highlight Reel)
  - [ ] At least 5 web playtest sessions logged in /research/playtest-log.md
  - [ ] iOS app shows card catalog (read-only viewer; play comes in M3)
  - [ ] WCAG AA pass on the play and catalog views
  - [ ] Localstorage save/resume working

### M2 — Web Solo vs AI + Balance Pass via Simulator
*"After this milestone, a single player can complete a full game vs a CPU opponent, and the simulator has produced a published matchup matrix that informs balance edits."*

- **Acceptance criteria**:
  - [ ] AI plays cards using rule-based heuristics that read JSON effect ops directly
  - [ ] Easy / Normal / Hard difficulty levels (lookahead depth + sampling variance)
  - [ ] AI never cheats (only sees public information)
  - [ ] AI completes a turn in under 1 second on mid-tier mobile
  - [ ] Simulator runs nightly, output committed to /balance/ branch
  - [ ] At least one balance pass: 3-7 cards adjusted based on simulator + playtest data
  - [ ] Self-mirror sanity check: every archetype-vs-itself win rate ≈ 50%

### M3 — iOS Pass-and-Play + Solo vs AI
*"After this milestone, both iOS modes match web parity."*

- **Acceptance criteria**:
  - [ ] Pure-Swift game engine in `DadTCG/Game/` mirrors web behavior (cross-validated by sharing seeds)
  - [ ] SwiftData persistence for in-progress games
  - [ ] Pass-and-play UI on iPhone
  - [ ] AI parity with web M2 (same heuristics, same difficulty levels)
  - [ ] VoiceOver fully describes every card and action
  - [ ] Performance budget held (60fps during AI turns)

### M4 — Game Center Peer-to-Peer (iOS)
*"After this milestone, two players on different iPhones can play a complete match."*

- **Acceptance criteria**:
  - [ ] GameKit turn-based match flow: invite, accept, take turn, sync state
  - [ ] Match data ≤ 64KB (GameKit per-turn limit) — verify with stress test
  - [ ] Disconnect handling: resume from last synced state
  - [ ] Anti-cheat: server-authoritative resolution? Or client-authoritative with reconciliation? (Decide in M5/M6 planning.)

---

## Web App Status

### Completed
- (none yet — M0 scaffolding in progress)

### Next for Web
- M0: research review, then start M1 (rules + catalog)

---

## iOS App Status

### Completed
- (none yet — M0 scaffolding in progress)

### Next for iOS
- M0: create Xcode project at repo root (see /docs/ios-setup.md)

---

## Open Questions

- **Card art pipeline**: text-only for v1 (decided 2026-05-08). Revisit in M2 — do we want a procedural visual style (CSS gradient + SF Symbol) for cards even before illustrations? Probably yes for vibe.
- **Multiplayer architecture for web**: out of scope per CLAUDE.md (zero-cost static hosting). Could revisit with WebRTC + a free signaling broker (PeerJS?) post-M3 if the user wants web↔web online play.
- **Anti-cheat for Game Center**: client-authoritative is simpler but trust-dependent. Decide before M6.
- **Card balance methodology**: Monte Carlo simulator? Manual playtesting only? Hybrid? Decide in M1 once mechanics are drafted.
- **Card rarity / collection**: User said "gameplay over collection". Should there be rarity at all (for variety in card pool) or fully flat (every card available)? Lean: flat in v1, no booster/collection mechanics.

---

## Session Log

### 2026-05-08 — Kickoff session
- **State found**: empty template (CLAUDE.md, SCRATCHPAD.md, DECISIONS.md with placeholders; index.html stub; /css /js /ios scaffold; AppVersion.xcconfig at root).
- **Work done**:
  - Clarified product direction with user (4 decision questions × 2 rounds)
  - Filled in CLAUDE.md with Dad TCG identity, design tokens v0, voice rules
  - Drafted full milestone plan (M0–M6) in this scratchpad
  - Appended Decisions 006–010 to DECISIONS.md, fixed placeholder dates on 001–005
  - Built /research/ folder structure and /data/ schema scaffolding
  - Wrote /docs/ios-setup.md
  - Dispatched 3 background research agents (TCG analysis, Claude Code skill survey, BOBA lessons)
  - First two agents hit tool-permission denials; relaunched with adjusted constraints
- **State left**: research agents running in background. Scaffolding complete. User to review research deliverables and approve before M1 begins.
