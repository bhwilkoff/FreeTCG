# Dad TCG — Card Effect DSL Specification (v0.1)

*Date: 2026-05-08. Status: first draft. This document is the canonical specification for the JSON shape that encodes every card's mechanical behavior. Both the JS and Swift engines parse this same JSON and must produce identical results given the same input and RNG seed.*

---

## 1. Why a JSON DSL

Per Decisions D012 (inkable Attention), D017 (Kin), D019 (Moments), D020 (Year deck), and the BOBA-Playbook lessons in `/research/boba-lessons.md`, Dad TCG card effects are **declarative JSON** parsed by a single interpreter, not per-card scripts.

Reasoning:
- Cards are pure data, shareable verbatim across web and iOS.
- Balance changes are JSON edits, not code edits.
- The AI reads the structured JSON to score plays — no special per-card AI logic.
- The simulator runs the same interpreter at speed.
- Adding a new mechanic = adding an op to the interpreter (rare event), not a parser change.

This document specifies:
1. The card-level schema (every card field).
2. The effect schema (`onEnter`, `passive`, `activated`).
3. The op vocabulary (~20 ops, all tightly scoped).
4. The targeting language (filters, scopes).
5. Trigger conditions and conditional logic.
6. Resonance and Moment hooks.
7. Validation rules and execution order.
8. Worked examples (3 full cards).

---

## 2. Card Schema

Every card in `/data/cards.json` is one of four `type` values: `dad`, `kin`, `action`, `tool`. Top-level fields:

```json
{
  "id": "the-coach",                          // stable slug, never changes
  "name": "The Coach",                        // display name
  "type": "dad",                              // dad | kin | action | tool
  "faction": "Connection",                    // 1 of 6 factions (Decision 014)
  "tags": ["Cheering", "Teaching"],           // 1-2 virtue tags from the canonical 18 (Decision 022)
  "playTag": true,                            // does this card carry the Play cross-tag? (~30% should)
  "cost": 3,                                  // Attention to play
  "pitchValue": 2,                            // Attention generated if pitched into inkwell
  "rarity": "common",                         // common | uncommon | rare | signature
  "rulesText": "When you play another card here, that card gains +1 to its first effect.",
  "flavorText": "\"You miss 100% of the shots. So take it. I've got the rebound.\"",
  "image": null,                              // null in v1; path/url in v2

  "effects": { ... },                         // see §3
  "moment": { ... }                           // optional, see §6
}
```

### 2.1 Type-specific extensions

**Dad cards** add nothing — full Dad card matches the schema above.

**Kin cards** add:
```json
{
  "type": "kin",
  "maxMaturity": 18,                          // upper bound on Maturity counter
  "pitchValue": 0,                            // Kin cards CANNOT be pitched; engine enforces
  "effects": { ... }                          // typically minimal; Kin pay off at end of match
}
```

**Action cards** are one-shot. They resolve and go to discard:
```json
{
  "type": "action",
  "effects": { "onEnter": [...] }             // only onEnter is meaningful for Actions
}
```

**Tool cards** attach to a Dad permanently (Decision 028):
```json
{
  "type": "tool",
  "attachTo": "dad",                          // currently only "dad" valid
  "effects": {
    "passive": [...]                          // applies while attached
  }
}
```

### 2.2 Validation rules (engine enforces)

- `id` is unique across the entire card pool.
- `tags` length ∈ [1, 2]; each tag must be one of the 18 canonical virtues.
- `faction` must be one of the 6.
- `cost` ≥ 0; `pitchValue` ≥ 0.
- For Kin: `pitchValue` must be 0 (Kin cannot be pitched).
- `rulesText` length ≤ 25 / 30 / 40 / 60 words by `rarity` (Decision 029) — soft cap, simulator surfaces violators.
- `effects` shape conforms to §3.

---

## 3. Effects Schema

Effects describe *when* and *how* a card acts. Three kinds:

```json
"effects": {
  "onEnter": [ /* ops that run when the card is played into a zone */ ],
  "passive": [ /* continuous effects while the card is in play */ ],
  "activated": [
    {
      "name": "Listen Closely",                  // optional, for UX
      "cost": { "attention": 1, "tap": true },   // cost to use this ability
      "ops": [ /* ops that run when activated */ ]
    }
  ]
}
```

### 3.1 onEnter

Fires once, when the card transitions from hand to a zone. For Dad/Tool/Kin cards: when played. For Action cards: this is the only effect type that runs (then card goes to discard).

### 3.2 passive

Fires continuously while the card is in play. Passive ops do not consume Attention; they modify the engine's interpretation of other cards/rules.

Passive ops typically use `modify_*` ops that change what other things cost or how they work. The engine recomputes passive effects whenever the board changes.

### 3.3 activated

Fires when the player chooses to activate the ability (and pays the cost). Each activated ability has its own `cost` block:

```json
{
  "cost": {
    "attention": 1,                              // Attention spent
    "tap": true,                                 // tap = card cannot be activated again this turn
    "discard": 1                                 // optional: discard cards from hand
  },
  "ops": [...]
}
```

A card may have multiple activated abilities; player picks which to use. Tapped cards untap at start of their controller's next turn (Refresh phase).

### 3.4 Card without effects

Cards without mechanical effect (pure-flavor portraits, simple resonance fodder) use:

```json
"effects": {}
```

The card still contributes its faction and tags to Resonance.

---

## 4. Op Vocabulary

Twenty-one ops. Each op produces zero or more **Intents** (Decision 011 + BOBA-lessons "executor-intent pattern"). The interpreter collects intents, validates them, then applies them in a single reducer pass — no mid-resolution mutation.

### 4.1 Card movement ops

| Op | Parameters | Effect |
|---|---|---|
| `draw` | `count: int`, `filter?: TagFilter` | Draw N cards. Optional filter tutors a specific tag. |
| `discard` | `count: int`, `from: 'self_hand' | 'opp_hand'`, `chosen_by: 'self' | 'opp'`, `filter?: TagFilter` | Discard cards from a hand. |
| `recall` | `count: int`, `from: 'self_discard' | 'opp_discard'`, `filter?: TagFilter` | Return cards from discard to hand. |
| `bring_back` | `from: 'self_discard'`, `to_zone: ZoneRef`, `filter?: TagFilter` | Return a card from discard to a zone (the **Persisting** virtue's primary op). |
| `reveal` | `count: int`, `from: 'self_deck' | 'opp_deck' | 'opp_hand'` | Reveal cards. They return to their origin in the same order. |
| `arrange` | `count: int`, `target: 'self_deck' | 'opp_deck'` | Look at top N cards of a deck; player rearranges. |

### 4.2 Resource ops

| Op | Parameters | Effect |
|---|---|---|
| `gain_attention` | `amount: int` | Add Attention to your inkwell this turn (decays at end of turn per D023). |
| `tax_attention` | `target: PlayerRef`, `amount: int`, `duration: 'next_card' | 'turn'` | Increases the cost of the target's next card or all cards this turn. |

### 4.3 Tag manipulation

| Op | Parameters | Effect |
|---|---|---|
| `add_tag` | `target: CardRef`, `tag: VirtueTag`, `duration: 'turn' | 'permanent'` | Add a virtue tag to a card. |
| `remove_tag` | `target: CardRef`, `tag: VirtueTag` | Remove a tag (rare; only certain disruption ops). |
| `borrow_tag` | `from: CardRef`, `to: CardRef` | Copy a tag from one card to another for the turn. |

### 4.4 Resonance / Virtue ops

| Op | Parameters | Effect |
|---|---|---|
| `mark_practiced` | `tag: VirtueTag`, `target: PlayerRef` | Mark a virtue as Practiced for a player (rare — usually emerges from Resonance). |
| `force_resonance` | `tag: VirtueTag`, `zone: ZoneRef` | Forces a Resonance event for the named tag in a zone (both players mark Practiced). |
| `prevent_disruption` | `target: CardRef`, `duration: 'turn' | 'permanent'` | Target card is immune to opponent's tax_attention / borrow_tag / arrange ops. |

### 4.5 Kin ops

| Op | Parameters | Effect |
|---|---|---|
| `mature_kin` | `target: KinRef`, `amount: int` | Add Maturity counters to a Kin. |
| `kin_record` | `target: KinRef`, `tag: VirtueTag` | Force a Kin to record a specific virtue tag (instead of an adjacent Dad's tag). |

### 4.6 Zone / placement ops

| Op | Parameters | Effect |
|---|---|---|
| `relocate` | `target: CardRef`, `to_zone: ZoneRef` | Move a card to a different zone. |
| `attach` | `target: DadRef` | (Tool ops only) Attach this Tool to a Dad. |

### 4.7 Moment & flavor ops

| Op | Parameters | Effect |
|---|---|---|
| `capture_moment` | `name: string`, `flavor: string` | Capture a Moment for the active player's Highlight Reel. |

### 4.8 Conditional / control ops

| Op | Parameters | Effect |
|---|---|---|
| `if` | `cond: Condition`, `then: [Op]`, `else?: [Op]` | Branch on a condition. |
| `for_each` | `iter: SetRef`, `as: 'card' | 'tag' | 'player'`, `do: [Op]` | Iterate a set; bind each element to a name. |
| `choose` | `prompt: string`, `options: [{label, ops}]`, `chooser: PlayerRef` | Player picks one of several effects. |

(No explicit `random` op. Per `/research/tcg-analysis/balance-approaches.md`, Dad TCG keeps in-card RNG to a minimum; shuffle-based RNG is the only randomness. If a card needs apparent randomness, prefer `arrange` (player gets to look) or `choose` (player picks). The "out of pocket" feeling for Moments comes from card combinations, not coin flips.)

---

## 5. Targeting Language

Targets are described with reference objects. Each op that takes a target accepts a `Target` (a single thing) or a `TargetSet` (filtered group).

### 5.1 Target reference types

```
PlayerRef    ::= 'self' | 'opp'
ZoneRef      ::= 'family' | 'craft' | 'community' | 'any_self_zone' | 'any_opp_zone' | 'any_zone'
CardRef      ::= 'this' | { in: ZoneRef, controller: PlayerRef, filter?: CardFilter }
KinRef       ::= CardRef restricted to type:kin
DadRef       ::= CardRef restricted to type:dad
SetRef       ::= a TargetSet, e.g. all Dad cards in self_zones with tag 'Holding'
```

### 5.2 Filter syntax

```json
{
  "filter": {
    "type": "dad",
    "tag": "Listening",
    "faction": "Presence",
    "anyTag": ["Holding", "Mending"],
    "controller": "self",
    "in_zone": "any_self_zone",
    "playTagOnly": true
  }
}
```

All filter keys are AND'd. `anyTag` is the OR variant: matches cards with at least one of the listed tags.

### 5.3 Target prompt UX

When an op needs a player choice (e.g., "discard a card from your hand"), the engine surfaces a prompt to the player. The prompt includes the op's text, the legal targets, and a confirm/cancel.

For deterministic playback (replays, seeded sims), if multiple legal targets exist and no chooser is set, the engine defaults to the lowest-id target (alphabetical) — never random. This makes the engine reproducible.

---

## 6. Moment Hooks

Per Decision 019, Moments are events captured to the Highlight Reel. They do NOT contribute to Legacy / Virtues Practiced.

A card may declare a Moment hook:

```json
"moment": {
  "name": "PEP TALK",
  "trigger": {
    "when": "after_play",                    // when this card resolves...
    "filter": {                              // ...if these conditions are met...
      "kin_in_same_zone": true,
      "self_tag_matches_played_tag": "Cheering"
    }
  },
  "flavor": "\"You miss 100% of the shots. So take it. I've got the rebound.\""
}
```

Moment triggers can also live on Year cards (Year cards' moments fire once when the Year is revealed, if conditions match). Moments captured this turn are stamped with the current Year (turn number) on the Highlight Reel.

The full Moment-trigger vocabulary (10-20 named conditions) will be authored in M1 alongside card content. Sample triggers from RULES.md §11.6: `kin_in_same_zone`, `three_play_tag_in_zone`, `granddad_and_kin`, `dad_alone_in_zone`, `first_kin_to_zone`, `all_cards_moved_this_turn`, `long_distance_dad_outside_zone`, `coach_and_kin_simultaneous`.

---

## 7. Resonance Hooks

Resonance is an engine-level mechanic (Decision 027), not a card-level effect. Cards trigger Resonance simply by sharing a zone with an opponent's card that shares a tag.

Cards CAN bias the Resonance economy through specific ops:
- `force_resonance` — creates a Resonance event without a paired opponent card.
- `prevent_disruption` — protects against opponent's anti-Resonance ops.
- `add_tag` (with permanent duration) — increases the tags a card carries, increasing its Resonance frequency.

Cards CANNOT block Resonance against themselves (no "prevent Resonance" op). The framework's "no us and them" demands that mutual benefit is structurally guaranteed.

---

## 8. Conditional Logic

```json
{
  "op": "if",
  "cond": {
    "type": "kin_in_same_zone_as",
    "card": "this",
    "minMaturity": 1
  },
  "then": [
    { "op": "draw", "count": 1 }
  ],
  "else": [
    { "op": "gain_attention", "amount": 1 }
  ]
}
```

### 8.1 Condition types

| Type | Parameters | Tests |
|---|---|---|
| `kin_in_same_zone_as` | `card: CardRef`, `minMaturity?: int` | Is there a Kin in the same zone? |
| `tag_in_zone` | `tag: VirtueTag`, `zone: ZoneRef`, `controller: PlayerRef` | Does any card in the zone carry this tag? |
| `card_count` | `filter: CardFilter`, `op: '>=' | '<=' | '='`, `value: int` | Counts cards matching filter. |
| `year_in_range` | `from: int`, `to: int` | Current Year is in this range. |
| `attention_remaining` | `op: '>=' | '<=' | '='`, `value: int` | Attention currently in inkwell. |
| `virtue_practiced` | `tag: VirtueTag`, `by: PlayerRef` | Has this player Practiced this virtue this match? |
| `not` / `all` / `any` | Logical combinators. | |

### 8.2 Examples

```json
{ "op": "if",
  "cond": { "type": "year_in_range", "from": 13, "to": 18 },
  "then": [ { "op": "gain_attention", "amount": 1 } ]
}
```
*"Once your kid hits the teen years, you get an extra hour."*

```json
{ "op": "if",
  "cond": { "type": "all", "of": [
    { "type": "kin_in_same_zone_as", "card": "this", "minMaturity": 3 },
    { "type": "virtue_practiced", "tag": "Listening", "by": "self" }
  ]},
  "then": [ { "op": "capture_moment", "name": "FIRST REAL TALK", "flavor": "..." } ]
}
```

---

## 9. Execution Order & Validation

When an op produces intents that conflict (e.g., two players both try to play into a full zone), the engine resolves in this order:

1. **Active player intents first** (APNAP — Active Player, Non-Active Player order).
2. **Within a player, in declaration order** (the order ops appear in the JSON).
3. **Resonance and Moment hooks fire AFTER all played-card ops resolve** (in the End phase per D027).
4. **Passive effects re-evaluate after every state mutation** (cheap because the engine is pure-functional).

Validation happens at two layers:
- **Schema-time** (loading the JSON): types, ranges, references valid.
- **Run-time** (when an op produces intents): legal targets, sufficient resources, zone capacity.

If an intent is invalid at run-time, the engine **silently skips** that intent and logs it. The card's other intents continue. This is forgiving by design — a card with a missed intent shouldn't crash the match.

---

## 10. Worked Examples

### 10.1 The Coach (Dad — Connection — Cheering, Teaching)

```json
{
  "id": "the-coach",
  "name": "The Coach",
  "type": "dad",
  "faction": "Connection",
  "tags": ["Cheering", "Teaching"],
  "playTag": false,
  "cost": 3,
  "pitchValue": 2,
  "rarity": "common",
  "rulesText": "When you play another card in The Coach's zone, that card's onEnter effect runs at +1 strength.",
  "flavorText": "\"You miss 100% of the shots. So take it. I've got the rebound.\"",
  "effects": {
    "passive": [
      {
        "op": "boost_friendly_enter_in_zone",
        "from": "this",
        "delta": 1
      }
    ]
  },
  "moment": {
    "name": "PEP TALK",
    "trigger": { "when": "after_play", "filter": { "kin_in_same_zone_as": "this" } },
    "flavor": "\"You miss 100% of the shots. So take it. I've got the rebound.\""
  }
}
```

(`boost_friendly_enter_in_zone` is a domain-specific passive; it's a parameterized variant of `add_tag`/`modify_cost` style. M1 will resolve which exact ops compose this; for now it reads as a single op.)

### 10.2 Burned the First One (Action — Resilience — Trying, Tending — Play tag)

```json
{
  "id": "burned-the-first-one",
  "name": "Burned the First One",
  "type": "action",
  "faction": "Resilience",
  "tags": ["Trying", "Tending"],
  "playTag": true,
  "cost": 1,
  "pitchValue": 1,
  "rarity": "common",
  "rulesText": "Discard one card from your hand. Draw two cards. (You learn from the burnt one.)",
  "flavorText": "\"Burnt the first one. Got the second one right. The kid ate three.\"",
  "effects": {
    "onEnter": [
      { "op": "discard", "count": 1, "from": "self_hand", "chosen_by": "self" },
      { "op": "draw", "count": 2 }
    ]
  }
}
```

### 10.3 The Eldest (Kin — no faction; takes virtue tags from raising Dads)

```json
{
  "id": "the-eldest",
  "name": "The Eldest",
  "type": "kin",
  "faction": null,
  "tags": [],
  "cost": 2,
  "pitchValue": 0,
  "rarity": "common",
  "maxMaturity": 18,
  "rulesText": "When a Dad activates in The Eldest's zone, The Eldest gains 1 Maturity and records that Dad's virtues. At end of match, count up to (Maturity) distinct recorded virtues you haven't already Practiced; mark each Practiced.",
  "flavorText": "\"They're watching you. They've been watching for a while.\"",
  "effects": {}
}
```

(The Maturity-and-Record mechanic is engine-handled per RULES.md §11; the Kin card declares the rule but doesn't need to repeat the engine logic in JSON.)

---

## 11. Future Extensions (deferred to v0.2+)

- **Compound costs** (e.g., "pay 2 Attention OR discard a Holding-tagged card"). v0.1 supports single-cost activated abilities only.
- **Zone-scoped passives** that affect ALL cards in a zone (currently passives target friendly cards only by default).
- **Multi-target choose** (currently `choose` picks one of N options; multi-select needs new shape).
- **Trigger windows** (currently triggers fire at fixed phases; advanced cards may want "the next time X happens"). v0.1 keeps this simple.
- **Replacement effects** ("if X would happen, instead Y") — deferred unless playtest reveals a strong need.

---

## 12. Schema Versioning

This document specifies **EFFECTS DSL v0.1**. Card data files reference the schema version:

```json
{
  "schemaVersion": "0.1",
  "cards": [...]
}
```

Breaking changes bump the version. The engines refuse to load card data with an unrecognized schemaVersion and surface a clear error.

When the schema evolves (likely after M1 sim/playtest), the migration plan goes here and in `/data/README.md`.
