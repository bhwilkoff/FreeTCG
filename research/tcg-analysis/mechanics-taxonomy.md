# Mechanics Taxonomy

A cross-cutting view of how the eleven games surveyed in `games-overview.md` carve up the same design problems. Where one game might call something "energy," another calls it "ink"; the underlying choices are what we want to compare.

---

## 1. Resource Systems

The resource system is the **single most consequential** decision in TCG design. It dictates pacing, deckbuilding ratios, the variance in opening hands, and how steep the difficulty curve is for new players. Six families:

| Family | Mechanism | Example games | Pacing effect |
|---|---|---|---|
| **Land/mana from deck** | Resource is a card type, drawn at random | Magic, Sorcery (sites) | High variance — mana screw/flood is real. Deckbuilding ratio is itself a skill. |
| **Auto-incrementing** | Pool grows by 1 each turn | Hearthstone, Marvel Snap | Zero variance. Every turn has predictable resource. Removes mana-screw frustration entirely. |
| **Attached energy** | Resource as a card type that stays attached | Pokémon | Slow ramp, encourages investment in single units. Creates a "build up the attacker" arc. |
| **Inkable any-card** | Every card is dual-use as resource | Lorcana (ink), Flesh and Blood (pitch) | No screw possible (you can always pay). Cost is the card you spent, not a wasted draw. |
| **Action points** | Fixed per turn, no separate currency | Netrunner (clicks), Yu-Gi-Oh (summons-per-turn cap) | Eliminates resource variance entirely. Card text and summon limits do all the throttling. |
| **Deck-as-engine** | Resources come from the cards you drew | Star Realms (trade/combat printed on cards), Dominion (treasure cards) | Deck composition *is* the resource curve. No separate pool. |

A few observations:

- Mana-screw is the **defining frustration** of MTG, and every system after it is partly a response. The 2008+ generation (Hearthstone, Snap) chose auto-mana. The 2019+ generation (FaB, Lorcana) chose any-card-as-resource, which keeps the deckbuilding interest of MTG but eliminates the random failure mode.
- **Hot-dogs / honor / commodity systems** (sometimes used in lighter card games like *Food Chain Magnate* or *Honor of Kings: Card Edition*) are usually variants of the deck-as-engine pattern.
- **No-resource designs** (Yu-Gi-Oh) compensate by aggressively constraining what you can do per turn through card text — "once per turn," "you can only special summon X this way," "if you control a [type]." The complexity migrates from a global resource budget to local card-level rules, and the game's reading load skyrockets as a result.

---

## 2. Turn Structures

There are four broad models:

**a) Multi-step phases with priority passing.** Magic is the canonical example: untap, upkeep, draw, main 1, combat (with sub-steps), main 2, end, cleanup. Both players get priority during most steps, allowing instants and abilities. **High interactivity, high complexity.** Yu-Gi-Oh and Flesh and Blood follow this lineage.

**b) Single-stream turns with no opponent interaction.** Hearthstone, Star Realms, and most digital TCGs adopt this. The active player does everything; the opponent just watches. Counterspells and traps are minimized or removed. **Lower interactivity, much faster turns, much easier UI.** Pokémon is also largely in this camp (no instant-speed Trainers, with edge-case exceptions).

**c) Simultaneous reveal.** Marvel Snap is the standout. Both players plan secretly, both reveal at once, with a deterministic priority order resolving ties. **Extremely fast in real time, eliminates the analysis-paralysis problem of long opponent turns.**

**d) Action-point economies.** Netrunner gives each side a click budget and lets them spend clicks on heterogeneous actions (draw, install, run, gain credit). **Decision-rich and grid-like; highly skill-rewarding but more abstract.**

The trade-off chart roughly:
- More interaction → more depth, more time-per-turn, more complexity
- Less interaction → faster, friendlier, but riskier "solitaire" feel
- Simultaneous → fastest of all, but commits both players to upfront planning, reduces theater-of-mind

---

## 3. Win Conditions

| Win condition | Games | Tone |
|---|---|---|
| Life total to 0 | MTG, Hearthstone, FaB, Sorcery, Star Realms, Yu-Gi-Oh | Combative, "you killed me" |
| Quest/lore points | Lorcana (20 lore), Sorcery (variations) | Race/affirmative, "I got there first" |
| Deck-out (mill) | All deck-based games as secondary | Usually accidental, occasionally intentional |
| Location/zone control | Snap (2/3 locations), Netrunner (agendas in servers) | Strategic, "I held the field" |
| Prize-card collection | Pokémon (6 prizes) | Race/combat hybrid |
| Alternative win cards | MTG (Approach), Yu-Gi-Oh (Exodia) | Puzzle/combo, "I solved the deck" |
| Asymmetric scoring | Netrunner (7 agenda points, scored by either side) | Cat-and-mouse |

Patterns:

- **Most games default to life-to-zero** because it's the simplest model and creates clear board-state pressure.
- **Race-style win conditions** (Lorcana, Pokémon) shift the emotional register away from violence toward forward motion. This is significant for tone.
- **Multi-condition games** (Magic with mill + life + alt-wins; Yu-Gi-Oh with LP + Exodia + decking) keep more cards relevant by giving niche strategies a path.

---

## 4. Card Type Taxonomies

Across the eleven games, the recurring atomic types are:

- **Permanent units that sit on the board** (creatures, minions, characters, monsters, units) — present in every TCG except Dominion-style deckbuilders.
- **One-shot effects** (instants, sorceries, spells, actions, operations, events) — present in every game; sometimes split into "playable on your turn" and "playable on either turn."
- **Persistent effects on the board** (enchantments, ongoing, continuous spells) — common but not universal; absent from Pokémon, partial in Snap.
- **Equipment / gear / items / weapons** (artifacts, items, equipment, hardware, tools) — present in MTG, FaB, Lorcana, Hearthstone, Netrunner, Hero Realms.
- **Locations / sites / fields** (Snap locations, Sorcery sites, MTG lands, Yu-Gi-Oh field spells, Hearthstone locations, Lorcana locations) — increasingly common as a way to add **shared board state**.
- **Heroes / leaders / commanders / identities** (FaB hero, Hearthstone hero, Netrunner identity, Commander, Sorcery avatar, Lorcana lacks one but has trademark inkable cards) — singular cards that anchor deck identity.
- **Resources** (lands, energy, sites) — only in some games; the trend is to merge them with other types or eliminate them.
- **Evolution / transformation cards** (Pokémon Stage 1/2, MTG transform, Yu-Gi-Oh Synchro/Xyz from Extra Deck) — letting one card grow into another mid-game.

A modern TCG often consolidates: Snap has only "cards" (with rich text); Lorcana has Characters/Actions/Items/Locations and merges resources into the cards themselves.

---

## 5. Deck Size and Construction Rules

| Game | Min deck size | Copies cap | Notes |
|---|---|---|---|
| Magic Standard | 60 | 4 | Sideboard 15. Format rotates yearly. |
| Magic Commander | 100 | 1 (singleton) | Color identity locked to commander. |
| Pokémon | 60 (exact) | 4 (basic energy unlimited) | |
| Yu-Gi-Oh | 40-60 | 3 (modified by F/L list) | Extra Deck 15, Side Deck 15. |
| Hearthstone | 30 | 2 (1 for Legendaries) | Class-locked + Neutrals. |
| Snap | 12 (exact) | 1 (singleton) | No factions. |
| Lorcana | 60 | 4 | Max 2 of 6 ink colors. |
| FaB | 60 | 3 | Hero-locked class+talent. |
| Star Realms | 10 (starter) | n/a | No construction; shared market. |
| Sorcery | ~50 spellbook + ~30 atlas | 4 | Element-locked. |
| Netrunner | 45 | 3 | Influence system; identity-locked. |

The pattern: **older games trend longer (60-100 cards)**, **digital/modern trend shorter (12-30)**. Smaller decks reduce variance, accelerate match length, and lower the cost of starter sets. They also increase the impact of any one card, which makes balance harder.

The **singleton constraint** (Snap, Commander) creates dramatic deck variance and a high replay-feel because no two games draw the same. The **4-of cap** (most games) creates "consistent tutors" — you build to draw your key card most games.

---

## 6. Hand Limits and Hand Attrition

- **MTG**: hand max 7 at end of turn (discard down).
- **Hearthstone**: hand max 10 (cards beyond are burned).
- **Pokémon**: no max.
- **Yu-Gi-Oh**: 6 at end of turn.
- **Snap**: hand size grows turn over turn, no cap shown to player; deck has only 12 anyway.
- **Lorcana**: no hand limit.
- **Star Realms**: hand is exactly 5 each turn; you play it all every turn.
- **FaB**: hand refills to 4 each turn (most heroes), creating a tight per-turn budget.
- **Netrunner**: hand is your "grip"/"HQ" — running out is one way to lose (Runner is flatlined when damage exceeds grip).

The two extremes:
- **Refilling hand** (Star Realms, FaB) — every turn is a fresh decision space, no card hoarding, fast tempo.
- **Persistent hand** (MTG, Hearthstone) — strategic hoarding becomes a skill, opens "hand disruption" attack vectors.

Hand discard / hand attrition mechanics (e.g., MTG's Thoughtseize, Hearthstone's discard warlock) become "feel-bad" zones in lots of games — they target a player's planning rather than their board state.

---

## 7. Board Zones

Most TCGs have these zones:

- **Library / deck** (face-down draw pile)
- **Hand**
- **Battlefield / field / play area** (the main board)
- **Graveyard / discard / pile** (face-up trash, often used by recursion effects)
- **Exile / removed-from-game / banished** (cards put aside, often permanently)
- **Side / extra / arsenal** (set-aside spaces — Yu-Gi-Oh Extra Deck, FaB arsenal slot, Magic command zone, Pokémon prize, Netrunner heap/archives)

The **arsenal** in Flesh and Blood is interesting: a one-card holding zone where you can stash a card across turns, creating per-turn carryover even though hands refresh.

The **Snap board** literally has three location columns, each with up to 4 cards per side — a 3×4 grid for each player. Position within a location matters for some "this card affects the cards next to it" effects.

The **Sorcery realm** is a 4×5 grid shared by both players, with units occupying squares and movement points. This is closer to a tactics game than a typical TCG.

---

## 8. Randomness

Two flavors:

**Shuffle randomness** (universal). Drawing from a shuffled deck is the basic randomization in every TCG. It's accepted because (a) you can mitigate it via deckbuilding, (b) both players face it, (c) it creates variety across games.

**In-card randomness** (controversial). Hearthstone leans into this hard: "Discover" picks 1 of 3 random cards; "Yogg-Saron" casts random spells; coin flips, dice, "choose one at random," "summon a random minion of cost X" effects abound. The justification: digital play makes random adjudication free, and randomness creates streamable moments.

MTG and FaB minimize in-card randomness — most "random" effects in MTG are actually card-drawing (you choose what to do with what you drew). The genre-purist view is that *every random choice you don't make reduces player agency*; the streamer-friendly view is that *randomness creates surprise and reduces solvability*.

Marvel Snap uses random location reveal as a primary variance source — the locations themselves are randomized per match, but most cards are deterministic. This puts the variance at the **environment level** rather than the **card-effect level**, which feels different in play.

For digital-first TCGs, in-card randomness costs nothing to adjudicate, but a paper-based or paper-portable design pays a real complexity tax for it.

---

## 9. Other Cross-Cutting Patterns

**Summoning sickness** — A unit can't attack the turn it enters (MTG, Lorcana "drying ink," Hearthstone, FaB). A simple but enormous pacing tool: it keeps board buildup from being instant-attack and gives the opponent a turn to respond. Snap deliberately omits it (cards score on the turn they're played) because it has only 6 turns total.

**Tempo vs. card advantage** — Two of the genre's foundational concepts. *Tempo* = the rate at which you affect the board per turn. *Card advantage* = the count of useful cards in hand and on board vs. opponent. The most-discussed design principle in MTG strategy writing (e.g., Frank Karsten on ChannelFireball — unverified URL recall: channelfireball.com/articles).

**Combo vs. control vs. aggro vs. midrange** — The four-archetype model that nearly every TCG inherits, originally crystallized for MTG. Aggro tries to win fast on tempo; control survives and wins late on card advantage; combo assembles a specific multi-card win; midrange plays efficient threats and answers. A healthy meta typically has all four viable.

**Deck cycling / cantrip culture** — Cards that "draw a card" while doing something else are universal smoothing tools. Without cantrips, deck variance is brutal; with too many, every game plays the same.
