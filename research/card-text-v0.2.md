# Dad TCG — Card Text v0.2 (Player-Goal Language)

*Date: 2026-05-09. Status: phase 1 of v0.2 rewrite. Establishes voice and template for the full card pool. Each of the 12 sample cards is rewritten with: short effect text in player-goal terms, tags listed separately (since they speak for themselves in capture criteria), and flavor in Rapid Reflection voice.*

## Template

Card text uses a fixed visual layout — the player learns it once and reads every card the same way:

```
NAME                                Cost N  ↪Pitch N
─────────────────────────────────
Faction ✦ Tag1 ✦ Tag2

[Effect text — short, plain-language, in player-goal terms]

"Flavor in Rapid Reflection voice."
```

**Rules of card text:**
- **Effect text answers "what does this DO toward winning?"** — never op vocabulary, never abstract numbers without context.
- **Tags get their own line** — players don't need to be told "this card counts toward Years asking for X"; that's how the game works. The tags themselves speak.
- **Flavor sits at the bottom**, italicized, one or two sentences max.
- **Word counts** stay tight: ≤25 effect words for common, ≤30 uncommon, ≤40 rare. (Per D029.)

---

## The 12 sample cards

### 1. The Listener (Dad — common)

```
THE LISTENER                          Cost 2  ↪Pitch 2
Presence ✦ Listening ✦ Asking

Tap, pay 1 Attention:
Peek at the next card your opponent draws.

"I'm not going to tell you what I'd do.
 Tell me again what happened."
```

**Effect intent:** Information-as-tactic. The Listener gives you a peek into your opponent's near future — useful for deciding when to push for a capture vs. save Attention.

**Words:** 14 (well under the 25 cap).

---

### 2. The Storyteller (Dad — uncommon)

```
THE STORYTELLER                       Cost 3  ↪Pitch 2
Connection ✦ Welcoming ✦ Thanking

When you capture a Year, also capture a
TOLD AGAIN Moment.

"Did I ever tell you about your grandfather?
 Sit down. This one matters."
```

**Effect intent:** Multiplier. Each Year you capture, the Storyteller adds a second Moment to your Reel — a "the way you'll tell this story later" beat. Pushes toward the high-Reel-count strategy.

**Words:** 13.

---

### 3. The In-Progress Dad (Dad — common)

```
THE IN-PROGRESS DAD                   Cost 2  ↪Pitch 2
Growth ✦ Trying ✦ Wondering

Each Year you play a card with a virtue tag
you haven't shown before, gain a counter.
With 3+: your Trying cards cost 1 less.

"I cannot change the past. I can only
 course correct."
```

**Effect intent:** Rewards playing diverse virtues across Years. Builds quietly through the match; pays off in late Years when you can play Trying cards cheaply to push captures.

**Words:** 28 (within uncommon cap; could trim if locked as common).

---

### 4. The Coach (Dad — common)

```
THE COACH                             Cost 3  ↪Pitch 2
Agency ✦ Advocating ✦ Trying

When a Kin enters any of your zones,
capture the PEP TALK Moment.

"You miss 100% of the shots. So take it.
 I've got the rebound."
```

**Effect intent:** Pairs with Kin. Playing The Coach + a Kin = an extra Moment on your Reel, regardless of whether you captured the Year. Combo card.

**Words:** 13.

---

### 5. The Stepdad (Dad — uncommon)

```
THE STEPDAD                           Cost 2  ↪Pitch 2
Integrity ✦ Choosing ✦ Persisting

Carries every virtue tag of any Kin
sharing this zone (for Year capture).

"I don't have to be here. That's the point."
```

**Effect intent:** Tag-borrower. The Stepdad reads as whatever virtues the Kin nearby need him to be. Cheap, flexible — slots into many Year-capture combos.

**Words:** 14.

---

### 6. The Tinkerer (Dad — common, Play tag)

```
THE TINKERER                          Cost 2  ↪Pitch 2  ♪
Resilience ✦ Mending ✦ Adapting

Tap, pay 1 Attention:
Return a card from your discard to your hand.

"Replaces the wrong washer. Floods the basement.
 Laughs first. Then fixes it."
```

**Effect intent:** Hand replenishment. With 15-card singleton, recovering a discarded card is genuinely useful — you might get back the card that captures the next Year.

**Words:** 13.

---

### 7. What Do You Think? (Action — common)

```
WHAT DO YOU THINK?                    Cost 1  ↪Pitch 1
Connection ✦ Asking ✦ Wondering

Both players draw 1 card.
If any Kin is on the board, capture
the LISTENING Moment.

"I don't know. What do you think?"
```

**Effect intent:** The bidirectional-teaching action. Both players benefit (small card draw) AND the player benefits more if a Kin is in play.

**Words:** 19.

---

### 8. Burned the First One (Action — common, Play tag)

```
BURNED THE FIRST ONE                  Cost 1  ↪Pitch 1  ♪
Resilience ✦ Trying ✦ Tending

Discard one card from your hand. Draw two.

"Burnt the first one. Got the second one right.
 The kid ate three."
```

**Effect intent:** Net +1 hand size with player choice over what gets pitched. Smooths your draw. Pays for the bumbler-with-accountability voice.

**Words:** 9.

---

### 9. Pep Talk (Action — common)

```
PEP TALK                              Cost 2  ↪Pitch 1
Agency ✦ Advocating ✦ Trying

A friendly Kin gains +2 Maturity.
If a Coach is on your board,
capture the PEP TALK Moment.

"You're going to be fine. You're going to be
 better than fine."
```

**Effect intent:** Kin builder. Combos with The Coach. Direct path to Pep Talk Moment.

**Words:** 23.

---

### 10. Take the Long Way Home (Action — common)

```
TAKE THE LONG WAY HOME                Cost 1  ↪Pitch 1
Presence ✦ Holding ✦ Showing-Up

This Year, your cards in Your Family count
for an extra tag of your choice toward this
Year's capture.

"Drove the long way. Didn't say why.
 The kid figured it out."
```

**Effect intent:** A flex card for capturing Years — you choose which extra tag to apply, so you can match a Year's criteria you'd otherwise miss.

**Words:** 24.

---

### 11. The Toolbelt (Tool — common)

```
THE TOOLBELT                          Cost 1  ↪Pitch 1
Resilience ✦ Mending

Attach to a Dad on your board.
That Dad now also has Mending.

"Still has the same hammer. Still loses
 the same screwdriver. Always finds it."
```

**Effect intent:** Tag-grant. Turns any Dad into a Mending card too — useful for Years that need Mending.

**Words:** 14.

---

### 12. The Eldest (Kin — common)

```
THE ELDEST                            Cost 2  ↪Pitch —
(Kin — no faction)

Each Year a Dad of yours is in this Kin's
zone, The Eldest gains 1 Maturity and
remembers that Dad's tags.

End of match: each Maturity counts
toward your tiebreaker virtue variety.

"They're watching you. They've been
 watching for a while."
```

**Effect intent:** Build-over-the-match. The Kin's value grows as you play more Dads near them. End-of-match tiebreaker (not primary win) — keeps Kin from being a must-have but rewards investment.

**Words:** 35 (rare-tier text — Kin card is rare, fits).

---

## Pattern observations

After drafting all 12, what's working:

1. **Effect text is now scannable.** Every card's effect can be read in 5-10 seconds. Compare to v0.1 effect text full of op vocabulary.

2. **Flavor is doing more work.** With less mechanical text, the Rapid Reflection flavor lines breathe. They're the personality.

3. **The "When X, capture Y Moment" pattern repeats.** This is the dominant interaction with the win condition: cards either help capture the *current* Year or capture a *bonus* Moment. Players learn this pattern in the first 2 cards.

4. **Tags-on-their-own-line works.** Players see "Listening ✦ Asking" and immediately know "this card counts toward Years asking for those." No need to spell it out per card.

5. **Cost / Pitch / Play-tag indicators are fast-readable** in the corner. Standard TCG corner-numbers convention.

---

## What this changes for downstream phases

- **Year cards (Phase 2)** will follow the same structure: a flavor-named header, capture criteria in plain language, the captured Moment's flavor.
- **RULES.md (Phase 3)** can drop most rules-text-explanation since the cards speak for themselves. Rules doc focuses on the loop, not card mechanics.
- **Engine (Phase 4)** needs a richer effect-evaluation layer that handles "capture Year on condition X" explicitly — the current op vocabulary will still work but with new ops like `capture_year_moment` and `capture_named_moment`.
- **UI (Phase 5)** renders cards with the visual layout above. Tags as chips. Cost/Pitch in corner. Effect text body. Flavor italicized below.

---

## Open questions for user review (before Phase 2)

1. Does the **template layout** read well? (Cost/Pitch corner, faction-tags line, effect body, flavor.)
2. Are the **effect texts clear** at the level of: "I read this card and I know what to do with it"?
3. Are any **Moment names** (PEP TALK, TOLD AGAIN, LISTENING, SATURDAY PANCAKE, HOT LAVA) landing well, or do some feel forced?
4. Is the **Kin's tiebreaker scoring** the right level of side-mechanic — present but not central?
5. Should The Coach's PEP TALK trigger be **once per Year** (so multiple Kin in his zone don't farm it) or unlimited?
