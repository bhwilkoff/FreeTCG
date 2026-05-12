# Balance Approaches

How TCG designers actually keep their games playable across thousands of card interactions and tens of thousands of players. Each section describes a specific lever, who uses it, and what it costs.

---

## 1. Mana / Cost Curve Theory

The **cost curve** is the bedrock concept. For any given resource cost, there is a roughly expected power level — a 3-cost creature in MTG has expected stats around a 3/3 with no abilities or a 2/2 with a small ability. Cards above the curve (a 3-cost 4/4 with no downside) are pushed; below the curve, they're underpowered.

Mark Rosewater has discussed this as the **Vanilla Test** (a card with no text) and the **French Vanilla Test** (a card with only keyword abilities) — cards exist at known stat-to-cost ratios that all unique designs are measured against. A new mechanic can be "1 mana more efficient than vanilla" before it becomes broken; a new mechanic can also be "0.5 mana less efficient" before it becomes unplayable.

Hearthstone, Snap, Lorcana, and FaB all have analogous internal benchmarks. Snap's benchmark is roughly "power equals cost × 2": a 3-cost card averages around 5 power, a 6-cost around 11. Cards with abilities trade raw power for the ability.

For a small TCG, building a clear cost curve before designing any individual card is worth more than any single design choice afterward. A cost-curve table answers "is this card playable?" in seconds.

---

## 2. Color Pie / Faction Identity

The **color pie** is MTG's legendary contribution: each of the five colors has a sanctioned mechanical philosophy.

- White: order, weenies, rules-of-the-game effects
- Blue: knowledge, control, counterspells, card draw
- Black: ambition at a cost, removal, sacrifice
- Red: chaos, direct damage, haste, impulsive draw
- Green: nature, big creatures, ramp, anti-flying

The pie's purpose isn't theme — it's **balance through restriction**. Blue should not get cheap, large creatures (that's green/red); red should not get cheap counterspells (that's blue); green should not get cheap removal of any creature (that's black). Designers explicitly *refuse* to put a mechanic in a color that already has too much, even when thematic fit suggests otherwise. Rosewater calls this "color pie discipline."

Other games have analogues:

- **Lorcana**: 6 ink colors (Amber, Amethyst, Emerald, Ruby, Sapphire, Steel), each with archetypal flavors (Amber = healing/song, Steel = damage, etc.).
- **Yu-Gi-Oh**: instead of color, **archetypes** — clusters of cards naming the same word (Blue-Eyes, Dark Magician, Sky Striker). Each archetype has its own mini-color-pie of strategies. Far more granular and far harder to keep balanced.
- **Hearthstone**: 9 (now 11) classes, each with a hero power and a set of class-only mechanics.
- **FaB**: hero classes (Warrior, Wizard, Ranger, etc.) with talent overlays. A Warrior has its own card pool; a Light Warrior overlaps with Light cards from any class.
- **Star Realms**: 4 factions (Trade Federation, Star Empire, Blob, Machine Cult), each with a distinct mechanical signature (Federation = healing/economy, Blob = aggression).

Faction identity is **the cheapest, highest-leverage balance lever** a small TCG has. By restricting which cards can appear together, you cap the explosion of synergies you have to playtest.

---

## 3. Evergreen vs. Expansion-Specific Keywords

Every mature TCG eventually distinguishes:

- **Evergreen keywords**: present in every set forever (MTG: flying, trample, vigilance, haste, lifelink, deathtouch, hexproof, ward, menace, reach, flash, defender, first strike, double strike). These define the game's vocabulary and a player learns them once.
- **Set / expansion keywords**: introduced for one or two sets, then retired. They allow the game to feel fresh per release without bloating the permanent rules text.

The **keyword pruning cycle**: Wizards of the Coast deliberately retires keywords that lasted only a single set so the rules don't accumulate forever. Sometimes a keyword graduates from set-specific to evergreen (e.g., MTG's "scry" started in *Mirrodin* (2003) and was promoted later).

Yu-Gi-Oh, by contrast, has done little keyword pruning. Effects are written out longhand on every card, leading to its famous wall-of-text appearance and its reading-cost problem.

For a small TCG: pick **5-7 evergreen keywords** and **commit to them**, with maybe 1-2 expansion-specific ones per release. Resist the urge to invent a new keyword for every clever card.

---

## 4. Banlists vs. Format Rotation

Two different responses to the same problem (a card or strategy is dominant beyond what a designer intended):

- **Banlist / restricted list**: pull or limit the card. Yu-Gi-Oh updates its Forbidden/Limited/Semi-Limited list quarterly. MTG bans cards across formats as needed. Hearthstone "Hall of Fames" cards out of Standard.
- **Format rotation**: define a rolling window of recent sets that count as "Standard." Older cards leave Standard but remain in deeper formats (Modern, Legacy, Vintage, Wild). Pokémon and MTG both rotate.

Trade-offs:

- **Banlist** is precise, reactive, and lets the rest of the format keep playing. It also feels punitive — a player who paid for a card now can't use it.
- **Rotation** is predictable, gives the design team a clean slate every year, and forces players to refresh their decks (which, cynically, drives sales). It also obsoletes player investment cyclically.

A small indie TCG can use **a banlist without rotation** — every card stays legal forever unless it specifically gets banned. This protects player investment and keeps the small card pool intact.

---

## 5. Errata vs. Functional Reprints

When a card needs a fix:

- **Errata**: change the card's official text without printing a new card. Players use updated rulings; the physical card is now obsolete-as-printed. Disorienting at conventions but cheap.
- **Functional reprint**: print a new card with the same name and intent but updated wording. Common in MTG ("printed in current frame") and in updated Yu-Gi-Oh reprints. Doesn't require players to know the errata.
- **Ban / soft-ban**: skip the rewrite entirely.

Lorcana, FaB, and Snap have all done in-text errata via their respective digital companion apps; Snap, being digital-first, can update card text instantly and silently. This is one of the major balance-lever advantages of digital TCGs over paper.

---

## 6. Power Level Inflation

Every long-running TCG has a power-creep arc. Yu-Gi-Oh is the textbook case: Synchro Summons in 2008 made then-meta strategies obsolete; Xyz in 2011 obsoleted Synchro-only strategies; Pendulum in 2014 broke the rules of the existing summon economy. Each new mechanic was partly a meta-refresh tool and partly a sales-driving novelty.

MTG's response is **Standard rotation** — older "broken" cards naturally leave Standard, so power creep within Standard is bounded by 2 years' worth of design. Modern (2003-onward) and Legacy (every card) absorb the cumulative power creep at a less competitive level.

Snap, being a 12-card deck format, is highly sensitive to power creep — adding one too-strong card disrupts thousands of decks. Second Dinner has used **monthly OTA balance patches** to nerf overperformers and buff underperformers, often within hours of a problem being identified. This is the single best-known live-service TCG balance practice.

For a small indie TCG with a slow release cadence (1-2 expansions per year), power creep is manageable if each new mechanic has a clear power ceiling defined upfront, and if there's a scheduled balance-pass moment (e.g., 60 days post-release).

---

## 7. Single-Card Power vs. Interaction Power

A common hidden-balance failure mode: a card is fine on its own but unbalanced in interaction. MTG's *Splinter Twin* was a 4-mana enchantment that gave a creature haste and a tap-to-make-a-copy ability — fine in isolation, but in interaction with 2-mana *Deceiver Exarch* it became an infinite combo and dominated Modern for years before being banned.

Designers playtest this by **trying combinations explicitly**: Wizards' design team uses "future-card" trial sets to test what a new mechanic does with everything already printed. For a small TCG, the equivalent is a focused playtest checklist — every new mechanic gets a "what does this do with each other mechanic in the game" matrix.

Synergy bombs (cards explicitly designed to enable a strategy: tribal lords like *Goblin King*, archetype anchors like Yu-Gi-Oh's *Sky Striker Mecha-Mobile Hangar*) are the highest-risk category. They look weak on the spoiler page and they redefine the meta on release.

---

## 8. Marvel Snap's OTA Patches as a Model

Snap's monthly Over-The-Air balance patches are worth understanding in detail:

- Designers monitor **win rates by card** and by **deck archetype** in real time, segmented by player rank.
- When a card's win rate is consistently above ~55% (or below ~45%) in its primary deck, it's flagged.
- The team picks a small number (3-7) of cards to adjust each month and ships changes as text edits to the live game.
- Changes are **always announced with reasoning**, fostering player trust.

The lesson: **for any digital TCG, balance is a live-service question, not a launch question**. The best balance plan for a small TCG with both a paper and digital frontend would be:

- Print cards conservatively in paper.
- Reserve the right to errata in the digital app.
- Publicize errata changes as paper-card "rules updates" on the website.

If the game ships only digitally, the balance lever is essentially free.

---

## 9. Beta Playtest Groups vs. Statistical Telemetry

Two methods of finding broken cards:

- **Internal/closed beta playtest**: Wizards' "Future Future League" is the canonical example — an in-house team plays every new card, in playtest decks, against each other, for months before release. They find the obvious breaks.
- **Statistical telemetry**: shipping the cards to thousands of players and watching aggregated win rates. Catches the non-obvious breaks that didn't surface in 30-game internal sessions.

A small TCG can't afford a Future Future League, but can do:

- A **closed alpha** with 6-12 trusted players running 50+ matches per month.
- An **open beta** with public playtest tournaments on Tabletop Simulator or a custom web client.
- **Telemetry instrumentation from day 1** — log every match, every card played, every card type winning. Build reports in week 2.

---

## 10. "Feel-Bad" Mechanics

A category of mechanics that tend to draw player ire even when balanced:

- **Counterspells / negation** (MTG, Yu-Gi-Oh) — opponent does nothing on their turn.
- **Hand disruption / discard** (MTG black, Hearthstone discard) — opponent loses pre-planned cards.
- **Mill** (MTG, Yu-Gi-Oh) — opponent loses without "playing" a normal game.
- **Stun / lock** (MTG's Stasis, Yu-Gi-Oh's Floodgates, Hearthstone's freeze archetype) — opponent skips turns.
- **Draw-denial** — opponent doesn't even get cards to play.
- **Land destruction** (MTG, only in some sets) — opponent's resource development is undone.

The pattern: **mechanics that take away opponent agency feel worse than mechanics that just kill them**. Hearthstone's design explicitly minimizes counterspells and hand disruption for this reason. Snap has neither category at all.

A warm-tone TCG should likely **prune most feel-bad mechanics** and keep only soft variants:

- Soft counterspell ("opponent's next spell costs 1 more") → tempo cost, not negation
- Soft discard ("opponent reveals their hand; you choose 1 to put on the bottom") → information without removal
- Soft mill ("look at the top 2 of opponent's deck; choose which they draw next") → control without destruction

---

## 11. Practical Balance Levers for an ~80-Card Indie TCG

Distilled, the achievable practices:

- **Define a strict cost curve table before drafting any card.** Vanilla creature stats per cost. Deviation requires justification.
- **Pick 4-6 factions** with clear mechanical identities. Each card belongs to one. Multi-faction cards introduced sparingly.
- **Pick 5-7 evergreen keywords.** Resist new keywords until expansion 2.
- **Cap synergy bombs at 1-2 per faction.** Hard-test every synergy bomb in playtest.
- **Run a closed alpha for 6+ weeks** before expanding to open. Keep an active issue tracker.
- **Build telemetry from day 1.** Track per-card win rate, per-deck archetype rate, average game length.
- **Reserve errata as a primary tool.** Publish a versioned card-text changelog. Notify players in-app at update time.
- **Prefer banlist over rotation** for a small format. Player investment lasts; only ban what's truly necessary.
- **Avoid feel-bad mechanics or use soft variants.** Reserve hard counterspells for advanced/optional formats.
- **Schedule a "balance pass" milestone 60 days after each release.** Treat it as a budgeted task, not a reactive one.
