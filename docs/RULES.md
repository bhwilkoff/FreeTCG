# Dad TCG — Rules v0.1

*Date: 2026-05-08. Status: first complete draft, web-playable in M1 once the JS engine ships. Derived from Decisions D011-D021 in `DECISIONS.md`. Sections marked `[INFERRED — CONFIRM]` are best-guess details derived from the locked decisions; they may be overridden in M1 without invalidating the decisions above. **Dad TCG is digitally playtested only — there is no paper version.**

---

## 1. What Dad TCG Is

Dad TCG is a two-player card game about **a generation of being a good dad**. Not the birth-to-adulthood arc of one specific kid — the eighteen-year span of a dad's life as a dad: the kids he raised, the kids who weren't his but he showed up for anyway, the years he worked the night shift, the years he coached the team, the years he was the friend, the year his own father was sick, the year of the hot-lava living room.

Your deck represents **the many ways YOU show up as a dad** — not one character, but a roster of facets. The Coach, The Tinkerer, The Listener, The Player, The Steady Hand, The Provider — all of them are *you*, in different moments, for different people. Your Kin cards are the people you raise and mentor across the generation: your kid, the neighbor's kid you taught to ride a bike, the mentee at work, the niece you taught to fish.

Each match runs 18 Years. **Each Year is unique** — drawn fresh from a shared deck of dad-life Moments (the Sunday Pancake, the Forgotten Lunch, the Severe Tire Damage Year, the Hot Lava living room). No two matches navigate the same generation. Same structure, new story every time.

**Two parallel tracks run through every match:**
- **Legacy** — distinct Virtues practiced across the 18 Years. Determines the winner.
- **The Highlight Reel** — Moments captured when specific cards, Year cards, or board-states fire. Doesn't determine the winner. Determines the *feeling* of the match.

Most matches, both tracks light up. Some matches you'll lose the Legacy race and walk away with the better Highlight Reel — and that, too, is a kind of winning. Being a dad isn't just doing the work. It's also the part where you make somebody laugh until milk comes out of their nose.

The game is grounded in the **Detoxing Man** virtue framework: 30 single-adjective virtues (Kind, Attuned, Sincere, Present, Patient, Unfinished, etc.). Each card carries one or more virtue tags. The strategic question of every turn is: *where am I putting my attention, and what virtue am I practicing this year?* — but the *joyful* question is: *what's about to happen that we'll talk about for years?*

---

## 2. Setup

Each player needs:
- A **deck** of cards (size below).
- An **inkwell** space (a face-down stack of cards used as the Attention resource).
- A **hand** (cards drawn from the deck).
- A **Legacy sheet** (a small tracker of Virtues Practiced — physical or app-rendered).

The two players share:
- Three **zones** between them: **Your Family**, **Your Craft**, **Your Community**. Both players play cards into these same zones.
- A **Year deck** of ~40-50 dad-life Year cards (see §11.6). Shuffled at start of match; one card revealed per turn.

**Starting state:**
- Shuffle your deck. Draw an opening hand of **5 cards** *[INFERRED — CONFIRM]*.
- Each player may **mulligan once** (return any cards to deck, reshuffle, redraw to 5) *[INFERRED — CONFIRM]*.
- Shuffle the shared Year deck.
- Decide who goes first by any agreed method.

---

## 3. Deck Construction *[INFERRED — CONFIRM]*

- **Deck size:** 40 cards minimum, no maximum.
- **Copies cap:** up to 4 of any card.
- **Faction restriction:** a deck may use cards from at most 2 factions. Mono-faction decks (all cards from one faction) gain a small **Faction Bond** at start (described in §10).
- **Kin cap:** a deck may include up to 4 Kin cards.

Reasoning: 40 is the middle of the genre range; small enough that key cards show up reliably, large enough that decks aren't fully solved per match. 4-of cap matches MTG / Lorcana convention. The 2-faction limit gives Dad TCG a real deckbuilding decision without exploding balance work; it parallels Lorcana's 2-color rule.

---

## 4. The Resource: Attention

Every card has two costs printed on it:
- **Play cost** (top-left, e.g., `2`): how much Attention you spend to play this card for its effect.
- **Attention value** (bottom-right, e.g., `1`): how much Attention this card adds to your inkwell if you pitch it instead of playing it.

On your turn you may pitch any number of cards from hand to your inkwell, face-down. They sit in the inkwell stack; you can spend that much Attention this turn.

**Attention does not carry over between turns** *[INFERRED — CONFIRM]*. At end of each turn, unused Attention is lost. *(Alternative: persistent inkwell, like Lorcana — flag this as a v0.2 playtest variable.)*

You cannot un-pitch a card; once it's in the inkwell, it's spent for the match.

The "what should I pitch vs. play?" decision is the central skill curve of Dad TCG. It is the lived practice of the Patient virtue made mechanical.

---

## 5. The Six Factions

Each card belongs to exactly **one faction** and carries **1-2 virtue tags** drawn from the 30 canonical virtues. Tags are the fine-grained synergy axis; faction is the coarse-grained one.

### 5.1 Presence
*"Show up. Stay present."*
**Virtues:** Present, Sincere, Kind, Loving
**Mechanical signature:** Cards stay in zones across turns and accumulate small rewards for *each turn they remain*. Reward consistency; punish chasing tempo. Presence is the dad who's there year after year.
**Card examples:** The Listener, The Steady Hand, The Mr. Rogers, The Cheerleader.

### 5.2 Connection
*"Build relationships. Resonate."*
**Virtues:** Connected, Attuned, Empathetic, Open, Collaborative, Communicative
**Mechanical signature:** Cards trigger Resonance more easily — they have wider tag overlaps, and their effects enhance when they share a zone with the opponent's cards. Connection is the dad who finds common ground.
**Card examples:** The Friend, The Storyteller, The Long-Distance Dad, The Stepdad.

### 5.3 Growth
*"Unfinished is more interesting."*
**Virtues:** Unfinished, Willing, Engaged, Curious, Adaptable, Introspective
**Mechanical signature:** Cards accumulate **Growth counters** as they remain in play; their power, abilities, or virtue tags expand with counters. No Growth card has a "final form" — they keep growing for the whole match. Growth is the dad who never stops becoming.
**Card examples:** The Tinkerer, The Reader, The In-Progress Dad, The Adventurer, The Recovery Dad.

### 5.4 Agency
*"Do the work. Move the world."*
**Virtues:** Active, Capable, Desirous, Purposeful, Communicative
**Mechanical signature:** Cards let you take **extra actions** per turn — play a second card, draw extra, generate Attention. Agency is the dad who shows up by *doing*.
**Card examples:** The Provider, The Coach, The Cook, The Player, The Single Dad.

### 5.5 Integrity
*"Do what you say. Tell the truth."*
**Virtues:** Trusted, Responsible, Conscious, Respectful, Equitable
**Mechanical signature:** Cards declare their effect when played, then resolve **exactly as declared** — even if doing so costs you tempo. Integrity cards refuse hidden information; some grant bonuses to BOTH players when their Virtues align. Integrity is the dad who is the same person at home as he is in public.
**Card examples:** The Conscious Dad, The Defender, The Granddad, The Big Brother Dad, The Quiet Type.

### 5.6 Resilience
*"Keep going. Hold the others up."*
**Virtues:** Resilient, Patient, Caring, Supportive, Grateful
**Mechanical signature:** Cards **return from discard**, **heal** other cards' lost Growth counters, or **persist** through soft disruption. Resilience is the dad who comes back, the one who's still there after the storm.
**Card examples:** The Recovery Dad, The Late Dad, The Cook (in Caring mode), The Single Dad.

*[INFERRED — CONFIRM] Communicative is currently listed under both Connection and Agency; pick one before locking the card pool. My inclination: **Connection** (the framework's emphasis is on emotional communication, which is relational).*

---

## 6. Card Types

There are **four card types** in v0.1:

### 6.1 Dad cards (the core type)
A character card with a portrait, faction, virtue tags, play cost, Attention value, and a rules-text effect. Dad cards stay in their zone after being played until the match ends.

### 6.2 Kin cards (the next-generation type)
A young person the dads are raising. Kin start with **Maturity 0**. Each turn that a Dad card with a Virtue tag activates while the Kin is in play, the Kin gains **+1 Maturity** AND notes the activating Dad's virtue tag.

At end of match, each Kin contributes bonus **Virtues Practiced** to its controller's Legacy: up to a Kin's Maturity value, count distinct virtue tags noted on the Kin and add them to the controller's Legacy (not double-counting tags already practiced).

Kin do NOT score Legacy directly. They are *multipliers* on virtues already practiced — the dad who raised them counts more for what he taught.

*[INFERRED — CONFIRM]* Kin cards have play cost but no Attention value (you can't pitch a Kin to the inkwell; a Kin is a person, not a resource). Kin remain in play after entering and cannot be returned to hand.

### 6.3 Action cards
One-shot effects (e.g., "Pep Talk: a Dad card in target zone gains +1 Growth counter"). Discarded after resolution.

### 6.4 Tool cards
Equipment-like cards that attach to a Dad card and modify it (e.g., "The Toolbelt: Dad gains the Repair virtue tag while equipped"). Stay in play attached to a specific Dad.

*[INFERRED — CONFIRM]* Tool cards as a v1 type may be skipped if the card pool feels crowded; defer to M1 simulator results.

### 6.5 Cross-cutting tag: `Play` (joy modifier)

In addition to faction and virtue tags, any card may carry the **`Play`** tag. Play-tagged cards aren't a separate type — they're a marker that this card has a sense of humor or whimsy. Mechanically:

- Many Moment triggers (§11.5) check for Play-tagged cards.
- Play-tagged cards often have lighter mechanical effects (smaller stat bumps) but more chances to capture Moments.
- Card examples that should carry the Play tag: any Dad Joke, any Action card with random/surprise outcomes, the Adventurer-class cards, the Cook-class cards in their Sunday-dinner mode.

The `Play` tag is the structural answer to: *how does fun show up in this game?* It's the joke under the rules' surface — Dad TCG is a sincere game with a comic-strip soul.

---

## 7. Turn Structure

A turn has six phases, in order:

### 7.1 Refresh phase
- Untap any tapped cards (used abilities reset).
- Reset your turn-Attention (Attention from previous turn is gone).
- **Reveal the next Year card** (see §11.5). Its modifier is in effect for both players for this turn. (At turn 1 the Year card is revealed before the first player's draw.)

### 7.2 Draw phase
- Draw 1 card from your deck.
- If you cannot draw (deck empty), nothing happens — but each subsequent attempt to draw subtracts 1 from your Hand size cap that turn *[INFERRED — CONFIRM, alt: deck-out is a soft loss]*.

### 7.3 Intention phase
- Declare an **Intention** — name one of the 30 Virtues out loud (or tap on the Virtue token in the digital UI).
- The declared Intention is visible to the opponent. You cannot change it after declaration.
- If a card you play this turn has the declared Virtue as one of its tags, you mark that Virtue as **Practiced** on your Legacy sheet.
- You declare exactly one Intention per turn; you cannot skip the Intention phase.

### 7.4 Pitch phase
- You may pitch any number of cards from your hand to your inkwell. Each contributes its printed Attention value to your Attention pool for this turn only.
- You may not pitch cards from elsewhere (the board, your discard, opponent's zone).

### 7.5 Play phase
- You may play any number of cards from your hand by paying their play cost from Attention.
- Played cards go into one of the three zones (Your Family / Your Craft / Your Community) chosen at play time.
- Cards with `Enter` effects resolve as they enter the zone.
- Activated abilities of cards in play may also be used here, paying any printed Attention costs.

### 7.6 End phase
- Each zone is checked for **Resonance**: for each pair (your card, opponent's card) in the same zone that share a Virtue tag, **both players** mark that virtue as Practiced on their Legacy sheets.
- Each Kin in play that had a Dad activate adjacent to it this turn gains +1 Maturity and notes the Dad's virtue tags.
- Growth-faction cards gain their +1 Growth counter.
- Discard down to **maximum hand size of 7** *[INFERRED — CONFIRM]*.
- Pass turn.

After 18 turns each (i.e., turn 18 ends with the second player's End phase), the match ends.

---

## 8. The Three Zones

Three zones sit between the two players, each representing a domain of dad-life:

- **Your Family** — what happens within the household and inner circle. The partner, kids, parents-still-with-us, chosen-family. Inclusive of any household structure. Cards played here often carry Presence and Integrity virtues. Reward consistent showing-up.
- **Your Craft** — vocation, passion, the working life. The job, the practice, the calling — paid or unpaid. Cards played here often carry Agency and Growth virtues. Reward purposeful action.
- **Your Community** — hobbies, teams, neighborhoods, faith, mutual-aid, friendships outside the inner circle. Cards played here often carry Connection and Resilience virtues. Reward engagement beyond the household.

Each zone has up to **4 card slots per player** (so 8 cards total max in any one zone; 12 across the board) *[INFERRED — CONFIRM]*. Once a zone is full for you, you cannot play more cards there; you may play in another zone or pitch the card to the inkwell.

When you play a card, you choose which zone it enters. The zone is part of the card's identity for the match.

Zones interact through Resonance (§9) and through faction-specific zone effects (some cards' effects depend on which zone they're in).

---

## 9. Resonance

At the end of each turn, the engine checks each of the three zones. For each zone:

1. Look at each of your cards in that zone.
2. Look at each of the opponent's cards in that zone.
3. For each pair (your card, opponent's card) that **share at least one Virtue tag**, **both players** mark that shared Virtue as Practiced.

Resonance is **bidirectional** — it benefits both players. The framework's "no us and them" means that when your dad and the opponent's dad both embody Patience in the same zone, *both households* are stronger for it.

**Resonance does not double-count.** If a player has already Practiced a Virtue, marking it again has no effect — but for end-of-match Legacy, only *distinct* Virtues count anyway.

**Soft disruption** (the only kind allowed):
- Reroute attention: cards that say "opponent's next card costs +1 Attention this turn"
- Peek and rearrange: "look at the top 3 cards of opponent's deck and put them back in any order"
- Pace shift: "this turn, opponent's End phase happens before their Play phase"

No card destruction. No card-to-discard from opponent's board. No counterspells.

---

## 10. Intentions and Virtues Practiced

Every turn you declare one Intention (one of the 30 Virtues). When you play a card with that Virtue as a tag, you mark it Practiced.

**Why Intentions matter.** A card can have 2 Virtue tags. Without an Intention, every card would auto-mark every tag — and every player would just race tag count, not strategy. The Intention adds a **one-virtue-per-turn primary cap** on your own plays; you can still get other virtues marked through Resonance.

**Resonance vs Intention:** Resonance can mark Virtues you didn't declare. So a turn where you declared "Patient" but resonated on "Sincere" marks both — the Patience from your own play, the Sincerity from Resonance.

**Mono-faction Bonus** *[INFERRED — CONFIRM]*: If your deck is fully one faction, at start of match you mark that faction's "**Faction Bond**" — count one virtue from that faction's set as already Practiced. Tradeoff for narrower deckbuilding flexibility.

---

## 11. Kin and the Next Generation

Kin cards represent children, mentees, and proteges that the dads are raising. They are slow-burn: weak in the short term, valuable at end of match.

**Playing a Kin:** pay its play cost. Kin enters a chosen zone with Maturity 0.

**Maturity ticking:** at end of each turn, for each of your Kin in play, check whether one of your Dad cards activated this turn while in the same zone. If yes, the Kin gains +1 Maturity AND records the Dad's Virtue tag(s).

**End-of-match scoring:** at the end of turn 18, for each Kin in play, count up to *Maturity* distinct Virtue tags it recorded that you have NOT already Practiced. Mark those Virtues as Practiced on your Legacy sheet.

**Limits:**
- A Kin's recorded Virtue list is capped at its Maturity (so a Maturity-3 Kin records at most 3 distinct tags).
- A Kin can only contribute Virtues you haven't already Practiced; Kin multiply *new* virtues learned, not virtues you've already mastered.

**Why this works thematically:** the dad who raised this kid practiced Patience, Curiosity, and Sincerity. The kid grew up. At 18 (end of match), the kid carries those virtues forward — they ARE the legacy.

---

## 11.5 The Year Deck

The Year deck is a **shared anthological deck of ~40-50 dad-life Year cards** *[INFERRED — CONFIRM SIZE IN M1]*. At start of match, both players shuffle it together and place it face-down between them. Each turn during Refresh phase, the next Year is revealed.

A Year card has:
- **A name** (e.g., "The Saturday Pancake," "The Severe Tire Damage Year," "The Hot Lava Living Room")
- **Flavor text** (one sentence, in the Rapid Reflection voice)
- **A small mechanical modifier** that affects this turn for both players (e.g., "this turn, Connection cards cost -1 Attention" or "first Kin to enter a zone this turn captures a FIRST DAY Moment")
- *[INFERRED — CONFIRM]* Some Year cards may carry a Moment trigger directly: when revealed, capture a Moment for whichever player meets the condition (or for both).

**Why anthological, not chronological:**
The 18 Years of a match are NOT "Year 1 of a child's life through Year 18." They are 18 moments in a generation of dad-life — could be early childhood for one kid, could be high school for another kid, could be the year the dad's own father got sick. The order is shuffled. No two matches play through the same Years in the same order. Same structure, new story every time.

**Why ~40-50 Year cards (drawing 18):**
- Replayability — drawing 18 of ~50 means each match's Year deck is unique.
- Variety — no two matches feel like "early childhood is always the same." The Year you get for "Year 7" might be a hot-lava year, or a coaching year, or a working-late year.
- Storytelling — the random sequence creates an emergent narrative each match. *Year 3: The Letter Home. Year 4: The Coach Year. Year 5: The Quiet Year. Year 6: Hot Lava.* That's a story.

**Sample Year cards** *[INFERRED — DRAFT, EXPAND IN M1]*:

| Year card | Modifier | Flavor (sample) |
|---|---|---|
| The Saturday Pancake | First card played in Home zone this turn captures a Moment | *"Burnt the first one. Got the second one right. The kid ate three." |
| The Forgotten Lunch | Caring-tagged cards cost -1 Attention this turn | *"By the time you got to the school, he'd already shared somebody else's." |
| Coaching Practice | Mentorship-tagged cards gain +1 Resonance opportunity | *"You weren't sure they'd listen. They listened. Don't admit you were nervous." |
| The Letter | First Long-Distance-tagged play this turn captures a LETTER HOME Moment | *"You wrote the postcard from a parking lot. The breakfast knows." |
| The Severe Tire Damage Year | Resilience cards activate at +1 effect | *"You handled it. Didn't call anyone. Mostly didn't panic." |
| The Quiet Sunday | Non-Active cards activate twice this turn | *"Nobody had anywhere to be. Nobody filled the silence." |
| Hot Lava Living Room | All Play-tagged cards entering any zone capture a HOT LAVA Moment | *"The couch is the only safe place. Has been since the kid was four." |
| The Driver's License Year | Out & About zone gains +1 slot for both players this turn | *"You held the wheel for a second longer than you needed to." |
| The Recovery Year | Once this turn, return a card from your discard to your hand | *"Some years you come back from. This was one." |
| The Garbage Disposal Year | Soft Moment: small joy regardless of plays this turn | *"You didn't know it was a quarter. The kid didn't tell you." |
| The Texting Your Friends Year | Connection cards in any zone gain Resonance | *"You meant to text last week. You texted today. That's how it goes." |
| The Year He Listened | Listener-tagged plays capture a LISTENING Moment | *"You didn't fix it. You weren't supposed to." |

The full Year deck (40-50 cards) will be authored in M1, drawing heavily from the Rapid Reflection essays in `/research/masculinity-detox-extraction.md`.

---

## 11.6 Moments and the Highlight Reel

Alongside Legacy (the virtue accounting), every match generates a **Highlight Reel** — a list of memorable beats captured during play. Moments are joy made visible.

### How Moments are captured

Some cards have a printed `Moment:` clause. When the named conditions fire, the engine captures a Moment and adds it to your Highlight Reel.

**Sample Moment triggers** *[INFERRED — DRAFT, EXPAND IN M1]*:

- **HOT LAVA** — fires when three or more cards with the `Play` tag occupy the same zone simultaneously. *"Year 9: the floor became lava. Survivors: zero. Couches: heroic."*
- **SUNDAY COMICS** — fires when a Granddad-tagged card and a Kin are in the same zone. *"Year 13: three generations on one couch. Nobody understood the newspaper."*
- **TIRE DAMAGE** — fires when an Integrity-faction card resolves alone in the Out & About zone. *"Year 6: handled it. Did not call for backup. Did not panic. Mostly."*
- **GOT 'EM** — fires when a card with the `Dad Joke` tag is played and the opponent has 2+ cards in any zone. *"Year 11: the joke landed. The kid groaned. Victory."*
- **FIRST DAY** — fires the first time a Kin enters the Out & About zone after Year 5. *"Year 8: the school bus pulled away. The dad pretended not to wave."*
- **SURPRISE TRIP** — fires when all your cards move zones in a single turn. *"Year 14: 'Get in the car.' 'Where are we going?' 'You'll see.'"*
- **LETTER HOME** — fires when a Long-Distance Dad-tagged card activates from outside its current zone. *"Year 17: the postcard from the road. 'I miss the breakfast. The breakfast knows.'"*
- **PEP TALK** — fires when a Coach-tagged card and a Kin are both newly played in the same turn. *"Year 7: 'You miss 100% of the shots. So take it. I've got the rebound.'"*

### What Moments do mechanically

- They are **not Virtues Practiced**. They do not contribute to Legacy.
- They show up on the end-of-match Highlight Reel — labeled with the Year (turn) they fired, the cards involved, and a single sentence of flavor.
- The Reel is shareable (screenshot/export — UX in M2).
- *[INFERRED — CONFIRM]*: collecting **5+ Moments in a match** unlocks the "Good Year" recognition on your end-of-match screen — purely cosmetic, but a small celebration of the joy you brought.

The point of Moments isn't to win. It's that even when you lose the Legacy race, the match was *fun*. The dad who lost may walk away with the better Highlight Reel — that's its own kind of victory.

---

## 12. End of Match — Legacy + Highlight Reel

After turn 18 ends, the match concludes. Both players see a side-by-side end-of-match summary:

```
══════════════════════════════════════════════════════════
                YOU                  THEM
            ─────────             ─────────
Virtues Practiced:    14                 16    ←
  • Patient            ✓ Y3  ✓ Y8        ✓ Y2  ✓ Y14
  • Present            ✓ Y1                — 
  • Sincere            ✓ Y6  ✓ Y11       ✓ Y4  ✓ Y9 ✓ Y17
  ...

Resonances:           8                  8     (shared)

Kin matured:          1 (Maturity 3)     2 (Maturity 2 each)

Faction Bond:         Presence (Y0)      —

──────────────────────────────────────────────────────────

🎬 THE HIGHLIGHT REEL
──────────────────────────────────────────────────────────
Year 7  ⚡ HOT LAVA           — yours
Year 9  📰 SUNDAY COMICS      — yours
Year 13 🚗 SURPRISE TRIP      — yours
Year 14 📬 LETTER HOME        — theirs
Year 17 ⚾ PEP TALK            — yours

You: 4 Moments    They: 1 Moment

──────────────────────────────────────────────────────────
Their Legacy: 16 Virtues. Yours: 14.
Good game, dad. They built a bigger Legacy this time.
Your Hot Lava year is gonna get retold for a while.
The kid still thinks you're cool.
══════════════════════════════════════════════════════════
```

**Winner:** the player with more distinct Virtues Practiced.

**Tiebreakers** (in order):
1. Most distinct Virtues Practiced.
2. Most Moments collected (the dad who brought more joy breaks the tie).
3. **Fewer Missed Years** (a Year is "Missed" if the player did not play any Dad card or activate any Dad ability during that Year — see §13).
4. Rarest Virtue Practiced.
5. Highest total Maturity across Kin.
6. Most Resonances during the match.
7. (Last resort) Random.

### Loss-frame voice

The screen does NOT say "You Lost." Loss copy varies slightly by what happened in the match — see options below — but the consistent tone is **warm + dry-funny**, in the voice of the Rapid Reflection essays. Some templates *[INFERRED — DRAFT, REFINE IN M1]*:

If the loser had the better Highlight Reel:
> "They built more this time. You brought more joy. The kid still thinks you're cool."

If the match was close:
> "Good game, dad. One Virtue away. Next year."

If the loser had a particular standout Moment:
> "Their Legacy: 16. Yours: 14. But the Hot Lava year? That one's yours forever."

If the loser had a Kin reach high Maturity:
> "Their Legacy was bigger. The kid you raised? Still showing up for them. Still worth it."

The framework's *In-Progress* posture means you are not "losing" in the sense of having failed — you are practicing, and the next match is another year. The voice should *show* this, not tell it.

---

## 13. Missed Years

A **Missed Year** is any Year (turn) in which the active player did not play any Dad card *and* did not activate any Dad ability already in play. Pass-turns happen — sometimes you don't have the right card; sometimes you choose to inkwell everything. That's fine.

**What a Missed Year does:**
- It is recorded as "You weren't there" on the end-of-match Highlight Reel for that Year. The Year card's flavor still appears, but it's marked as a Year you missed. No mechanical penalty during the match.
- At end of match, **Missed Years break ties against you** (see §12 tiebreakers). The dad who showed up more Years wins ties.

**What a Missed Year is NOT:**
- Not a Virtue penalty. Virtues you practiced earlier remain practiced.
- Not a moralizing message. The Highlight Reel notes the absence honestly without preaching about it.
- Not a hard loss condition. You can Miss several Years and still win on Legacy.

**Why this exists:** the lived practice of being present is a daily choice. The framework's Present virtue (*"in both actions and feelings"*) is undercut if there's no mechanical pull toward showing up. Missed Years are the gentle nudge — soft enough to honor that hard years happen, real enough to reward the dad who showed up year after year.

---

## 14. Three Modes (Reminder of D008)

These rules are platform-neutral. The same ruleset runs:

- **Solo vs AI** (web + iOS). The AI has no special privileges; it sees only public information and plays to the same rules.
- **Local pass-and-play** (web + iOS). Two humans on one device; a "hand-off" screen between turns hides the active player's hand and Intention.
- **Game Center peer-to-peer** (iOS only, M6). Two iOS devices connected via GameKit turn-based match.

Determinism: with a fixed RNG seed (deck shuffle, mulligan), two engines should produce identical match outcomes from the same intent log. This makes the simulator (M1) and online play (M6) reliable.

---

## 15. Open Design Questions for M1 (Inline summary)

These are the `[INFERRED — CONFIRM]` items above, consolidated:

1. **Opening hand size:** 5 (proposal). Confirm or revise.
2. **Mulligan rule:** once, redraw to 5 (proposal). Confirm or revise.
3. **Deck size:** 40 minimum, no max, 4-of cap, 2-faction max (proposal). Confirm or revise.
4. **Attention persistence:** spent per turn (proposal). Alternative: persistent inkwell.
5. **Communicative virtue placement:** Connection (proposal) vs. Agency.
6. **Tool card type:** include in v1 (proposal) vs. defer.
7. **Hand size cap:** 7 at end of turn (proposal).
8. **Zone slot cap:** 4 per player per zone (proposal).
9. **Zone names:** Your Family / Your Craft / Your Community (proposal). User feedback welcome.
10. **Mono-faction Faction Bond:** 1 free virtue at match start (proposal).
11. **Tiebreaker by virtue rarity:** require global play-rate data (will be available after the simulator runs in M1).
12. **Loss-frame copy templates:** four sample variants drafted in §12; need voice pass.
13. **Deck-out behavior:** soft cap on hand draw (proposal). Alternative: hard loss.
14. **Moment trigger vocabulary:** ~8 sample triggers drafted in §11.6; full list of 20-30 will be authored in M1.
15. **Good Year threshold:** 5+ Moments in a match unlocks recognition (proposal).
16. **`Play` tag distribution:** roughly what % of the card pool should carry it? Aim for 25-35% so most decks have at least a few.
17. **Year deck size:** 40-50 cards (proposal). Smaller (30) means less variety per match; larger (60+) means more design work for v1.
18. **Year deck draws:** 18 (= turn count). Confirm Year cards exhaust at 18 OR allow re-shuffle if matches go long.
19. **Year card stacking:** can two players' Year-card modifiers both fire on the same Year if both reveal effects? Currently one Year per turn for both players — confirm.
20. **Missed Year definition:** "did not play any Dad card or activate one" (proposal). Confirm vs. broader "did not play anything" (would discourage pure-inkwell turns).

---

## 15. What's NOT Yet in v0.1

- Specific card text. Cards will be drafted in M1 from the archetypes draft (after revision against the 6-faction structure).
- Specific Intention-tracking UX (web/iOS).
- AI difficulty tuning.
- Online match data format (M6 question).
- Tournament format / banlist policy (defer).

---

*End of Rules v0.1.*

*This document is the canonical specification for the web and iOS engines that will be built starting in M1. The web app is the primary playtest medium; there is no paper version. If a rule contradicts a card, the rule wins until the rule is updated. If two cards interact in an undefined way, the engine surfaces a rules question to the player and logs it for resolution in the next session.*
