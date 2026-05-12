# Dad TCG — Architecture & Technology Decisions

Entries are ordered by date. This file is **append-only** — never edit or
remove past decisions. Platform noted where specific; unlabeled = both.

---

## Decision 001 — Vanilla HTML/CSS/JS for Web
*Date: 2026-05-08*

**Decision**: No framework, no build step, no dependencies for the web app.

**Rationale**: GitHub Pages serves static files directly. Framework
abstractions cost more than they save at this scale. Aligns with
clarity-over-cleverness.

**Alternatives considered**: React, Vue, Svelte — all require a build step.

**Trade-offs**: Manual DOM manipulation, no reactive state. Revisit if
component count exceeds ~20.

---

## Decision 002 — Xcode Project at Repository Root
*Date: 2026-05-08*

**Decision**: The `.xcodeproj` lives at the repository root, not in a
subdirectory. Project name has no spaces.

**Rationale**: Xcode Cloud requires `.xcodeproj` at the repository root.
Spaces in paths cause issues with shell scripts, CI/CD, and Xcode Cloud's
project discovery. Lesson learned from Bsky Dreams where
`BskyDreams-iOS/Bsky Dreams/Bsky Dreams.xcodeproj` (two levels deep, spaces)
caused persistent "Project does not exist at root" errors.

**Alternatives considered**: Subdirectory with Xcode Cloud custom workspace
path — fragile, undocumented, breaks on Xcode updates.

**Trade-offs**: Web and iOS files share the same root directory. Use
`.gitignore` to keep build artifacts out of the web deployment.

---

## Decision 003 — Shared Version Config (xcconfig)
*Date: 2026-05-08*

**Decision**: `AppVersion.xcconfig` at repo root defines
`MARKETING_VERSION` and `CURRENT_PROJECT_VERSION`. All targets reference it.

**Rationale**: Editing version numbers via Xcode's identity panel creates
per-target overrides in `project.pbxproj` that shadow the xcconfig, causing
targets to drift. A single xcconfig is the single source of truth.

**Trade-offs**: Must remember to edit the xcconfig, not the Xcode UI.

---

## Decision 004 — SwiftUI + @Observable + SwiftData (iOS)
*Date: 2026-05-08*

**Decision**: SwiftUI for all UI. `@Observable` (iOS 17 macro) for state
management. SwiftData for local persistence. UIKit only where SwiftUI lacks
a native equivalent.

**Rationale**: Modern Apple stack, minimal boilerplate, no third-party
dependencies.

**Trade-offs**: iOS 17+ minimum deployment target.

---

## Decision 005 — Dual-Platform Feature Parity Model
*Date: 2026-05-08*

**Decision**: Both platforms implement the same core feature set. Track
parity in SCRATCHPAD.md. Platform-specific implementation choices are
acceptable (e.g., Keychain vs localStorage for auth).

**Rationale**: Users expect the same capabilities regardless of platform.
Implementation details can differ to leverage each platform's strengths.

**Trade-offs**: Every feature is effectively built twice. Mitigated by
shared API contracts and design tokens.

---

## Decision 006 — Project Identity: Dad TCG
*Date: 2026-05-08*

**Decision**: This project is a Trading Card Game called **Dad TCG**. The
cards depict original "dad" archetypes (The Coach, The Tinkerer, The
Storyteller, etc.) — invented characters representing positive male role
models. Tone: "warm core, witty surface" — sincere about fatherhood with
humor and personality.

**Rationale**: The user wants a TCG that celebrates fatherhood without being
saccharine. Original archetypes (vs. real-person likenesses) avoid rights
issues and give the game a distinctive identity. The hybrid tone keeps the
game broadly accessible without making it feel like a children's-only game.

**Alternatives considered**:
- Real historical fathers (rights complications for living people; cultural
  pitfalls).
- User-uploaded "your own dad" cards (personal but expensive to build well;
  reconsider post-M3).
- Pure humor / dad-joke tone (entertaining but undercuts the sincere
  "celebrate fatherhood" thread).

**Trade-offs**: Original archetypes need to feel rich enough that players
identify with them. Underwritten archetypes feel like cardboard. Budget real
time for the archetype-design pass in M1.

---

## Decision 007 — Gameplay-First, Not Collection-First
*Date: 2026-05-08*

**Decision**: Dad TCG is a **gameplay-first** TCG. There is no booster pack
mechanic, no rarity-driven collection grind, no premium card economy in v1.
All cards are equally available; rarity exists only as a flat distribution
label for catalog organization (common / uncommon / rare / signature) — not
as a collection gate.

**Rationale**: The user explicitly stated this. The competitive landscape is
crowded with collection-driven TCGs (MTG, Pokémon, Lorcana, Hearthstone).
Dad TCG can differentiate by being a tight, well-designed game where
acquiring cards is not the loop.

**Alternatives considered**:
- Standard collection model (booster packs, rarity gating). Rejected: not the
  user's vision, and we're not equipped to balance economy mechanics.
- Hybrid (free starter + cosmetic store). Rejected for v1; revisit if the
  game finds an audience.

**Trade-offs**: Less "addictive" engagement loop. Mitigated by deeper
gameplay (better matches, better AI, more thoughtful archetypes).

---

## Decision 008 — Three Play Modes: Solo vs AI, Pass-and-Play, Game Center P2P
*Date: 2026-05-08*

**Decision**: Dad TCG ships three play modes:
1. **Solo vs AI** — single player vs a CPU opponent (web + iOS, M3 / M5)
2. **Local pass-and-play** — two humans on one device with a hand-off screen
   between turns (web + iOS, M2 / M4)
3. **Game Center peer-to-peer** — turn-based matches between two iOS devices
   via GameKit (iOS only, M6)

The web app does **not** support networked play in v1. (CLAUDE.md mandates
zero-cost static hosting; reliable web peer-to-peer would require a signaling
broker we don't want to budget for.)

**Rationale**: The three modes cover the meaningful play contexts: alone,
together-in-person, together-at-distance. Each leverages what the platform
does well (iOS gets Game Center; web gets a frictionless URL share).

**Alternatives considered**:
- Web peer-to-peer via WebRTC + free signaling broker (PeerJS). Adds a
  hosted dependency; saves only if user demand is clearly there.
- Async multiplayer with our own backend. Out of scope (zero-cost hosting).
- iOS-only product. Rejected — web reach matters for discovery.

**Trade-offs**: Game Center P2P is a substantial implementation effort and
gates some App Store discovery (Game Center has declined as an Apple
priority). M6 is intentionally last; if it slips, the product is still
viable on M5 alone.

---

## Decision 009 — Text-Only Card Visuals in v1
*Date: 2026-05-08*

**Decision**: For v1, cards are rendered with text and structural styling
only — no illustrated card art. The data model carries an `image` field
(nullable) so artwork can be added later without a schema change.

**Rationale**: Card art is expensive (time, money, or compute), and the
user's priority is gameplay, not visual production value. Mechanics-first
design lets us iterate on the game loop without art bottlenecks.
Procedural / generative visuals (CSS gradients + SF Symbols, distinctive
per-archetype colorways) are an option to make text-only cards still
visually distinctive — explored in M2 if desired.

**Alternatives considered**:
- AI-generated illustrations from day one (would require an external pipeline
  the user runs; not blocking us yet).
- Procedural-only visuals as the long-term direction (under-served the
  characters; archetypes deserve real art eventually).

**Trade-offs**: Less visual delight in early playtests. Mitigated by strong
typography, thoughtful card layouts, and warm copywriting.

---

## Decision 010 — Research Lives in /research/, Card Data in /data/
*Date: 2026-05-08*

**Decision**: Research artifacts (TCG analyses, Claude-skill surveys, BOBA
lessons, playtest logs) live in `/research/` at the repo root. Card and
archetype data live in `/data/`. Both directories are committed; the app
loads `/data/` at runtime but **does not** load `/research/`.

**Rationale**: Auditability. Future contributors (human or AI) need to be
able to reconstruct the *why* behind mechanical choices, not just the *what*.
A committed research notebook keeps that record without inflating the
runtime bundle.

**Alternatives considered**:
- All-in-`/docs/` (mixes reference material with player-facing rules
  documents).
- Off-repo notes (smaller bundle, but loses the audit trail and risks the
  research being lost when the user changes machines).

**Trade-offs**: Larger repo. Acceptable — Markdown is small.

---

## Decision 011 — Virtue Framework Inherited from Masculinity-Detox
*Date: 2026-05-08*

**Decision**: Dad TCG adopts the canonical 30-virtue taxonomy from the
user's prior repo at `/GitHub/Masculinity-Detox/` (the "Detoxing Man"
framework). Each virtue is a single adjective with a parenthetical
clarifier (e.g., "Patient (with time and attention)," "Unfinished (with
himself and with his relationships)"). All 30 virtues are valid card tags.
The framework's tagline — "No One Way To Be a Man" — and its
"In-Progress / Striving / Questing" framing inform the game's identity
and voice.

**Rationale**: The user has already done years of careful thinking about
positive masculinity. The framework is more nuanced than any 6-virtue list
we could invent. Inheriting it gives Dad TCG a distinctive tonal signature
and grounds the design in already-tested vocabulary.

**Alternatives considered**: invented virtue list (initially drafted as
Mentorship / Repair / Play / Steadiness / Curiosity — rejected as
generic).

**Trade-offs**: 30 tags is a lot to playtest. Mitigated by Decision 014
(grouping into 6 clusters); individual tag synergies are an emergent
balance question that the simulator will address.

---

## Decision 012 — Resource System: "Attention" (inkable any-card)
*Date: 2026-05-08*

**Decision**: The resource is called **Attention**. Every card has a play
cost (Attention spent to play it for its effect) AND an Attention value
(if pitched/inked instead, it adds that much Attention to your inkwell).
Pattern follows Lorcana's ink and Flesh and Blood's pitch.

**Rationale**: From the Patient virtue post: *"Patience is attention
management, not time management. You can't always control time, but you
can choose where your focus goes."* Attention is the resource that maps
the framework's lived practice into the game's strategic axis. Inkable
any-card eliminates resource-screw failure mode.

**Alternatives considered**: auto-incrementing Attention (Hearthstone-style),
fixed per-turn Attention budget (Netrunner-style), earned-Attention
(declared-intention-style). Inkable picked for thematic richness AND
proven indie-friendly balance.

**Trade-offs**: slightly higher onboarding cost (the "what should I pitch
vs play" decision is the central skill-curve item, like Lorcana). Worth
it.

---

## Decision 013 — Win Condition: Distinct Virtues Practiced
*Date: 2026-05-08*

**Decision**: Each turn, the active player declares an **Intention** (one
of the 30 Virtues). When that player plays a card whose tags include the
declared Intention, the Virtue is marked "Practiced" on their Legacy
sheet. After 18 turns (Decision 015), the player who has Practiced more
distinct Virtues wins. Ties broken by the rarer Virtues practiced (each
Virtue has a published global play-rate; rarer ones break ties first).

**Rationale**: The framework is "In-Progress / Striving" — winning
should be about *trying* and *living the virtues*, not killing the
opponent. This win condition maps directly to the Detoxing Man
philosophy.

**Alternatives considered**: race-for-Memories (rejected — looser map to
framework); reduce-to-zero (rejected — wrong tone); shared/threshold win
(rejected — user explicitly preferred singular winner).

**Trade-offs**: novel win condition with no genre precedent — needs
careful playtesting to ensure it produces real strategic depth and
doesn't degenerate to "play any 18 differently-tagged cards." Mitigated
by the Intention-declaration constraint.

---

## Decision 014 — Six Faction Clusters
*Date: 2026-05-08*

**Decision**: The 30 canonical virtues cluster into **six factions**, each
grouping 4-6 virtues:

| Faction | Virtues |
|---|---|
| **Presence** | Present, Sincere, Kind, Loving |
| **Connection** | Connected, Attuned, Empathetic, Open, Collaborative, Communicative |
| **Growth** | Unfinished, Willing, Engaged, Curious, Adaptable, Introspective |
| **Agency** | Active, Capable, Communicative*, Desirous, Purposeful |
| **Integrity** | Trusted, Responsible, Conscious, Respectful, Equitable |
| **Resilience** | Resilient, Patient, Caring, Supportive, Grateful |

(*Communicative cross-listed; final assignment in M1.)

Each card belongs to **one faction** and carries **1-2 virtue tags** from
that faction's set. Decks may run cards from any faction, but
faction-mono and 2-faction decks get small synergy bonuses.

**Rationale**: 30 virtues is too many to be visible factions. Six
clusters keeps faction identity learnable while preserving the 30 as
tags for finer-grained synergy. General-noun names (Presence,
Connection, etc.) read more cleanly than adjective-name factions.

**Alternatives considered**: five canonical-adjective factions (Present /
Connected / Unfinished / Patient / Trusted) — rejected for slightly
worse mechanical balance; all-30-as-tags-no-faction-structure (rejected —
hard to balance, no visible color pie); four "modes of dad-being"
(rejected — too abstract for new players).

**Trade-offs**: the cluster names are inventions, not direct framework
vocabulary. Mitigated by the per-card virtue tags using canonical
adjectives.

---

## Decision 015 — 18-Turn Match (Childhood-to-Adult Arc)
*Date: 2026-05-08*

**Decision**: Each match is **18 turns**. Each turn represents one Year
of fatherhood. Match expected length: 12-18 minutes once players know
the game.

**Rationale**: 18 years is the canonical "raising a child" arc — gives
the match a built-in narrative shape (early years, school years, teen
years, departure). Longer than Snap's 6-turn "snack" but shorter than
MTG's open-ended games. Sweet spot for legacy-building gameplay.

**Trade-offs**: 18 turns is on the longer side for casual play. If
playtest shows matches feel padded, consider trimming to 12 turns
("growing-up phase") or making 18 the "Standard" mode with a 12-turn
"Quick" mode.

---

## Decision 016 — Resonant Zones, No Card Destruction
*Date: 2026-05-08*

**Decision**: The play space is **three shared zones**. Both players play
cards into the same zones. Cards in opponent's zones do not attack or
destroy your cards. When your card and an opponent's card share a virtue
tag in the same zone, both players gain a small **Resonance** bonus
(typically: each player marks a bonus Virtue Practiced if their tag
matches).

Disruption mechanics exist only as **soft reroutes** — e.g., "opponent's
next card costs +1 Attention," "look at the top card of opponent's deck
and rearrange." No hard counterspells, no card destruction, no hand
disruption.

**Rationale**: From the Empathetic virtue: *"My circle of empathy is
big enough for the people I will fight with... when we are all in the
circle, there is no us and them."* Direct combat ("my dad killed your
dad") is wrong on theme. Resonant interaction creates a cooperative-
feeling competitive game where opponent's good plays can strengthen your
Legacy too.

**Alternatives considered**: direct combat (rejected — wrong tone);
Snap-style with destruction (rejected — softer than direct combat but
still violates "no us and them"); pure parallel race (rejected — too
non-interactive).

**Trade-offs**: less interactive than direct combat; balance work falls
on Resonance economy (if Resonance is too cheap, the game devolves into
"play matching tags"). Mitigated by Resonance giving bonuses to BOTH
players, so matching tags isn't pure win-trading.

The three zones (working names, refinable in M1): **Home**, **Work**,
**Out & About** — three contexts of dad-life where presence, virtue,
and relationships compound.

---

## Decision 017 — "Kin" Card Type (Next-Generation)
*Date: 2026-05-08*

**Decision**: A **Kin** card type exists alongside dad-cards. Kin cards
represent the people the dad is raising or mentoring (children,
proteges, mentees). They start with a low **Maturity** counter; each
turn one of your dad-cards activates near a Kin (in the same zone or
played adjacent), the Kin gains 1 Maturity counter. At end of match,
each Kin's Maturity counters convert into **bonus Virtues Practiced**
based on which virtues the dad-cards adjacent to them carried during
the match.

Kin cards do NOT score Legacy directly — they multiply the Virtues
your dad-cards already practiced. This keeps the Legacy math simple
(Decision 013) while embodying the "raising the next generation"
theme concretely.

**Rationale**: User explicitly asked for "next-generation" mechanics
within the legacy framing. Kin as a separate card type that grows
through play is the most concrete embodiment.

**Trade-offs**: more cards to design; more rules to learn; the Kin
mechanic adds complexity to a TCG that's otherwise quite tight. Worth
it for the thematic anchor — no other TCG does this, and "raising a
kid" is the central activity Dad TCG models.

---

## Decision 018 — End-of-Match Legacy Summary (Both Players)
*Date: 2026-05-08*

**Decision**: At the end of every match, both players see a side-by-side
**Legacy Summary** showing what each built: distinct Virtues practiced
(by name), Resonance bonds with opponent's plays, Kin matured. The
winner is declared, but the loser's Legacy is shown with equal visual
weight and an explicit "What you built lasts too" framing.

**Rationale**: User's own articulation: *"winning is not zero-sum, but
rather... about building a legacy, finding fulfillment, and building
strong relationships and the next generation."* The match ends, but the
*legacy* the loser built is real. The UX expresses this.

**Trade-offs**: more end-of-match copy to write; risk of feeling
saccharine if not handled with the lived dryness of the Rapid Reflection
voice. Mitigated by writing the loss-frame copy in M1 and pulling
specific verbs from the Masculinity-Detox source material.

---

## Decision 019 — Joy as a First-Class Track (Moments + Highlight Reel)
*Date: 2026-05-08*

**Decision**: Dad TCG runs **two parallel tracks** during every match:
**Legacy** (Virtues Practiced — determines the winner) and **the
Highlight Reel** (Moments captured by card triggers — does not determine
the winner, but determines the *feel* of the match).

Specific elements:

- **Moments** are events captured when specific card combinations or
  board-states fire. Each card may have a printed `Moment:` clause.
- A `Play` cross-cutting tag exists alongside virtue tags. Roughly 25-35%
  of cards carry it. Many Moment triggers reference Play-tagged cards.
- The end-of-match summary shows BOTH tracks side by side: Legacy
  (virtues + scoring) and the Highlight Reel (Moments by Year).
- Tiebreaker for Legacy ties: Moments collected (the dad who brought
  more joy breaks the tie).
- Loss-frame copy is **warm + dry-funny**, in the voice of the Rapid
  Reflection essays. Templates vary by what happened in the match (best
  Moment, close score, raised Kin, etc.). NEVER "You Lost."
- *[INFERRED — CONFIRM]*: 5+ Moments in a match unlocks "Good Year"
  recognition (purely cosmetic celebration of the joy you brought).

**Rationale**: User correction during M0: *"I'd like to make sure we
are emphasizing the 'fun' part of fatherhood as well... it should feel
incredible to 'be a dad' in the game."* Without this elevation, the
virtue-and-legacy framework reads as a sincere accounting system.
With Moments, the framework's depth is preserved AND the surface is
joyful — the "warm core, witty surface" identity is restored.

**Alternatives considered**:
- Joy as a 7th faction (rejected — would ghettoize fun into one corner
  of the deck rather than letting joy live everywhere).
- Joy woven into existing factions' mechanical signatures only
  (rejected — too distributed; players wouldn't *feel* joy as a thing).
- Joy as voice/flavor only, no mechanic (rejected — undersells the
  user's directive that being-a-dad should feel *incredible* in the
  game).
- Moments folded into Legacy as bonus virtues (rejected — collapses joy
  back into virtue accounting; user explicitly picked the parallel-track
  option).

**Trade-offs**: more cards to design (each card needs to consider
whether it carries `Play`, and ~20 cards across the pool need explicit
`Moment:` triggers). More end-of-match UI to build (the Highlight Reel
needs a sharable layout). More copy to write (one short flavor sentence
per Moment trigger; loss-frame variants). All worth it — Moments are
likely the single most distinctive feature of the game and the part
players will share most.

---

## Decision 020 — Anthological Year Deck (the player's deck represents many ways of being a dad)
*Date: 2026-05-08*

**Decision**: A shared **Year deck** of ~40-50 dad-life Year cards sits
between the two players. Each turn, one Year card is revealed, providing
a flavor name (e.g., "The Saturday Pancake," "The Severe Tire Damage
Year"), a one-sentence flavor line, and a small mechanical modifier
that affects both players for that turn. Each match draws 18 Years from
this larger deck, so no two matches navigate the same generation in
the same order.

**Critically**, this changes the deck's narrative frame:
- Each player's deck is NOT "this specific dad's life with this
  specific kid." It is **"all the ways YOU show up as a dad, across a
  generation."**
- The Dad cards in your deck are facets of the same player — Coach,
  Tinkerer, Listener, Provider, Player — drawn upon in different Years
  for different people.
- The Kin cards are the people you raise across that generation —
  your kids, your kids' friends you mentored, your niece, your work
  protege.
- The Year cards are the *moments in dad-life* — they may be a child's
  age, but they may also be the year of the parent's own father's
  illness, the year of the long-distance work assignment, the year of
  the road trip.

**Rationale**: User explicitly clarified — *"Being a dad should not be
entirely about having children. The idea is not that it is merely
birth to adulthood for the kid(s), but rather that it is a generation
of life being lived as a good father."* And: *"I want the game to be
infinitely playable. I don't want it to feel as though every middle
school year is somehow the same."*

The original framing (each Year = one chronological year of a kid's
life) was wrong on both counts: too narrow about fatherhood, too
deterministic for replayability. The anthological Year deck fixes both.

**Alternatives considered**:
- Fixed 18-Year deck (rejected — doesn't replay; locks in a single
  childhood arc).
- Milestone-only Year cards (5-8) with blank in-between Years
  (rejected — uneven texture; "filler" Years feel cheap).
- Flavor-only Year cards with no mechanical modifier (rejected —
  underdelivers; modifier is what makes the variety strategic).
- No Year cards (rejected — leaves the 18-turn structure narratively
  blank).

**Trade-offs**: large authoring lift in M1 (40-50 Year cards plus
flavor plus modifier per card). Mitigated by drawing heavily from the
Rapid Reflection essays in `/research/masculinity-detox-extraction.md`
which already supply tone, names, and lived specifics. The
authoring is also one of the most fun parts of the project — Year cards
ARE the storytelling layer.

---

## Decision 027 — Resonance Fires Per Shared Tag, Each Turn
*Date: 2026-05-08*

**Decision**: At end of each turn, for every pair of (your card,
opponent's card) sharing a zone, **every shared Virtue tag fires a
Resonance event**. Each event marks that Virtue Practiced for both
players (no double-counting if already practiced). Resonance count
also tracked separately for tiebreaker and joy-tracking.

Concretely: if your Coach (tags: Showing-Up, Teaching) and opponent's
Coach (Showing-Up, Teaching) share a zone, both Showing-Up AND
Teaching resonate in the End phase. Both players mark each as
Practiced. Resonance event count for the turn: +2 each.

**Trade-offs**: same pair sitting together turn after turn doesn't
keep adding Practiced virtues (those virtues are already marked), but
it does keep adding Resonance event count (joy track). This is by
design: stable resonant zones = sustained relationships.

---

## Decision 028 — Tools Attach Permanently to a Dad Card
*Date: 2026-05-08*

**Decision**: A Tool card, when played, attaches to a single Dad card
in play. The Tool stays attached for the rest of the match; if the
Dad somehow leaves play (via a Recovery / Persisting effect, etc.),
the Tool goes with it.

The Tool grants a modifier to the attached Dad: an extra Virtue tag,
a stat bump, an Activated ability, or a passive effect.

**Rationale**: genre-standard pattern (MTG, Lorcana, Hearthstone all
do this). Cleaner mental model than detachable Tools. Strategy lives
in *what to attach to which Dad*, not in re-attachment optimization.

**Trade-offs**: less mid-match flexibility; if the attached Dad's
zone is "wrong" later, the Tool is stuck.

---

## Decision 031 — v0.2 Design Pivot: Tactical-and-Story, Year-Driven, Snap-Paced
*Date: 2026-05-09. Supersedes D013, D015, D027 (and parts of others).*

**Decision**: After the v0.1 build was tested, the user found it lacked
legibility — mechanics worked but the *game* wasn't visible to the
player, and the declared-Intention mechanic was structurally
"virtue-signaling" (you announced your virtue before doing anything).
The v0.2 design pivots to the framework documented in
`/docs/PLAYER-EXPERIENCE.md` — a balance of tactical card play and
story payoff, organized around Year cards as the engine.

**Core changes from v0.1:**

- **8 Years, not 18.** Tighter, Snap-paced match (~8-12 minute play).
  Supersedes D015.
- **Win condition: Moments captured, not Virtues Practiced.** Each Year
  card has explicit capture criteria; the player who captures more
  Moments wins. Supersedes D013.
- **No declared-Intention phase.** Virtues are practiced through the
  cards a player actually plays — no separate signaling layer.
- **Year cards drive the match.** They present a "moment to meet" with
  capture criteria in plain language. Cards (Dad/Kin/Action/Tool) are
  the *roles and tools* used to meet moments.
- **The Highlight Reel is the artifact.** End-of-match shows both
  players' captured Moments side by side as a chronological narrative,
  exportable as an image.
- **Card text rewritten in player-goal language.** Every card describes
  its effect in terms of "what does this help me capture?" — not
  abstract op vocabulary.
- **First match is a guided tutorial.** Heavy onboarding for the first
  3 Years, fading to hover-tooltips after.

**Why:** the user's diagnosis: "*you are just choosing things without
knowing why or what impact it will have.*" The v0.1 mechanism worked
but didn't communicate stakes, story, or cause-effect. The v0.2 design
reframes mechanics around "every Year is a story-beat tactical puzzle"
and makes the artifact (the Highlight Reel) the visible payoff alongside
the win.

**Trade-offs:** significant rewrite of engine, UI, card text, and
RULES.md. Acceptable — v0.1 was scaffolding; the player-experience design
is the foundation v1.0 will be built on.

---

## Decision 032 — Match Length: 8 Years (replaces 18-turn)
*Date: 2026-05-09. Supersedes D015.*

**Decision**: A match is **8 Years**. Each Year is a single round of
play (Year card reveal → both players alternate plays → Year resolution
with capture check). Match length: 8-12 minutes.

**Rationale**: 18 dragged. 6 (Snap-length) felt too compressed for the
dad-life arc. 8 hits a sweet spot: long enough that early plays
compound, short enough to stay punchy. User confirmed.

---

## Decision 033 — Decks: 15-card singleton (Snap-style)
*Date: 2026-05-09.*

**Decision**: Each player's deck is **exactly 15 cards** with **no
duplicates** (singleton). Deckbuilding is "which 15 of the ~70-card
pool best fits the kind of dad I want to be."

**Rationale**: Highest match-to-match variance. Lowest balance
complexity (no multi-copy synergies). Forces deck-construction to be
about *selection*, not *redundancy*. Tight, replayable, easy to teach.

**Trade-offs**: less reliability (you can't tutor for "the key card";
you have to draw it). Mitigated by 8 Years × ~2 cards drawn per Year ≈
seeing most of your deck.

---

## Decision 034 — Per-Year Attention Reset (sharpens D023)
*Date: 2026-05-09.*

**Decision**: Each Year, the player's inkwell **resets to 0**. Pitched
cards generate Attention for THAT Year only; unspent Attention does
not carry over.

(This sharpens D023's per-turn rule: in the new structure where each
Year is one round, "per-turn" and "per-Year" mean the same thing.)

**Rationale**: keeps tactical pressure per Year clean. Players make a
fresh "what to pitch / what to play" decision each Year. Mirrors the
lived practice — *this Year's attention is what you have*.

---

## Decision 035 — Every Year Has a Capturable Moment
*Date: 2026-05-09.*

**Decision**: Every one of the 50 Year cards has **explicit capture
criteria** in plain language. There are no "decorative" Year cards
without mechanical hooks.

A Year either gets captured (by one or both players, depending on the
card) or "passes quietly" — and the quiet-pass is itself recorded on
the Highlight Reel as part of the story ("Year 4: a quiet Year. No
moment captured.").

**Rationale**: cleaner gameplay; simpler tutorial; consistent player
expectations every Year. Quiet-Year narrative beats are emergent (when
neither player captures), not pre-designed dead Years.

---

## Decision 036 — Snap-Style Board Persistence (No Slot Cap)
*Date: 2026-05-09. Supersedes D016 zone slot cap from bundle.*

**Decision**: Cards played to zones (Dads, Kin, Tools) **stay on the
board for the rest of the match**. There is no zone slot cap. Action
cards still resolve and go to discard.

**Rationale**: the board accumulates as a visible "multifaceted dad" —
by Year 8 the player can see the many faces of themselves they've
shown up as. Strong narrative payoff. Year cards can reward "any [tag]
card on the board" rather than "a card played THIS Year," opening
combo synergies across the match.

**Trade-offs**: no per-zone cap means decks could in principle stack
many cards in one zone. With 15-card singleton, the practical cap is
~5 per zone (you have 15 total cards). Self-limiting.

Replaces the bundle's earlier "4 cards per player per zone" cap.

---

## Decision 037 — Resonance Becomes Year-Card-Specific (supersedes D027)
*Date: 2026-05-09. Supersedes D027.*

**Decision**: The v0.1 generic Resonance mechanic (end-of-turn
checking shared tags between players' cards in the same zone) is
**removed** as a global engine mechanic. The "no us and them"
spirit is preserved by **specific Year cards** that explicitly allow
both players to capture if both meet the criteria, OR by Year cards
where shared-tag plays produce a special capture.

**Rationale**: Resonance in v0.1 was opaque to the player ("why am I
suddenly Practicing this virtue?"). Pushing the shared-experience
beats into Year-card-specific rules makes them visible and
intentional. The framework's "circle is big enough" survives in
specific Years; it doesn't need a global mechanic.

---

## Decision 038 — Action Speaks (No Declared Intention)
*Date: 2026-05-09. Supersedes the implicit Intention layer of D013.*

**Decision**: There is **no declared-Intention phase**. The set of
"virtues a player has practiced this match" is the union of virtue
tags on cards they have actually played.

This set is still tracked and still appears on the end-of-match
Legacy Summary as a story element ("you played 9 cards across 5
distinct virtues"), but it is **not** a win condition. Capturing
Moments is.

**Rationale**: per the user's correction: *"The cards dictate your
intentions and the virtues you are utilizing... your virtues show
through your actions and not just because you have signaled that they
are your intentions."* The declared-Intention mechanic was structural
virtue-signaling. Removed.

(This decision is also captured as a feedback memory for future
sessions: `/Users/user/.claude/projects/-Users-user-Documents-GitHub-FreeTCG/memory/feedback_actions_speak_no_virtue_signaling.md`.)

---

## Decision 030 — Three Zones: Your Family, Your Craft, Your Community
*Date: 2026-05-08*

**Decision**: The three shared zones are named **Your Family**, **Your
Craft**, and **Your Community**. Both players play cards into these
same three zones (Resonance fires across the boundary).

- **Your Family** — what's happening within the family/interpersonally.
  The household, the partner, the kids, the parents-still-with-us, the
  closest chosen people. Inclusive of any household structure (single
  parent, blended, chosen-family, intergenerational).
- **Your Craft** — vocation, passion, working life. The job, the
  practice, the calling. Inclusive of paid work, unpaid creative work,
  caregiving, study.
- **Your Community** — engaging with hobbies, pastimes, teams,
  neighborhoods, faith, mutual-aid, friendships beyond the inner
  circle. Where you show up among others who aren't your household.

**Rationale**: User direction — "make it personal." The "Your"
prefix anchors each zone in the player's lived domain rather than an
abstract context. Avoids the original "Home/Work/Out & About" problems:
no false split between home and work, no exclusion of stay-at-home or
work-from-home dads, no vague "Out & About."

**Trade-offs**: slightly more verbose than single-word zone names.
Worth it — the personal pronoun matters.

**Naming convention reminder for future copy:** the player's deck
represents *all the ways YOU show up as a dad*. The zones are *your*
family, *your* craft, *your* community. Card text should respect this
voice — second-person, lived, specific.

---

## Decision 029 — Card Text Length: 25 / 40 / 60 Word Guideline
*Date: 2026-05-08*

**Decision**: Designers target the following soft caps:
- Common-rarity cards: ≤25 words of rules text
- Uncommon-rarity: ≤30 words
- Rare-rarity: ≤40 words
- Signature (one-of-each-archetype showcase): ≤60 words

Soft caps. The simulator surfaces wordy cards; designer review at each
balance pass. Mirrors MTG's "New World Order" approach.

**Rationale**: research recommendation
(`/research/tcg-analysis/accessibility-and-tone.md`). Card games
played in seconds need card text parseable in seconds. Yu-Gi-Oh-style
walls of text exclude casual players.

**Trade-offs**: limits how complex any individual card can be.
Mitigated by Activated abilities (which carry their own cost text but
keep the headline effect short).

---

## Decision 023 — Per-Turn Attention (no carryover)
*Date: 2026-05-08*

**Decision**: Attention generated each turn (by pitching cards into the
inkwell) is **spent-or-lost that turn**. Unused Attention does not carry
over to future Years. Each Year refreshes the inkwell to 0; the
player decides anew what to pitch and what to play.

**Rationale**: Maps the lived practice — *"this Year's attention is
finite; what you didn't give to today doesn't bank for tomorrow."*
Tighter pacing; stronger theme alignment with the Patient virtue's
"choose where your focus goes." Lorcana and FaB both reset their
respective resources each turn; the pattern is genre-validated.

**Trade-offs**: less long-game strategic banking. Simulator should
verify that 18-turn matches don't feel "samey" turn to turn; if they
do, revisit with a small saved-Attention bank as fallback.

---

## Decision 024 — Mixed Activated/Passive/One-Shot Effects on Dad Cards
*Date: 2026-05-08*

**Decision**: Dad cards can have any combination of three effect types,
designer's choice per card:
- **Enter** (one-shot): fires when the card is played into a zone.
- **Passive ongoing**: continuous effect while in play (e.g., "while in
  play, friendly Holding-tagged cards cost -1 Attention").
- **Activated**: pay an Attention cost to trigger again on subsequent
  turns ("tap, pay 1 Attention: target Kin gains +1 Maturity").

A card may have any subset of the three (e.g., an Enter effect AND an
Activated ability).

**Rationale**: Industry-standard pattern (MTG, Hearthstone, Lorcana
all do this). Maximum design space. Lets the card pool include both
splashy one-shot plays and slow-burn engine cards.

**Trade-offs**: more rules text per card; harder onboarding. Mitigated
by capping common-rarity cards at simpler shapes (only Enter or only
Passive); reserving Activated abilities for higher rarities.

---

## Decision 025 — Initiative Compensation: +1 Starting Attention for Player 2
*Date: 2026-05-08*

**Decision**: Player 2 begins their first turn with **+1 Attention
already in their inkwell** (a "free" Attention point for that turn
only). No extra cards, no other compensation.

**Rationale**: Going second in a TCG with shared zones tends to be
slightly disadvantaged (Player 1 establishes Resonance first, claims
zone slots first). +1 Attention is the smallest meaningful
compensation. Hearthstone's "The Coin" is the genre touchstone.

**Trade-offs**: simulator must verify P1/P2 win rates equilibrate near
50%. If P2 advantage emerges, we drop to "+0" or +0.5 (half a turn of
Attention).

---

## Decision 026 — Card Draw: 1 Per Turn (Genre Standard)
*Date: 2026-05-08*

**Decision**: Each player draws **1 card** at the start of their turn
(after Refresh, before Intention). Opening hand is 5 cards; 18 turns
× 1 draw = 23 cards seen during the match (plus opening), comfortably
within a 40-card deck.

**Rationale**: Genre standard (MTG, Hearthstone, Lorcana, FaB). Players
already know the pacing. The deeper innovation in Dad TCG lives in
Attention, Virtues, and Year cards — drawing rate doesn't need to
innovate.

**Trade-offs**: variable-draw mechanics (catch-up, Year-card-driven
draws) are deferred. They can show up as effects on individual cards
without changing the base rate.

---

## Decision 022 — Action-Coded Virtue Vocabulary v2 (locks D011 details)
*Date: 2026-05-08*

**Decision**: The Masculinity-Detox 30-virtue list is reference material,
not the in-game vocabulary. Dad TCG ships **18 action-coded virtue
words** organized into 6 factions (faction concept names from
Decision 014 retained: Presence / Connection / Growth / Agency /
Integrity / Resilience). The locked list:

| Faction | Virtues |
|---|---|
| **Presence** | Showing-Up · Listening · Holding |
| **Connection** | Welcoming · Asking · Thanking |
| **Growth** | Wondering · Trying · Teaching |
| **Agency** | Choosing · Advocating · Naming |
| **Integrity** | Owning · Mending · Forgiving |
| **Resilience** | Adapting · Tending · Persisting |

Each card carries one faction (umbrella) and 1-2 virtue tags. Tags drive
synergy and resonance; faction drives high-level identity and deck
construction.

**Constraints accompanying the lock:**
- **Joy is NOT a virtue.** Joy lives in the Moments / Highlight Reel /
  `Play` cross-tag layer (Decision 019). The virtue list is about *what
  kind of dad you're being*; Moments are about *what's about to happen
  that you'll remember*.
- **Teaching must be bidirectional.** The card pool must include cards
  that model the dad LEARNING from the Kin (per the Detoxing Man
  "Equitable" post: "learning Pokémon from the youngest"), not just
  teaching them.
- **"Persisting"**, not "Returning" — avoids mechanical-confusion with
  returning a card from discard to hand.
- **"Advocating"**, not "Defending" — per user direction: "the idea is
  advocating. It is about justice and care more than defending just
  because."

**Rationale**: User correction on the v1 agent proposal: "These changes
read more like traditional masculinity/fatherhood and not a positive
and growth-oriented version of adult manhood." v1's Goofing /
Steadfastness / Building landed as traditional dad tropes. v2 corrects
toward progressive growth-oriented action language while preserving
the framework concepts of Growth, Integrity, and Agency as faction
names.

**Alternatives considered** (rejected after audit):
- All 30 Masculinity-Detox virtues (rejected — too many TCG tags;
  several too introspective: Conscious, Introspective, Unfinished as
  a tag).
- Agent v1 list with Goofing, Cheering, Steadfastness, Defending
  (rejected — drift toward traditional masculinity).
- Joy as virtues (rejected — structural error; joy lives in Moments
  layer).

**Trade-offs**: significant relabeling work across SYNTHESIS.md,
RULES.md examples, and archetypes-draft.md. All addressable in the
next session pass before M1 build. Worth it — this is the vocabulary
the entire game speaks for years to come.

---

## Decision 021 — Missed Years Break Ties (Soft Mechanical Cost)
*Date: 2026-05-08*

**Decision**: A Year in which the active player does not play any Dad
card *and* does not activate any Dad ability is recorded as a **Missed
Year**. Missed Years appear on the end-of-match Highlight Reel labeled
"You weren't there" (without moralizing copy). They impose **no
in-match mechanical penalty** on Virtues already practiced. At end of
match, Missed Years act as a tiebreaker: in tied Legacy matches, the
player with fewer Missed Years wins.

**Rationale**: The Present virtue (*"in both actions and feelings"*)
needs a mechanical pull toward showing up year after year, but a hard
penalty would be moralizing — the user has explicitly said the game
should not feel heavy. Soft tiebreaker is the right calibration: real
enough to reward consistent presence, gentle enough to honor that hard
years happen.

**Trade-offs**: tiebreaker complexity grows. Mitigated by the
tiebreaker being deterministic and visible.
