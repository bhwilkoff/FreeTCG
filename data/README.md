# Dad TCG — Card & Archetype Data

This directory holds the **canonical data** for Dad TCG: archetypes, cards,
and (later) card-effect specifications. **Both the web app and the iOS app
read from this same data.** iOS bundles a snapshot at build time; web
fetches it at runtime.

## Files

```
/data/
├── README.md                — this file
├── archetypes.json          — list of dad archetypes (The Coach, The Tinkerer, etc.)
├── archetypes.schema.json   — JSON Schema describing the archetype shape
├── cards.json               — individual cards (each archetype has multiple cards)
├── cards.schema.json        — JSON Schema describing the card shape
└── effects.json             — *(to be added in M1)* per-card effect specifications (DSL)
```

## Why split archetype, card, and effect data?

Three different audiences:

- **Archetypes** describe *characters* — virtues, flavor, mechanical hook.
  Edited by writers and game designers. Rarely change after M1.
- **Cards** are the *playable pieces*. One archetype yields multiple cards
  (a portrait card, several action cards, maybe a finisher). Edited by game
  designers during balance passes.
- **Effects** are the *executable behavior*. A small JSON DSL parsed by the
  game engine (see `/docs/EFFECTS.md`, to be drafted in M1). Edited by
  designers and engineers.

Splitting these files keeps merge conflicts manageable when multiple people
balance the game in parallel.

## Schemas

`archetypes.schema.json` and `cards.schema.json` are JSON Schemas (Draft 2020-12).
They are **descriptive at this stage, not strictly validated** — the schema
will tighten in M1 once mechanics are locked. For now they document expected
field shapes so editors know what to fill in.

## Stable IDs

Every archetype and card has a `slug`-form ID (e.g., `the-coach`,
`the-coach-pep-talk`). IDs **never change** after a card is published to a
release; if a card needs to be reworked, *write a new card with a new ID and
deprecate the old one*. (Reasoning: stable IDs let saved games and decks
survive across patches without complex migration.)

## Schema versioning

The top-level `schemaVersion` field on `cards.json` and `archetypes.json`
tracks breaking changes. Bump it when adding required fields or changing
field semantics. The web and iOS engines both refuse to load data with a
schemaVersion they don't understand and surface a clear error to the user.

## Editing workflow

1. Open the relevant `.json` file in a text editor (JSON-aware syntax helps).
2. Validate against the schema (e.g., VS Code's JSON validation, or
   `npx ajv validate -s cards.schema.json -d cards.json`).
3. Run the simulator (when M1 lands) to check the new card doesn't break
   existing decks.
4. Commit with a clear message.

## What goes here vs. what doesn't

**Goes here:** All canonical card and archetype data. Schemas. Effect
specifications.

**Does NOT go here:** Card art (lives in `/assets/cards/` once art exists).
Player save data (localStorage on web, SwiftData on iOS — not committed).
Drafts and exploration (live in `/research/archetypes-draft.md` until
promoted).
