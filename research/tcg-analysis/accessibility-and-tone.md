# Accessibility and Tone

Why some TCGs feel like a friendly evening with family and others feel like a tournament chess match. The mechanics responsible for this distinction are mostly known, even if rarely written down explicitly.

---

## 1. The Kitchen-Table vs. Tournament Axis

Every popular TCG lives on a spectrum. On one end, the **kitchen table**: family playing on a Saturday night, mixed ages, mixed skill levels, decks built from recent purchases, rules looked up on a phone. On the other end, the **tournament floor**: optimized decks copied from competitive websites, judges adjudicating priority, 50-minute rounds against strangers.

What's surprising is that **the same game lives at both ends simultaneously**. MTG has both Commander (a kitchen-table format) and Modern (a tournament format). Hearthstone has both Casual mode and Legend rank. Pokémon has both family pre-constructed decks and World Championship play.

The difference is **not in the rules but in the surrounding context**: deck investment, opponent matchmaking, and time pressure. The game itself stays the same.

For a new TCG, this matters: **you cannot pick "casual" or "competitive" — you have to design so that both can coexist**. The tone-defining choices are about the casual end (because that's most players), but the mechanical robustness has to support the competitive end (because that's where loud feedback comes from).

The clearest tone-defining levers:

- Game length (a 3-minute Snap match has different stakes than a 40-minute MTG match)
- Card text density
- Faction archetypes (combat-flavored or affirmative-flavored)
- Win-condition framing
- Failure tone

---

## 2. Game Length as Tone

| Game | Typical match length | Tone |
|---|---|---|
| Snap | ~3 minutes | Anonymous, casual, "one more" loop |
| Star Realms | 15-20 minutes | Friendly, conversational |
| Hearthstone | 8-12 minutes | Snackable |
| Lorcana | 20-30 minutes | Family-table |
| Pokémon | 20-30 minutes | Earnest |
| MTG (Standard) | 30-50 minutes | Strategic |
| MTG (Commander) | 60-120 minutes | Social/storytelling |
| Yu-Gi-Oh (competitive) | 30-50 minutes | Combo-puzzle |
| FaB | 30-50 minutes | Duel-feel, tense |

**Sub-10-minute matches feel forgiving** because you're 60 seconds from the next one. Loss recovery is instant. **30-60-minute matches feel weighty** because losing means you spent half an hour and have nothing material to show for it.

The match-length question is also an **inclusion question**. A 90-minute match excludes families with younger kids, busy parents, and casual lunch-break players. A 5-minute match excludes the audience that wants to lose itself in deep strategic thought. The choice is structural and almost impossible to retrofit later.

---

## 3. Onboarding Cost

Approximate count of evergreen mechanical concepts a new player must learn:

- **Snap**: ~8 keywords (On Reveal, Ongoing, Discard, Destroy, Move, Merc, etc.) + a turn structure with 6 turns.
- **Star Realms**: ~5 (faction synergies, scrap, draw-an-extra-card-on-faction-match).
- **Hearthstone**: ~20 keywords (Charge, Taunt, Divine Shield, Battlecry, Deathrattle, etc.) + 11 hero powers.
- **Pokémon**: ~25 (status conditions, evolution, prizes, retreat cost, weakness/resistance, supporter rules, etc.).
- **Lorcana**: ~15 (Bodyguard, Challenger, Evasive, Reckless, Resist, Rush, Shift, Sing Together, Singer, Support, Vanish, Ward, etc.).
- **MTG**: ~30+ evergreen keywords + the full stack and priority system.
- **FaB**: ~25 keywords + class identities + reaction system.
- **Yu-Gi-Oh**: hundreds of mechanics across 25 years; current meta requires understanding ~50+ archetype-specific rules and the Chain.

A new TCG aimed at warm/casual play should cap evergreen concepts at **~10-12 keywords** and aggressively prune.

The visible signal of onboarding cost is the **average words per card**:
- Snap: ~10-15 words per card.
- Lorcana: ~15-25 words.
- MTG (modern): ~20-40 words, with some outliers.
- Yu-Gi-Oh (modern): often 100+ words, with 2-3 dependent clauses.

---

## 4. Failure Tone

What happens emotionally when you lose? This is a tone variable, not a balance one.

- **MTG**: losing often feels arbitrary in early games — mana flood/screw kills you without play. Veterans normalize this; newcomers feel unjustly defeated.
- **Hearthstone**: losing to RNG (Yogg, Discover, random draws) feels random; losing to a top-tier deck feels like "the game is unfair." Both feelings are common.
- **Pokémon**: losing typically feels like the opponent built up a stronger evolution faster — losses feel earned but the slog can feel long.
- **Snap**: losses feel quick and narratively tight — you get cubes back faster than you lose them on a snap retreat. The 3-minute loop means losses don't sting.
- **Lorcana**: losses feel like "they got to 20 first" — race feel, not violent feel.
- **Star Realms**: losses feel like "I built the wrong engine."
- **FaB**: losses feel earned because the game is tight and decisions visible — high agency, low randomness.
- **Yu-Gi-Oh**: losses to "going second against full board" feel humiliating because you didn't play.
- **Sorcery**: losses feel like a tactical defeat — positional missteps.

Losses with high agency feel "good game"; losses with low agency feel "unfair." A warm TCG wants high-agency losses and a quick-recovery framing.

---

## 5. Reading vs. Memorizing Rules Text

Two different cognitive loads:

**Reading**: a card you've never seen, parsed in 3-5 seconds during play.
**Memorizing**: cards your opponent might play, parsed during pre-game.

Yu-Gi-Oh's competitive scene is dominated by **memorization** — you can't possibly read a 5-clause card every time it's played, so competitive players know the meta cards by heart. This excludes casual players from competitive play almost completely.

MTG handles this with **font size, layout, and the New World Order rule**: common-rarity cards keep simple text; complexity migrates to higher rarities. This means a draft format (where most cards are common) stays readable; a constructed format (where players bring whatever they want) requires more memorization.

Snap, Lorcana, Hearthstone, and Pokémon all keep card text pithy. Snap's top text-density cards have 25 words. The platonic Snap card has 10 words.

Implications for warm-tone design:

- Cap card text at ~25 words for common cards, ~40 for rare.
- Use a single keyword to compress a complex effect ("Bodyguard: when an ally would be challenged, this is challenged instead").
- Reserve dependent-clause sentences ("if X, then Y, otherwise Z") for low-frequency rarities.

---

## 6. Iconography vs. Words

Iconography helps:
- Non-English players (international audiences)
- Players with low literacy
- Children
- Players with cognitive disabilities

But icons have their own cost:
- Players must learn the icon vocabulary
- Icons can be ambiguous (an arrow icon might mean "bounce" or "draw" or "move")
- Print quality matters (a tiny icon looks the same as a similar one)

The **best practice** is icons + words: a word-tagged keyword in the rules text, an icon next to it as a quick visual cue. MTG does this implicitly with the colored mana symbols (every color is identifiable by both shape and word). Hearthstone uses gem icons (Battlecry, Deathrattle have small triangles in the digital UI).

A new TCG should:
- Use color-coding for factions (one color per faction, plus a faction icon)
- Use a small icon next to each evergreen keyword
- Print the keyword *next to* the icon (not instead of) — for accessibility

---

## 7. Catch-Up Mechanics

Mechanics that give the player who is behind a chance to come back:

- **MTG**: cards like *Wrath of God* (mass-clear the board) reset a runaway leader's advantage.
- **Snap**: priority alternates based on who's winning; the losing player reveals last each turn (huge advantage).
- **Pokémon**: prize cards mean the **losing player draws cards faster** (because every prize taken is a fresh card in hand).
- **Hearthstone**: late-game "swing" cards (e.g., Reno Jackson's full-heal) let an underdog turn it around.
- **Lorcana**: the lore-race nature of the win condition means stopping the leader is achievable through challenges.

Catch-up mechanics matter for casual play because **mismatched-skill matchups** (parent vs. kid; expert vs. casual) become unfun if the leader's lead compounds. A few well-placed comeback cards keep matches close even when one player is outclassed.

The risk: **too much catch-up** makes the leading player feel cheated for playing well. The Snap "priority shifts to the underdog" is famously elegant because it's small enough that a dominant strategic position can still close out the win.

---

## 8. Cooperative and Solo TCGs

Most TCGs are inherently competitive (PvP), but cooperative and solo modes exist:

- **Marvel Champions** (FFG, 2019). LCG (living card game), 1-4 players cooperate against a "villain" deck driven by an automated rulebook. Player heroes have asymmetric kits. Strong solo play. Often discussed alongside *Arkham Horror: The Card Game* (FFG, 2016) which is similar.
- **Spirit Island** (board game, not TCG, but referenced). 1-4 players cooperate against a procedurally-driven invader.
- **Slay the Spire** (digital deckbuilder). Solo against an AI dungeon. Single-player roguelike loop.
- **MTG Arena's "Spike Rebellion" / NPC battles**. Wizards has experimented with PvE within MTG.

Cooperative and solo modes need different design:

- Solo modes need a **scaling AI or scenario** — not just "play against a bot of the same rules." The opponent has predictable phases or escalating difficulty.
- Cooperative modes need **hidden information per player** that's revealed in turn — otherwise it becomes "alpha-gamer" syndrome where one player solves everyone's turn for them.
- Both need a **defeat condition that doesn't blame any single player** — the team lost, not "you lost because Ben played the wrong card."

For Dad TCG's planned solo-vs-AI mode, the key reference is Slay the Spire's single-player loop and Marvel Champions' automated villain-deck mechanic. Both demonstrate that a card game with an AI opponent can be deep without requiring a complex AI engine — the "AI" is largely scripted reactions.

---

## 9. Implications for Mixed-Skill Play (Adult vs. Kid)

A game played by an adult and a kid faces a specific design problem: the adult will outthink the kid most of the time, but a game where the kid loses every match is no fun for either.

Three solutions seen in the genre:

- **Make the game short** (Snap-style 3-minute matches). The kid's loss is bounded and they get to try again instantly. Failure feels small.
- **Add structural variance** (locations, randomized markets). The board state itself differs each game; the adult's experience advantage shrinks because the metagame resets every match.
- **Hand-build the difficulty** (asymmetric starting positions). The kid plays a deck with stronger cards or higher starting life. Common in family game variants.

Lorcana's family-friendly framing is partly a result of its **race-style win condition**: a kid who is "behind on lore" can still see how to catch up (just quest more), unlike "behind on board" which can feel hopeless.

Snap's three-location structure means **the kid only has to win one location** to be in the game; even a partial understanding produces meaningful play.

---

## 10. Voice and Copy as Accessibility

The flavor text and naming conventions on cards are accessibility tools too. They communicate:
- "This game is for me" (a player feeling welcome)
- "This game is silly" or "this game is serious" (a tone signal)
- "This game has a story" or "this game is mechanical" (engagement framing)

Lorcana's flavor text leans into Disney warmth: a Mickey card has a quote that sounds like Mickey. Pokémon's flavor text describes Pokémon habitats with a naturalist's voice. Hearthstone's flavor text is consistently joke-forward (Brode-era Hearthstone is famous for its puns).

By contrast, Yu-Gi-Oh's modern card text has almost **no flavor text** — just dense rules. The competitive scene values function over feel. The result: the game's tone reads as "mechanical, no-nonsense, for the dedicated."

A warm-tone TCG should:
- Use named characters or archetypes that players can identify with (the way Pokémon names individual species rather than abstract creatures).
- Include flavor text on every card. It costs nothing in mechanical balance.
- Match the voice consistently across cards — if one card is sincere and another is sarcastic, players sense the mismatch.
- Use first-person voice or named-character quotes when possible (more relatable than third-person abstract description).

---

## 11. Summary of Tonal Levers

Compressed into a checklist for evaluating a TCG's tone:

| Dimension | Warm/casual end | Cold/competitive end |
|---|---|---|
| Match length | 3-15 min | 30-60 min |
| Keyword count | <12 | >25 |
| Card text length | <25 words | >40 words |
| Win condition | Race/affirmative | Reduce-to-zero |
| Failure mode | Quick restart, low agency loss | Slow, high investment |
| Catch-up mechanic | Strong, structural | Minimal, skill-rewarding |
| Iconography | Heavy use, paired with words | Mostly text, rules-as-text |
| Faction identity | Clear and few | Numerous, archetype-deep |
| Flavor text | Present on all cards, consistent voice | Absent or inconsistent |
| Solo/co-op support | Designed in | After-thought or absent |
| Randomness | Bounded; mostly structural | Either heavy in-card or none at all |
| Banlist policy | Conservative; player investment protected | Aggressive; metagame-first |

A given game can be at different positions on different rows — Snap is short (warm), card-text-light (warm), but card-acquisition-grindy (cold). Hearthstone is short (warm) but RNG-heavy (mixed). MTG is long (cold) but Commander-supportive (warm).

Tone is a multi-dimensional posture, not a binary.
