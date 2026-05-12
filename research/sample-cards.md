# Dad TCG — Sample Card Pool (Companion to /data/cards.json)

*Date: 2026-05-08. Status: 12-card sample slice for engine integration testing and design review. The full M1 card pool will be 60-80 cards.*

This document is the human-readable companion to `/data/cards.json`. It explains the design intent of each card, traces the design back to research artifacts, and surfaces the variety the schema needs to handle.

---

## What's in the slice

| Card | Type | Faction | Tags | Play tag | Source archetype |
|---|---|---|---|---|---|
| The Listener | dad | Presence | Listening, Asking | — | The Listener |
| The Storyteller | dad | Connection | Welcoming, Thanking | — | The Storyteller |
| The In-Progress Dad | dad | Growth | Trying, Wondering | — | The In-Progress Dad |
| The Coach | dad | Agency | Advocating, Trying | — | The Coach |
| The Stepdad | dad | Integrity | Choosing, Persisting | — | The Stepdad |
| The Tinkerer | dad | Resilience | Mending, Adapting | ✓ | The Tinkerer |
| What Do You Think? | action | Connection | Asking, Wondering | — | (generic; bidirectional teaching) |
| Burned the First One | action | Resilience | Trying, Tending | ✓ | (generic; bumbler voice) |
| Pep Talk | action | Agency | Advocating, Trying | — | The Coach (paired) |
| Take the Long Way Home | action | Presence | Holding, Showing-Up | — | The Steady Hand (paired) |
| The Toolbelt | tool | Resilience | Mending | — | (generic; pairs with Tinkerer) |
| The Eldest | kin | — | (none — Kin take from raising Dads) | — | (generic Kin) |

This covers all four card types, all six factions, both tag-rich and minimal cards, and demonstrates Tool attachment, Kin Maturity, Moment hooks, Activated abilities, Passive effects, and onEnter effects.

---

## Walkthrough

### The Listener (dad)

A 2-cost Presence Dad with an Activated ability. Tap, pay 1 Attention, peek at the opponent's deck. Models *information without disturbance* — you weren't trying to peek; you were trying to understand.

The "reveal but replace" pattern is uniquely Dad-TCG-shaped. Most TCGs let you peek and *reorder*. The Listener peeks and *puts back exactly as found*. The mechanic embodies the virtue: you listened; you didn't take action with what you heard.

Effect uses `op: reveal` from the EFFECTS.md vocabulary.

### The Storyteller (dad)

A 3-cost Connection uncommon. Activated ability: name a virtue you've Practiced; capture a Moment named after it. Models *narrative as practice*. Each match, the Storyteller turns three or four virtues into shareable Moments.

Schema-stress: the `choose` op has `options: "self.practiced_virtues"` — a dynamic option set the engine populates at run time. The Storyteller's Activated ability gracefully handles "what if I haven't Practiced any virtues yet?" by simply having no legal options and not firing.

### The In-Progress Dad (dad)

A 2-cost Growth common. Two-step Passive: gain a Growth counter each turn you Practice a new virtue, then conditionally reduce the cost of all your Trying-tagged cards. The card carries the Detoxing-Man manifesto directly: *"I cannot change the past. I can only course correct."*

Schema-stress: Passive ops include conditional logic via `if` op. The engine recomputes passives whenever the board changes (per EFFECTS.md §9), so the cost reduction kicks in mid-match the moment Growth counters cross 3.

### The Coach (dad)

A 3-cost Agency common with a Passive effect (in-zone allies' onEnter +1) AND a Moment hook (PEP TALK fires when a Kin is in his zone). Two-layer card: passive economy buff plus narrative moment.

The Moment hook uses the `kin_in_same_zone_as: this` filter. The flavor line on the Moment is the Coach's headline quote, doubling its emotional weight.

### The Stepdad (dad)

A 2-cost Integrity uncommon with a single Passive: he counts as carrying any virtue tag held by friendly Kin in his zone, *for Resonance purposes only*. He shows up as whatever the family needs, mechanically and thematically. The "for Resonance only" caveat is critical: he doesn't actually have Choosing+Persisting+(everything Kin has) for synergy purposes; he just resonates more.

Schema-stress: introduces a custom op `borrow_kin_tags_for_resonance` that's slightly outside the EFFECTS.md vocabulary listed in §4. M1 sim build will decide whether this becomes a first-class op or compiles down to existing ops via `borrow_tag` with a Kin filter.

### The Tinkerer (dad)

A 2-cost Resilience common with the `Play` cross-tag. Activated: pay 1 Attention, recall a card from discard. The "Jury-Rig" mechanic — reusing what's already happened, sometimes in a different context.

Bumbler-with-accountability voice: *"Replaces the wrong washer. Floods the basement. Laughs first. Then fixes it."*

### What Do You Think? (action)

A 1-cost Connection action with the bidirectional-teaching constraint baked in: BOTH players draw a card after opponent's hand is revealed. Models the move where the dad's best response to the kid's question is "I don't know. What do you think?"

Per Decision 022, the card pool MUST include cards modeling the dad learning from the Kin. This is the cleanest example.

### Burned the First One (action)

A 1-cost Resilience action with `Play` tag. Discard 1, draw 2 — net +1 hand size, with player choice over what gets pitched. Sunday-comics three-beat: *"Burnt the first one. Got the second one right. The kid ate three."* Net resource gain through accepted failure.

### Pep Talk (action)

A 2-cost Agency action paired with The Coach. Matures a Kin by 2; captures PEP TALK Moment if any Advocating-tagged card is in play.

The Moment trigger here mirrors The Coach's portrait card's Moment hook — designers can put a Moment hook on multiple cards that converge on the same named Moment. The Highlight Reel deduplicates by Year (one PEP TALK per Year max).

### Take the Long Way Home (action)

A 1-cost Presence action paired with The Steady Hand. Until end of turn, your cards in Your Family are protected from disruption ops.

The flavor line — *"Drove the long way. Didn't say why. The kid figured it out."* — pulls the Sunday-comics rule (the punch is a feeling, not a joke).

### The Toolbelt (tool)

A 1-cost Resilience Tool. Attaches to a Dad. Adds the Mending tag to that Dad (if not already) and +1 to that Dad's Pitch value. Makes the attached Dad a better resource generator AND stretches their virtue range for Resonance purposes.

The `attachTo: "dad"` field activates the Tool-card flow. The `tags: ["Mending"]` on the Tool itself isn't normally relevant (Tools don't trigger Resonance directly), but the `add_tag` op on the attached Dad does propagate Resonance.

### The Eldest (kin)

A 2-cost Kin with `pitchValue: 0` (Kin can't be pitched per D017) and `maxMaturity: 18`. The card has no Activated/Passive/onEnter effects in JSON because the Kin scoring logic is engine-handled (per RULES.md §11) — the card just declares its presence and the engine ticks Maturity each turn.

The flavor line — *"They're watching you. They've been watching for a while."* — captures the Kin's role in the game's emotional arc: the dad's actions are seen and recorded, and at end of match they pay off as Legacy.

---

## What this slice exercises in the engine

When the M1 engine reads `/data/cards.json`, this 12-card slice tests:

1. **All four card types** parse correctly (dad, action, tool, kin).
2. **All six factions** appear and Resonance fires across factional lines.
3. **All three effect kinds** load (onEnter, passive, activated).
4. **`Play` cross-tag** triggers (Tinkerer, Burned the First One).
5. **Moment hooks** fire (Coach, Pep Talk).
6. **Kin Maturity** ticks (Eldest + Pep Talk activation).
7. **Tool attachment** with permanent tag-add (Toolbelt + any Dad).
8. **Conditional logic** in passives (In-Progress Dad's Growth counter).
9. **Bidirectional teaching** card present (What Do You Think?).
10. **Bumbler voice** present (Burned the First One, Tinkerer).
11. **Schema validation** — every required field populated; only Kin has null faction; rules text within length cap.
12. **Cross-archetype paired Action cards** (Pep Talk pairs Coach; Take the Long Way Home pairs Steady Hand).

---

## What's NOT in this slice (deferred to full M1 pool)

- 12 of 18 archetypes still need portraits.
- Most Action cards (only 4 here; expect 18-25 in M1).
- Most Tools (only 1 here; expect 8-12).
- Most Kin (only 1 here; expect 8-12, named "The Eldest," "The Niece on the Phone," "The Carpool Kid," "The Mentee at Work," "The Nephew Who Visits," etc.).
- All 50 Year cards (sample 28 are in `/research/year-cards-draft.md`; full deck in /data/year-cards.json comes in M1).
- The full Moment trigger vocabulary (this slice only shows 2 named Moments).

The 12 here are enough to **boot the engine** and run a primitive simulator. The simulator's first job: load these 12, build two illegal-but-plausible decks (each player gets the same 12 cards repeated), play 100 AI-vs-AI matches, validate that Resonance fires correctly, Kin matures, Moments capture, and end-of-match Legacy summary renders.

---

## Voice consistency check

Each card's flavor line was checked against:

- **Rogers test** (could this be said to a child?): all 12 pass.
- **Rapid Reflection test** (lived specificity, not abstract virtue): all 12 ground in concrete actions or named objects (the Listener's "tell me again," the Coach's "I've got the rebound," the Tinkerer's flooded basement, the Burned the First One bagel-burning, the Toolbelt's lost screwdriver).
- **Joy distribution**: 3 of 12 carry Play tag (25%), within the target band.

## Notes for /data/year-cards.json (M1 task)

The Year deck schema will mirror the cards.json shape but with simpler fields:

```json
{
  "id": "the-saturday-pancake",
  "name": "The Saturday Pancake",
  "flavor": "Burned the first one. Got the second one right. The kid ate three.",
  "modifier": { "op": "...", ... },
  "moment": { "name": "...", "trigger": "..." }
}
```

The 28 Year cards in `/research/year-cards-draft.md` are ready to translate into JSON when the schema is finalized in M1.
