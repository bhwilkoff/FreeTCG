# Dad TCG — Research Synthesis & Open Design Questions

*Date: 2026-05-08. Status: proposal for human review. Nothing in this document is decided.*

> **ADDENDUM 2026-05-08 (post Masculinity-Detox review).** After the initial synthesis, we mined the user's prior repo at `/GitHub/Masculinity-Detox/` (see `masculinity-detox-extraction.md`). That review materially changes several proposals in this document. Where the addenda below contradict the original Part 2 proposals, **the addenda are the current recommendation.** The original text is preserved for audit.

## ADDENDUM A — Faction structure (replaces Q6 proposal)

The Masculinity-Detox repo gives us a **canonical 30-virtue taxonomy** (Kind, Attuned, Sincere, Present, Connected, Trusted, Active, Empathetic, Desirous, Willing, Open, Capable, Unfinished, Patient, Introspective, Loving, Conscious, Engaged, Responsible, Collaborative, Resilient, Adaptable, Supportive, Caring, Communicative, Grateful, Respectful, Curious, Purposeful, Equitable). Each virtue is a single adjective with a parenthetical. **This is the framework Dad TCG should use** — the user has already done the work.

The original Q6 proposal (5-6 invented Virtues) is wrong. Replace it with the canonical adjectives clustered into factions. Two viable approaches:

- **A. Five canonical-adjective factions: Present / Connected / Unfinished / Patient / Trusted.** Preserves the framework's actual language. Each card carries one faction (umbrella) plus 1-2 sub-virtue tags from the 30. Synergies fire on tags, not just factions.
- **B. Six general-noun clusters: Presence / Connection / Growth / Agency / Integrity / Resilience.** Cleaner naming, more mechanical balance, looser to the source vocabulary.

**Recommend A** as more on-brand and more distinctive. The factions ARE adjectives, which is itself the design move.

## ADDENDUM B — Resource is Attention, not Time (refines Q1 proposal)

From the Patient post: *"Patience is attention management, not time management. You can't always control time, but you can choose where your focus goes."* The original Q1 proposal called the resource "Time." That's wrong on the user's own framework. **The resource is Attention.** Cards cost Attention. Every turn refreshes Attention; some cards generate or extend it; some cards demand more of it than expected.

This single rename re-tunes the whole game: the player's strategic question is *"where am I putting my attention?"* — which is exactly the Patient virtue's lived practice.

## ADDENDUM C — "Unfinished" cards (new mechanical primitive)

The Unfinished virtue (*"Being unfinished is way more interesting than being done."*) suggests a Dad TCG-original mechanic: **cards never reach a final state.** Some cards have an "Unfinished" tag — they accumulate counters or layers as they remain in play, and never max out. The implication: longer-game decks reward investment without an arbitrary cap. The mechanical opposite of "evolution" or "leveling."

This is signature material — a primitive that other TCGs don't have, that's also genuinely on-theme.

## ADDENDUM D — "In-Progress" framing for the win condition (refines Q2)

The framework rejects arrival states. The Q2 proposal was a fixed 18-turn race-for-Memories. Consider instead: **"Most virtues genuinely practiced over the match."** Each turn you can mark one virtue as "practiced" if you played a card whose tag matches your declared intention that turn. After turn N, count distinct virtues practiced. Highest count wins; ties go to whichever player practiced the rarer virtues.

This is mechanically novel AND maps the win condition directly to the framework's *In-Progress* identity. *Trying* counts. The match isn't "kill the dad" or "score memories" — it's "live more virtues."

## ADDENDUM E — "Circle is Big Enough" interaction model (refines Q4)

The Empathetic virtue: *"My circle of empathy is big enough for the people I will fight with... when we are all in the circle, there is no us and them."* This argues against direct combat between players' cards. The Q4 proposal was Snap-style zone scoring; the framework refines this to:

- Cards in zones don't attack each other.
- Cards in opponent zones can be *resonant* (bonus to both you and opponent if your tags align).
- "Disruption" cards are soft — they reroute attention, never destroy.

The phrase "**no us and them**" is potentially the design philosophy of Dad TCG combat: *both players succeed when the right virtue is practiced, even on the wrong side of the table.*

## ADDENDUM F — Voice for card flavor text

The Rapid Reflection posts are the right register: terse, specific, lived, slightly dry. *"While you have no idea how she does it, you bow to her ability to make things happen in the face of incomprehensible systems."* Card flavor text should sound like that — one sentence, named relational moment, no preaching.

## What this means for Part 2 below

The original five most-consequential decisions (Q1 resource, Q2 win condition, Q3 match length, Q4 combat, Q6 factions) are still the right shape. The options have shifted with the new framework — see the next round of decision questions for the revised set.

---


This document reads across the three research streams (`tcg-analysis/`, `claude-skills/`, `boba-lessons.md`) and distills:

1. **Architectural recommendations** that the research makes clearly enough to commit to.
2. **Open mechanical design questions** where the research surfaces tradeoffs but the choice is yours.

The architecture section is short because the answers are well-trodden. The mechanics section is long because *that* is where Dad TCG's identity is decided.

---

## Part 1 — Architectural Recommendations (clear from research)

These come out of three independent streams pointing the same direction. I recommend committing to them as defaults; flag any you disagree with.

### A1. Pure-functional engine, intent-based mutations

A single `applyIntent(state, intent) → newState` function in JS, mirrored as `engine.applyIntent` in Swift. State is a plain serializable object (JS) / value-type struct (Swift). No DOM/UIKit access from engine code.

*Why:* enables save/load via JSON, replays, deterministic simulation, dual-platform parity. BOBA does this; boardgame.io does this; the research is unanimous.

### A2. Card effects as JSON DSL with small op vocabulary

Cards are pure data (`/data/cards.json`). Effects are structured op trees (`{op: 'deal_damage', amount: 6, target: 'chosen'}`), executed by a single interpreter. ~15-20 ops cover most needs. New mechanic = new op (rare event).

*Why:* same JSON ships on web AND iOS, balance changes are JSON edits, AI can read effects to score plays, simulator runs thousands of games per minute. BOBA's PLAY_EFFECTS_SCHEMA is the architectural template.

### A3. Executor-intent pattern (effects produce intents; engine validates+applies)

Effects don't mutate state directly. They produce a list of `Intent` objects. The engine collects intents, validates them (e.g., can't damage an immune target), then applies them in one reducer pass. This is the *single most important* pattern from BOBA's lessons document.

*Why:* prevents cascading-side-effect bugs, makes turns fully replayable, makes debugging deterministic.

### A4. Game phases as an explicit enum / state machine

Not booleans, not implicit. `enum BattlePhase { case draw, main, combat, endStep, ... }` (or whatever Dad TCG's phases turn out to be). Every transition is named and logged.

*Why:* eliminates "wait, can I play this card now?" bugs; makes the engine and the AI both legible.

### A5. AI = rule-based heuristic scorer reading effect ops

Score every legal action by reading its effect ops directly (so it generalizes to new cards). One scorer, three difficulty configurations: Easy = top-5 random, Normal = top-3 weighted, Hard = top-1 with 2-ply lookahead. The AI must only see public information.

*Why:* cheap, debuggable, no training, generalizes to new cards. ~300 lines of code total.

### A6. Simulator from day one of card design

A standalone JS module reusing the engine + AI, running AI-vs-AI in batches, outputting a matchup matrix and game-length distribution. Run nightly. Diff against yesterday's matrix on every cards.json change.

*Why:* surfaces broken cards before art exists. The matrix sanity-check (self-mirror = 50% win rate) catches engine non-determinism.

### A7. Weekly human playtest via the web prototype — non-negotiable

Dad TCG is digitally playtested. The web prototype itself is the playtest harness — pass-and-play on a single device for the early loop, then solo vs AI as soon as M2's AI lands. The simulator catches "is this card broken"; human play through the prototype catches "is this card *fun*". Both matter. **No paper playtesting; no print/cut workflow.** Iteration loop is: edit `/data/cards.json`, refresh browser, play.

### A8. Catalog and effects split across two files

`/data/cards.json` (display metadata: id, name, archetype, type, cost, rules text, flavor) and `/data/effects.json` (executable behavior: id, op tree). Same primary key links them. Different audiences edit different files.

### A9. Five evergreen keywords, no expansion-specific keywords in v1

Pick 5-7 keywords. Resist new ones until expansion 2. (Yu-Gi-Oh's accumulated keyword load is the cautionary tale.)

### A10. Soft-variants of "feel-bad" mechanics only

No hard counterspells, no hand discard, no stun-locks. Use soft variants ("their next card costs 1 more") that create tempo cost without removing agency.

### Architecture decisions to record in DECISIONS.md if approved

- D011: Pure-functional engine with executor-intent pattern (A1, A3)
- D012: JSON DSL for card effects (A2)
- D013: Phases as explicit enum (A4)
- D014: Rule-based heuristic AI with three difficulty configurations (A5)
- D015: Catalog/effects file split (A8)
- D016: ≤7 evergreen keywords; soft variants only for disruption (A9, A10)

---

## Part 2 — Open Mechanical Design Questions

Each section poses a question, summarizes the design space, and proposes a *starting point* with rationale. Treat the proposals as defaults to push back on, not conclusions.

---

### Q1. What is the resource system?

The single most consequential decision. Five viable options from the research:

**Option A: Auto-incrementing pool** (Hearthstone, Marvel Snap)
- Turn N = N resource, no resource cards in deck. Zero variance, zero "screw."
- *Pros:* friendliest possible onboarding; every turn always plays; eliminates a whole class of frustration.
- *Cons:* fixed pacing curve; deckbuilding choice of "ramp" disappears as a strategy.

**Option B: Inkable any-card** (Lorcana, FaB)
- Every card has dual use: pay it as a resource OR play it for its effect. Choosing what to pitch is a strategic decision.
- *Pros:* preserves the "deckbuilding shapes the curve" feel of MTG without the screw failure mode; rewards skilled play.
- *Cons:* slightly higher learning curve; the "should I pitch this?" decision can paralyze new players.

**Option C: No resource** (Yu-Gi-Oh)
- Cards have summon limits, once-per-turn restrictions, on-card dependencies.
- *Pros:* fast turn cadence; every card is "playable" if its conditions are met.
- *Cons:* complexity migrates to per-card text and rules-knowledge requirement; the genre's accessibility nightmare.

**Option D: Deck-as-engine** (Star Realms, deckbuilders)
- Cards have on-card resource printed. Hand IS the resource each turn.
- *Pros:* every turn plays everything; clean and snappy.
- *Cons:* doesn't really model "resource constraints" as a strategic axis at all.

**Option E: Themed resource ("Time")**
- A new variant. Each turn you have N "Time" tokens (auto-incrementing or a fixed budget). Spend them on actions: play a card, ready a card, look at the future.
- This would be Dad TCG's signature mechanic if we want one — fathers thinking about how they spend their finite time with their kids.

**Proposed starting point: Option B (inkable any-card), with Dad TCG voice.**
- *Resource called* "**Time**" or "**Hours**" or "**Sundays**" — the dad-life resource.
- Every card can be played face-down as a Time card (it ages quietly into resource), or played face-up for its effect.
- *Why:* Lorcana proves it works for warm-tone family play. The "what do I save vs. what do I spend" decision *is itself* a dad-life metaphor (sacrificing presence for work, spending time on what matters).
- *If you prefer auto-mana (A) for maximum accessibility:* perfectly defensible. Snap's success is the case in chief.

---

### Q2. What is the win condition?

**Option A: Reduce-to-zero** (life total → 0)
- Combative framing. "I beat you down."
- Genre-default; players know how to evaluate threats.

**Option B: Race-to-X** (lore points, quest progress, prizes collected)
- Affirmative framing. "I got there first."
- Lorcana, Pokemon, Snap (in flavor). Warmer tone.

**Option C: Zone control** (Snap's 2-of-3 locations)
- Strategic, multi-front. "I held the field."
- Gives spatial structure; the kid can win one location and feel like they played.

**Option D: Time/turn-out** (fixed turn count, highest score wins — Snap)
- Bounded match length is the headline feature.

**Option E: Multi-condition** (any of the above + alt-wins)
- Maximum design space, but harder to balance.

**Proposed starting point: B + D combined ("race for points across a fixed turn count").**
- The win condition is **"who has the most Memories at the end of Year 18"** (or some dad-life duration metaphor).
- "Years" are turns. After turn 18, score Memories.
- Memories are gained by completing **Moments** (cards or board states that resolve into a memory).
- *Why:* fixed turn count gives Snap-style 5-min match feel (short = warm). Race-style win is affirmative not violent. Bonus: maps to a real life-cycle metaphor that's deeply on-theme.
- *Alternative:* if you want longer strategic matches, drop the fixed turn count and race to N points.

---

### Q3. Match length / turn structure?

**Option A: Open-ended until win condition** (MTG, HS, Lorcana — typical TCG)
- 15-40 minute matches. Lots of strategic depth. Higher commitment.

**Option B: Fixed short match** (Snap-style, 6 turns)
- 3-5 minute matches. Bounded, snackable. Higher emotional volume per turn.

**Option C: Single long match per "session"** (Star Realms-style 15-min match)
- Middle ground. Each match is one act.

**Proposed starting point: Option B (fixed turn count), Snap-style, 18 turns.**
- Why 18, not 6? 18 maps to 18 years of childhood, giving a thematic arc to a single match. Each turn is a year. Players raise something (mechanically: develop their board state) over the arc.
- 18 turns at maybe 30 seconds each = ~9 minute match. Long enough for arc, short enough for "one more."
- *Alternative:* if 18 feels too long for repeat play, do 12 turns ("12 years until they leave for college"). Snap-style 6 if you want maximum brevity.

---

### Q4. Combat / interaction model?

**Option A: Direct card combat** (MTG-style: creatures attack creatures, blocking, removal)
- Familiar; most players grok it.
- Combative tone.

**Option B: Public-information score-based** (Snap)
- Both players play cards into shared zones; total power per zone wins it.
- Less combative; more cooperative-feeling-but-competitive.

**Option C: Indirect interaction only**
- Star Realms-style: you affect your own state, and combat-printed cards reduce opponent's score, but there's no creature-vs-creature combat per se.
- Warmest tone; games feel more like parallel solitaires that interact at the edges.

**Option D: Race only — no interaction**
- Lorcana-lite: you challenge ("attack") opposing characters but the bulk of play is questing.
- Closest to "running parallel races on the same track."

**Proposed starting point: Option B (public-information score-based), inspired by Snap but with Dad TCG zones.**
- Three zones — call them **"Home," "Work," and "Out & About"** — players play cards into zones across turns. Each zone scores Memories (the win condition from Q2) based on the cards played there.
- Zones can have themed effects ("Home" multiplies Memories from 'Listener' archetype cards; "Work" doubles from 'Provider'; "Out & About" rewards 'Adventurer').
- *Why:* this gives the family-table, multi-front, "we're all in it together" tone. No creature death, no "I killed your dad" feeling. Players still strategize hard.
- *Alternative:* if you want classic combat, Option A is well-tested. If you want maximum warmth, Option D (race only).

---

### Q5. Deck size?

**Option A: 12 cards (Snap)** — singleton, every game has high variance, deckbuilding is fast.
**Option B: 20-30 cards** — balanced; each card is impactful but you can run duplicates.
**Option C: 40-60 cards** — genre-default; deeper strategic toolkit; longer games.

**Proposed starting point: Option A or B (12-25 cards), singleton or 1-2 of each card max.**
- Smaller decks → games are unique each match, deckbuilding is approachable.
- *If* match length is fixed (Q3), deck size is roughly half of turn count + a buffer (so you can't always draw the same key card on the same turn).
- Singleton = each card unique. 1-2-of = some redundancy.

---

### Q6. Faction count and structure?

**Option A: 4-6 factions, mono-faction decks (faction-locked)**
- Star Realms, Snap-without-archetypes, classes-only.
- Easy to balance; clear identity per faction; less deckbuilding flexibility.

**Option B: 4-6 factions, color-pie style cross-faction allowed (with restrictions)**
- MTG-style. Decks pick 1-2 faction colors.
- More deckbuilding, harder to balance.

**Option C: Many archetypes, no formal faction structure**
- Yu-Gi-Oh!. Each card stands on its own; "factions" emerge from synergies.
- Maximum design space; nightmare to balance.

**Proposed starting point: Option A — 5 or 6 factions called "Virtues," mono-virtue decks.**
- Examples: **Presence** (cheap, persistent, defensive), **Mentorship** (buffs allies, slow value), **Repair** (recovery, undo), **Play** (random/fun, high-variance), **Steadiness** (control, smoothing), **Curiosity** (card draw, look-ahead).
- Each archetype card maps to one Virtue (cards have a single Virtue tag).
- Decks must be at least 70% one Virtue (or fully mono-Virtue for v1).
- *Why:* tonal — Virtues are exactly the resonance that makes the game about *people*, not abstractions. Mono-Virtue decks reduce balance complexity dramatically.

---

### Q7. Are matches asymmetric?

**Option A: Symmetric (mirror match possible)** — both players play by the same rules.
**Option B: Asymmetric (Netrunner-style)** — players play different roles entirely.

**Proposed starting point: Symmetric.** Asymmetric is brilliant but doubles development cost. Defer to v2 if a "different-styles-of-dad" asymmetric mode emerges.

---

### Q8. How do AI difficulty levels feel?

The architecture (A5) covers *how* to build difficulties. The question is *what should they feel like*?

- **Easy:** "your first kid's first deck" — the AI plays joyfully, sometimes oddly, no perfect plays.
- **Normal:** "the dad next door" — competent, makes the play you'd make 80% of the time.
- **Hard:** "your father-in-law who taught economics" — patient, 2-ply lookahead, near-optimal scoring.

This is voice/copy more than mechanics; same engine, different framings.

---

### Q9. Card text and keyword vocabulary?

The research is clear: 5-7 evergreen keywords, max 25 words per card on common rarity. Open question: which keywords?

**Proposed starter set (subject to playtest):**
- **Steady** — once per turn, you may keep this in play across turn end without paying upkeep
- **Bond X** — when you play another X-Virtue card here, this gains +Y power
- **Listen** — at end of turn, look at the top card of your deck
- **Show Up** — this card may be played from the top of your deck if revealed
- **Nudge** — soft variant of disruption: "opponent's next card costs 1 more Time"
- **Patience** — gains a counter each turn; pays off at threshold

Names are illustrative — playtest will refine. The point is the *count* (~6) and the *tone* (soft, virtue-flavored).

---

### Q10. Randomness / dice / coin flips on cards?

**Proposed starting point: shuffle-only.** No coin flips, no dice in card text. Deck shuffle is the only RNG. Lorcana, FaB, Snap mostly do this; Hearthstone is the outlier and pays for it.

If a card *does* need randomness ("look at the top 3 of your deck, choose 1"), prefer "look-and-choose" over "random-result" — preserves player agency.

---

## Part 3 — Proposed M1 Plan If This Synthesis Is Approved

Once you've weighed in on Q1–Q10, M1 looks like:

1. **Lock the rules v0.1** in `/docs/RULES.md`. Comprehensive, web-playable.
2. **Lock the effect DSL v0.1** in `/docs/EFFECTS.md`. List the ~15 ops, the trigger schema, the targeting language.
3. **Draft 15-20 archetypes** (see `archetypes-draft.md` for a starting set; revise against the action-coded virtue list).
4. **Implement the JS engine** in `/js/game/` with full unit tests. ~500 lines.
5. **Implement the JS AI** in `/js/ai.js`. ~300 lines.
6. **Implement the simulator** in `/js/sim.js` and run 10K AI-vs-AI matches. Build the matchup matrix HTML.
7. **Implement the web pass-and-play prototype** so two humans can play a real match end-to-end on one device.
8. **Run multiple web playtest sessions** with humans. Iterate.
9. **Iterate cards based on simulator results + web playtest feedback.**

(Original M1 / M2 split has been collapsed: M1 now delivers the playable web prototype directly, since paper playtesting is not part of this project's workflow.)

The web/iOS UIs come *after* M1 (in M2, M4). Per A7 and BOBA's lessons, the engine has to be solid before the UI gets built.

---

## Decisions waiting on you

The research has given us the architecture. The mechanics are yours to call. The most consequential decisions, in order:

1. **Q1: resource system** — auto-mana? inkable "Time"? something else?
2. **Q2: win condition** — race-for-Memories? life-to-zero? fixed-turn-score?
3. **Q3: match length** — short (6 turns), medium (12-18 turns), or open?
4. **Q4: combat model** — direct combat, zone-based scoring, or race-only?
5. **Q6: factions** — Virtues mono-faction (5-6)? other?

These five together define the *shape* of the game. Q5, Q7-Q10 are calibration. Once the shape is set, archetypes and rules cascade in days, not weeks.

Recommend a working session to walk Q1–Q4 + Q6 together — that's about 30-60 minutes of focused decision-making and unlocks all of M1.
