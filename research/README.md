# Dad TCG — Research Notebook

This directory holds the reference research that informed Dad TCG's design.
**It is not loaded by the app at runtime.** It exists so future contributors
(human or AI) can audit *why* certain mechanics, architectural patterns, and
balance approaches were chosen.

## Layout

```
/research/
├── README.md                       — this file
├── boba-lessons.md                 — architectural takeaways from the user's prior TCG (BOBA Playbook)
├── tcg-analysis/                   — survey of how popular TCGs work
│   ├── games-overview.md           — 11 modern TCGs at a glance
│   ├── mechanics-taxonomy.md       — cross-cutting categorization
│   ├── balance-approaches.md       — how designers maintain balance
│   └── accessibility-and-tone.md   — what makes a TCG warm vs. competitive
├── claude-skills/                  — survey of Claude Code skills & open-source TCG tooling
│   ├── README.md                   — index + per-topic recommendations
│   ├── claude-code-skills.md       — Claude skills relevant to TCG dev
│   ├── rules-engines.md            — Forge, XMage, boardgame.io, etc.
│   ├── card-dsls.md                — how card games encode effects in code
│   ├── ai-opponents.md             — heuristic AI, MCTS, etc.
│   ├── web-tcg-architecture.md     — vanilla-JS patterns
│   ├── ios-tcg-architecture.md     — SwiftUI + GameKit patterns
│   └── playtest-balance-tooling.md — simulators, win-rate matrices
├── SYNTHESIS.md                    — *(to be written after research completes)* Dad TCG mechanics direction
├── archetypes-draft.md             — *(to be written)* 15-25 starter archetypes
└── playtest-log.md                 — *(append-only, started in M1)* every playtest's notes
```

## How to read this

If you want the punch line, read in this order:

1. `boba-lessons.md` — concrete patterns the engine should adopt
2. `tcg-analysis/mechanics-taxonomy.md` — what the design space looks like
3. `tcg-analysis/balance-approaches.md` — how designers keep games fair
4. `SYNTHESIS.md` — the recommendations Dad TCG actually adopts (and why)
5. `archetypes-draft.md` — the starter card lineup

If you want the receipts, the `/games-overview.md` file documents each game
that informed the design.

## Source caveats

The `tcg-analysis/` and `claude-skills/` documents were assembled from
training-data knowledge (cutoff January 2026), not freshly fetched web
sources. Inline references are best-recall; URLs (where present) are flagged
"unverified URL — recall from training, not freshly fetched." Treat them as
pointers for further reading, not citations.

The `boba-lessons.md` document was assembled from a read-only review of the
user's prior TCG repo (`/Users/user/Documents/GitHub/BOBA-Playbook/`); it
quotes file paths and structures observed directly.

## What goes here vs. what doesn't

**Goes here:** TCG design references, architectural patterns, balance
methodology, Claude/AI tooling notes, playtest logs, paper-prototype results.

**Does NOT go here:** The actual game rules (`/docs/RULES.md`), the
card-effect DSL spec (`/docs/EFFECTS.md`), the card data (`/data/`),
architectural decisions (`/DECISIONS.md`), or current state (`/SCRATCHPAD.md`).
