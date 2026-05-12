# Encoding Card Effects: DSL Patterns and a Recommendation for Dad TCG

The single biggest architectural decision in a TCG codebase is how cards encode their effects. Get it right and adding cards is a pleasure; get it wrong and every new card is a special case. This file surveys the patterns and recommends one for Dad TCG.

## Pattern 1: Imperative per-card scripts

*Examples:* Hearthstone clones (Lua scripts), Slay the Spire mods (Java subclasses), Cockatrice plugins, OCTGN packs.

Each card is a function or class that mutates game state when played:

```js
// per-card-script style
cards.fireball = {
  onPlay(state, target) {
    target.hp -= 6;
    state.log.push(`Fireball deals 6 to ${target.name}`);
  }
};
```

**Pros:** maximal expressiveness; any card is implementable.
**Cons:** every card is a code change; AI can't reason about cards (it sees opaque functions); balance changes require code edits, not data edits; impossible to share cards as data between web and iOS without porting each script twice.

**Verdict for Dad TCG: avoid.** The cost of dual-platform scripts is too high.

## Pattern 2: Full DSL with parser

*Example:* Forge has a substantial card-script DSL parsed from text files.

```
A:AB$ DealDamage | Cost$ 1 R | NumDmg$ 3 | ValidTgts$ Creature.YouDontCtrl
```

**Pros:** maximally expressive; data-driven; cards are pure data files.
**Cons:** writing the parser is a multi-month project; the DSL becomes its own learning curve; debugging is brutal; only justified for thousands of cards covering decades of evolving rules.

**Verdict for Dad TCG: massively over-engineered.** Don't write a parser for 80 cards.

## Pattern 3: Declarative effect JSON with op vocabulary

*Examples:* Many indie TCGs; the BOBA Playbook's `PLAY_EFFECTS_SCHEMA` approach you referenced; Marvel Snap's internal effect representation (inferred from public information; specifics not verified).

Each card declares effects as a structured tree of operations:

```json
{
  "id": "fireball",
  "cost": 3,
  "onPlay": [
    { "op": "deal_damage", "amount": 6, "target": "chosen_creature" }
  ]
}
```

A single interpreter walks the tree and executes ops. Adding a card means writing JSON; adding a *new mechanic* means adding an op to the interpreter (a rare event).

**Pros:** cards are pure data, shareable across platforms verbatim; balance changes are JSON edits; AI can read the structured effects to evaluate moves; testing is trivial (give the engine a card and assert state changes); the op vocabulary forces design discipline (if you can't express it in 20 ops, the mechanic is probably too weird).

**Cons:** the *first* exotic card forces you to either bend the schema or add an op; expressiveness ceiling is real.

**Verdict for Dad TCG: this is the right answer.** See recommendation below.

## Pattern 4: Event-driven hook system

*Used in:* most rules engines as a *layer*, not as the primary representation.

Cards register listeners on game events: `onCardDrawn`, `onCreatureDies`, `onTurnEnd`. The engine fires events; listeners react.

```json
{
  "id": "graveyard_lord",
  "triggers": [
    { "on": "creature_dies", "controller": "self", "effect": [...] }
  ]
}
```

**Pros:** clean model for "passive" or "triggered" abilities; the right shape for "whenever X happens, Y" cards.
**Cons:** trigger-ordering bugs are subtle (which trigger fires first when two trigger simultaneously?); listener lifecycles need care (when does a creature's "death trigger" deregister?).

**Verdict for Dad TCG: layer this on top of pattern 3.** Effects are JSON ops; passive/triggered abilities are listed alongside `onPlay` as `triggers`. The same op vocabulary executes both.

## Pattern 5: Effect stack / chain

*Examples:* MTG's stack, Yu-Gi-Oh!'s chain links.

When a spell is cast, it goes onto a stack; opponents may respond with their own spells; the stack resolves last-in-first-out. This enables "counterspells" and complex interactions.

**Pros:** maximally interactive; supports priority passes and instant-speed plays.
**Cons:** *complex*. Players struggle to learn it. Implementation is non-trivial. Mobile UI for the stack is genuinely hard.

**Verdict for Dad TCG: skip in v1.** Stack-based interaction is an MTG idiom that doesn't fit a "dad" theme. If you want responsive plays, use Hearthstone's "secret" model (predeclared triggers) or Marvel Snap's full-public-information model.

## Pattern 6: Trigger ordering and priority

Even without a stack, you face the *interaction problem*: when card A says "draw a card whenever X" and card B says "if you would draw, instead Y," which wins?

Standard solutions:
- **Replacement effects come before triggers** (MTG's rule)
- **Active player resolves their triggers first** (MTG's APNAP rule)
- **Strict timestamp ordering** (the older permanent's effect resolves first)
- **Explicit per-card priority field** (a numeric "priority: 100" on each effect)

For Dad TCG, **explicit priority field + APNAP** is the simplest defensible model. Document it in DECISIONS.md.

## Recommended approach for Dad TCG

**JSON DSL with a small op vocabulary, executor-intent pattern.**

Justification:
1. **80 cards is small enough** that a parser would be overkill, and large enough that per-card scripts double the work across platforms.
2. **Two platforms share the catalog verbatim**: the same `cards.json` ships on web and iOS. The interpreter exists in both languages but is the *only* per-platform code; cards are write-once.
3. **AI legibility**: the rule-based AI (`ai-opponents.md`) needs to read effects to evaluate plays. Structured JSON is dramatically easier to score than opaque scripts.
4. **Balance simulation**: the simulator (`playtest-balance-tooling.md`) operates on the same data; tweaking a card's cost is a JSON diff.

### Skeleton schema

```json
{
  "id": "string",
  "name": "string",
  "cost": 3,
  "type": "creature | spell | item",
  "stats": { "attack": 3, "health": 4 },
  "onPlay": [
    { "op": "...", ... }
  ],
  "triggers": [
    { "on": "creature_dies", "filter": {...}, "effect": [...] }
  ],
  "passive": [...]
}
```

### Op vocabulary (start with ~15-20)

`deal_damage`, `heal`, `draw_cards`, `discard`, `summon`, `destroy`, `move_zone`, `modify_stat`, `set_stat`, `add_resource`, `spend_resource`, `give_keyword` (e.g., taunt, lifesteal), `if`, `for_each`, `target` (resolves a target spec into a concrete entity), `random_choice`, `mill`.

### Executor-intent pattern

Effects don't mutate state directly. They produce **intents**:

```js
function executeOp(op, ctx) {
  // returns Intent[] — does NOT mutate
}
```

The engine collects intents, validates them (e.g., can't deal damage to an immune target), then applies them in a single reducer call. This makes effects pure-functional, makes the engine deterministic for replays, and gives you a single audit point ("which intents fired this turn?") for debugging.

This is the same pattern Redux uses (action creators → reducer) and the same pattern boardgame.io uses (move → log → state). It's a well-trodden path.
