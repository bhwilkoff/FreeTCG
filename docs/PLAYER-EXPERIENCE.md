# Dad TCG — Player Experience Design

*Date: 2026-05-09. Status: design north star. This document describes what an ideal Dad TCG match should FEEL like, moment to moment. It supersedes the implicit experience implied by RULES.md v0.1, and informs the v0.2 rewrite of mechanics, card text, and UI.*

## 0. Direction: Tactical and story, in balance

**Dad TCG is a tactical card game whose payoff is a story.** The two halves are inseparable. Without tactics, the game has no stakes — every Year resolves the same way, and the Highlight Reel reads as a participation trophy. Without story, the tactics are sterile — clever play optimizes a counter that doesn't mean anything. The whole game lives in the balance.

What "balance" means concretely:

- **Tactically, every Year is a real puzzle.** Year cards have specific capture criteria. You have a hand and limited Attention. You and your opponent are racing to meet the criteria first, or to meet a harder Year better than they do. Cards have synergies; deck construction matters; opening hands matter; the order you play things matters. **Skill wins more matches than luck.**
- **Narratively, every captured Moment is a chapter.** The Year card's flavor is the chapter title. Capturing it adds a one-sentence beat to your Highlight Reel: *"Year 4 — Saturday Pancake. Burned the first one. Got the second one right. The kid ate three."* The Reel accumulates into a real story by match end.
- **The win matters AND so does the artifact.** There's a real winner — the player who captured more Moments. The win is declared honestly. AND below the win declaration, the Highlight Reel sits at full visual weight: chapters from your Years, exportable as an image. Both reasons-to-play co-exist; players can come for the tactics OR for the story OR both.
- **The opponent is a competitor and a co-author.** They're trying to beat you (real stakes); they're also living through the same eight Years from another angle (parallel narrative). Their reel sits next to yours at end of match. You can lose and still walk away with a Reel you'd save.
- **Cards are characters AND tools.** The Coach has a face and a voice (story). The Coach also has a specific mechanical job: free virtue practice when you play another card in his zone (tactics). Both layers always active.
- **Year cards are chapters AND constraints.** "The Saturday Pancake" tells you a scene. It also tells you precisely which tags will capture it. Flavor and rule reinforce each other — the rule is the scene's logic ("a Saturday morning means showing up for breakfast").

Three principles guide everything that follows:

1. **Actions speak.** Virtues are practiced through cards you actually play, not through declarations. (No virtue signaling.)
2. **Every beat is legible AND consequential.** Cause and effect must be visible AS narrative — "*Year 5: you played The Cook in Your Family. The Saturday Pancake captures.*" — AND must matter mechanically: capturing the Moment is what wins matches.
3. **The match leaves an artifact.** Win or lose, the Highlight Reel is the keepsake — the screenshot, the thing the player thinks about later, the reason to play another match.

The v0.1 build failed because it had mechanism without story. A pure-story rewrite would fail in the opposite direction — the tactics would dissolve and matches would feel weightless. The right answer is both.

---

## 1. The player

**You are the dad.** A multifaceted person striving to be present, generous, attentive, repaired, persistent. Your deck represents *the many ways you show up* across a generation: as Coach, as Tinkerer, as Listener, as Storyteller, as Player, as Quiet Type. None of these is "you" alone — each is a face of you in different moments. Across the match, you become a specific kind of dad through what you actually do.

Your Kin (the people you're raising or mentoring) sit on the board with you. Your tools sit with you. Your moments accumulate.

There's no abstract "Practice this virtue" announcement. You play The Cook into Your Family on a Saturday-Pancake Year, and *that* is Tending. That's how it was always supposed to work.

---

## 2. The match arc — 8 Years

A match is **8 Years** of dad-life. (Down from 18.) Each Year is a single round of play, drawn from the shared anthological Year deck (~50 cards, 8 drawn per match). Same structure, new sequence every match.

**Year 1** sets the stage. **Years 2-3** establish the situation. **Years 4-6** are the heart of the match — Moments compound. **Years 7-8** are stakes-high; final Moments often tie back to Kin who matured along the way.

Match length: **8-12 minutes** in the playable build. Tight. Snap-paced. Replayable.

> *Why 8 and not 18 or 6?* 18 dragged. 6 (Snap-length) felt too compressed for the dad-life arc. 8 hits a sweet spot: long enough that the early plays compound into late Years, short enough to stay punchy.

---

## 3. The core loop — what happens each Year

### Step A: Year reveal
At the start of each Year, the next Year card flips face-up between players. **Both** players see it. The Year card describes:
- A name and a one-sentence flavor (the situation: "The Saturday Pancake. The kid wakes up early. Wants pancakes. You burned the first one.")
- The **moment to meet** — what cards will capture this Year's Moment, in plain language ("Capture by playing 2+ cards with **Tending**, **Holding**, or **Trying** tags into **Your Family** this Year.")
- The reward (the Moment captured, plus optionally a small in-match bonus like "+1 Attention next Year")

### Step B: Both players play
Players alternate turns within the Year. On your turn:
- **Pitch a card** from your hand to your inkwell (gain Attention this Year only)
- **Play a card** from your hand into a zone (Dad/Kin), as an Action (one-shot effect), or as a Tool (attach to a Dad)
- **Pass.** When both players pass in a row, the Year ends.

A Year typically takes **2-4 plays per player.** Some Years run longer if the moment is hard to meet; some shorter if both players pass quickly to bank Attention for next Year.

### Step C: Resolution
When both players pass, the Year card's "moment to meet" criteria are checked.
- **If you met the criteria, you capture the Moment.** A short narrative animation/log entry confirms it: "You captured **The Saturday Pancake**. The Cook in Your Family + The Listener with Holding tags. The kid ate three."
- **If you didn't, the Year passes without capturing.** The Year card moves to the discard. Flavor: "*The pancake burned. There's always next Saturday.*"
- **Both players can capture the same Moment** if both met the criteria. The Year card has enough Moments-to-go-around for both — meeting moments isn't zero-sum.

### Step D: Cleanup
- Cards in zones **stay** across Years (Snap-style — your dad-self accumulates).
- Discards and hand persist. Inkwell resets to 0.
- Active Year card moves to the Year discard.
- Next Year reveals.

---

## 4. The win and the artifact

A match has two simultaneous payoffs: **the win** (real, decided, honest) and **the artifact** (the Highlight Reel, the keepsake). They share the end-of-match screen with equal visual weight.

**The win condition is simple: most Moments captured.** Tactically, that's what you're playing for in every Year — meet the Year's criteria before (or better than) your opponent. Skill wins more matches than luck.

**The artifact is the Highlight Reel** — a chronological narrative of every captured Moment, with flavor lines. It's exportable as a single image. Whether you won or lost, the Reel is yours. Some of the best matches are ones you lost narrowly with a Reel that has a perfect arc — and that's part of the point.

### What the artifact looks like

```
══════════════════════════════════════════════════════════════
A YEAR-EIGHT MATCH

YOUR EIGHT YEARS                          THEIR EIGHT YEARS

Year 1 ⚡ HOT LAVA                        Year 1 🎒 FIRST DAY
       "The couch is the only safe              "The bus pulled away.
        place."                                  He didn't wave back."

Year 2 🥞 SATURDAY PANCAKE               Year 2 — (a quiet Year)
       "Burned the first one. Got
        the second one right."

Year 3 📰 SUNDAY COMICS                  Year 3 ⚙️ TUTOR HOUR
       "Three generations on one              "I don't know. What do
        couch."                               you think?"
                                              [matches yours: both
                                               on Asking, Listening]

[... and so on through Year 8 ...]

Five Moments captured. They captured three.
You held more of this story. They held real chapters too.

[ Save as image ]   [ Play another match ]
══════════════════════════════════════════════════════════════
```

The reel is a **shared narrative**: when both players capture the same Year, both reels show it (and the UI marks the resonance). When only one captures, only their column is filled for that Year. When neither captures, both show the Year's title but mark it "(a quiet Year)" — that's part of the story too.

The artifact is **exportable as a single image** (canvas → PNG). The image is the keepsake. Players who play many matches accumulate a small library of stories. They can revisit the year their dad-self captured the Pep Talk on Year 7 against a sibling.

### The win declaration is honest

The screen names a winner clearly: *"You captured 5. They captured 3. You held more of this story."* In a close match: *"5 to 4. Same dad-life. Different responses."* In a tie: *"4 each. The eight Years go on both ledgers."*

Win or lose is named directly — no euphemism, no consolation prize. The Reel sits below it at full weight; both win and Reel are the payoff.

### Tiebreakers

When Moment counts tie, the order is:

1. **More Years where you played at least one card** (presence over absence).
2. **More Kin matured** (the people you raised).
3. **More distinct virtue tags shown across your played cards** (the multifaceted-dad signal).

These are surfaced as small notes on the reel ("They were present in 8 of 8 Years; you in 7"), not as triumphal tiebreaker callouts.

---

## 5. Cards rewritten in player-goal language

The current 12 sample cards have effects like *"Passive: friendly cards entering this zone get +1 to their first effect."* That's gibberish to a player. Every card needs rewriting in terms of what it does toward capturing Moments.

### The Cook (Dad — Presence — Tending, Holding) — rewritten

```
THE COOK                                          Cost 2  ↪Pitch 2
─────────────────────────────────────────────────
A face of you: warm, slow, present at the stove.

When you play The Cook into a zone:
  — Cards you play into this zone this Year cost
    1 less Attention.

Tags: Tending, Holding (counts toward any Year that
asks for either)

"Burned the first one. Got the second one right.
The kid ate three."
```

The player can see: *Playing The Cook makes my next card here cheaper. That helps me play another card to meet this Year's moment without paying full price.*

### The Coach (Dad — Agency — Advocating, Trying) — rewritten

```
THE COACH                                         Cost 3  ↪Pitch 2
─────────────────────────────────────────────────
A face of you: showing up calm at the field.

While The Coach is on the board:
  — When a Kin enters any of your zones, capture
    the PEP TALK Moment (regardless of Year).

Tags: Advocating, Trying

"You miss 100% of the shots. So take it.
I've got the rebound."
```

Now the value is concrete: *The Coach is a Moment-generator if I have Kin in play.*

### What Do You Think? (Action — Connection — Asking, Wondering) — rewritten

```
WHAT DO YOU THINK?                                Cost 1  ↪Pitch 1
─────────────────────────────────────────────────
A move of yours: asking instead of telling.

— Both players draw 1 card.
— Captures the LISTENING Moment if a Kin is on
  the board (yours or theirs).

Tags: Asking, Wondering

"I don't know. What do you think?"
```

The card teaches the bidirectional-teaching value AND has an instant Moment payoff.

### General template for card text

```
Card Name                     Cost N  ↪Pitch N
─────────────────────────────
Identity line (one sentence: what kind of dad-move this is)

Effect, in player-goal terms:
  — Bullet, plain language
  — Mention which Years/Moments it helps with

Tags: virtue1, virtue2

"Flavor in Rapid Reflection voice."
```

Every effect describes either:
- A Moment trigger (when X, capture moment Y)
- A direct help toward meeting THIS Year's criteria (cost reduction, extra play, extra tag)
- A persistent help across future Years (a passive bonus)

If a card's effect can't be described this way, it's the wrong effect.

---

## 6. Year cards rewritten as moments to meet

### The Saturday Pancake — rewritten

```
THE SATURDAY PANCAKE                                    Year card
─────────────────────────────────────────────────────────────────
The kid wakes up early. Wants pancakes. You burned the first one.

To capture this Moment:
  → Play 2 or more cards with TENDING, HOLDING, or
    TRYING tags into YOUR FAMILY this Year.

If both players capture, both keep the Moment. The kid ate
three pancakes. You did fine.

— SATURDAY PANCAKE captured: "Burned the first one. Got the
  second one right. The kid ate three."
```

A player reading this knows EXACTLY what to do. The mechanic IS the moment.

### Hot Lava Living Room — rewritten

```
HOT LAVA LIVING ROOM                                    Year card
─────────────────────────────────────────────────────────────────
The couch is the only safe place. Has been since you were four.

To capture this Moment:
  → Play any card with the PLAY tag into YOUR FAMILY this Year.

— HOT LAVA captured: "The floor became lava. Survivors: zero.
  Couches: heroic."
```

Joy-track Years are easier to capture (lower threshold) — they're meant to feel rewarding without being strategic.

### Sitting With Sadness — rewritten

```
SITTING WITH SADNESS                                    Year card
─────────────────────────────────────────────────────────────────
You didn't fix it. You weren't supposed to.

To capture this Moment:
  → Play a card with LISTENING into ANY zone this Year, AND
  → Pass at least one of your turns this Year.

Some moments are about NOT-doing. Passing here is part of
showing up.

— SITTING WITH captured: "Anything mentionable is manageable."
```

This is design-as-meaning: you literally have to *not act* to capture this Moment. The mechanic teaches the lesson.

---

## 7. The screen, organized around the story

The UI is organized so the **story is the foreground** and the mechanics are the supporting grammar:

### Top of the screen — the chapter
- **The current Year card**, large and central. Its flavor text is given as much visual weight as its rules. The Year is the *chapter title* of the current scene.
- A small **Year arc** above it — 8 dots, the current one bright, past ones marked with the Moment captured (or "—" if quiet). This is the spine of the story so far.

### Middle of the screen — the scene
- **The board** — three zones (Your Family / Your Craft / Your Community), each clearly labeled. Cards on the board are *characters in this scene*; their names and tags are large enough to read at a glance. Both players' cards appear in their zones, with controller marked subtly.

### Side panels — the reels-being-written
- **Your reel-in-progress** (left) — the Moments you've captured so far this match, oldest at top. New entries animate in with the Moment's flavor line. This is the *story you're writing*.
- **Their reel-in-progress** (right, smaller) — same shape, fewer details (you see their captured Moment names but not the full flavor until end of match). The point isn't to spy on their score; it's that you can see the *shape of their story* unfolding alongside yours.

### Bottom of the screen — your tools
- **Your hand**, bottom edge, fanned. Cards show cost / pitch / name / tags / effect text legibly. Cards that would help with the current Year are subtly highlighted ("This card has Tending — the Year wants Tending").
- **Your Attention**, inkwell amount, displayed near the hand.
- **Active prompts**, in plain narrative language: *"Your turn. The Year wants Tending or Holding in Your Family. Or pass — sometimes the right move is to wait."*

### Tooltips, hovers, narrative log
- Every virtue tag, faction, and card hover-tooltips with plain-language definition.
- A **recent-events feed** sits at the very bottom, one-sentence narrative entries: *"Year 4. They played The Tinkerer in Your Craft. The Tinkerer carries Mending and Adapting. The Year wants Mending."* Three entries deep; older entries scroll off.

### Color and tone
- Warm parchment background. Card panels in soft cream. Year card with a colored border indicating its tone (joyful, tender, bumbler, civic, generational, hard).
- No flashy "+1" floating numbers. When something happens, an animated narrative line appears in the events feed. Numerical state changes happen quietly.
- When a Moment is captured, the reel side panel pulses warmly and the captured Moment's flavor line animates in with a soft typewriter effect. *That's* the celebration — words landing in your story, not a fanfare.

---

## 8. The first match — onboarding as story

The first time a player opens Dad TCG, the tutorial is **a story they're inside**, not an instruction manual. The opponent has a name and a parallel life; the Years feel like real chapters; the prompts read as a friend explaining what's happening.

**Frame:** "*This is your first eight Years. You and the dad next door will live them in parallel.*"

The first AI is named — say, **The Dad Next Door** — and plays slow, predictable turns so the player can read the situation. The player gets inline coaching:

**Year 1 (tutorial overlay):**
> Welcome. You're playing through 8 Years of being a dad. This Year is **The Saturday Pancake**. Read the Year card — it tells you what to do to capture this Moment.
>
> *To capture it, you need to play 2 cards with Tending, Holding, or Trying tags into Your Family.*
>
> Look at your hand. **The Cook** has both Tending and Holding. Try playing The Cook into Your Family.

(Player plays The Cook; UI animates the play; the Year card highlights "1 of 2 matched — keep going!")

**Year 1 (continued):**
> Great. The Cook is also a multiplier — your next card in Your Family this Year costs 1 less Attention. **The Listener** in your hand has Holding. Want to play her here too?

(Player plays The Listener. Capture criteria reaches 2/2. The Year resolves.)

**Year 1 capture animation:**
> ⚡ SATURDAY PANCAKE captured. *"Burned the first one. Got the second one right."* This goes on your Highlight Reel.

After 3 Years of guided play, the tutorial fades to hover-tooltips only. The player finishes the match without overlays. End-of-match offers: "Play another match (no tutorial)" or "Replay tutorial."

The tutorial NEVER scolds, never holds your hand longer than necessary. It models the warm-funny voice in its prompts ("Don't worry — passing a turn doesn't lose you the Year. Sometimes the right move is to wait for the right card.").

---

## 9. What this rewrite REMOVES from v0.1

- **The declared-Intention phase.** Gone. No more "Pick a virtue this Year." Cards played determine virtues practiced.
- **Virtues Practiced as primary win condition.** Replaced by Moments captured. (Virtues practiced are still TRACKED for end-of-match summary as a tiebreaker and a story element, but not primary.)
- **18 turns.** Replaced by 8 Years.
- **Resonance as quiet end-of-turn check.** Replaced by visible "did we meet the moment?" resolution at end of each Year.
- **Missed Years tiebreaker.** Removed (replaced by "Years you played in").
- **The Phase state machine of Refresh→Draw→Intention→Main→End.** Simplified to: Year reveal → alternating plays → resolution.
- **The "+1 Attention to P2" initiative bonus.** Reconsidered — with the new tactical structure, may not be needed; verify in playtest.
- **Mulligan.** Reconsidered — for an 8-Year match with smaller decks, opening hand variance matters less; may simplify to no mulligan.

---

## 10. What stays (and gets STRONGER)

- **The 18 action-coded virtues** (Decision 022). They become the language of card tags and Year card capture criteria. Their meaning matters more, not less.
- **The 6 factions** (D014). Become deck-identity color pie. Less mechanical impact, more flavor cohesion.
- **The 3 zones — Your Family / Your Craft / Your Community** (D030). Become the spatial grammar of moments — most Year cards specify a zone affinity.
- **Inkable any-card Attention** (D023). Same mechanic. Slight tuning may be needed for shorter matches.
- **The 18 dad archetypes** (D022). Their mechanical hooks all get rewritten in player-goal language but the characters and identities are preserved.
- **Kin cards**. Become more central — many Year cards trigger when Kin are present.
- **Tools**. Become more central — some Year cards specify Tool affinity.
- **The Detoxing Man framework's voice and identity.** "You are the dad. Striving. In-progress. No one way to be a man." That's the soul.
- **The Highlight Reel.** Promoted from joy-track to scoreboard.

---

## 11. What this rewrite ADDS

- **Year cards as the engine.** The Year deck is the heart of the game; matches differ by which Years come up.
- **Capture criteria** on every Year card, in plain language.
- **End-of-Year resolution narrative.** Players see exactly what happened and why.
- **Always-visible Highlight Reel.** Both players' reels build through the match.
- **Hover tooltips** on every game element.
- **Tutorial first-match.** Inline coaching for the first 3 Years.
- **Card text in player-goal language.** Every card rewritten.
- **Recent events feed** showing the last 3 game events as plain-language narrative.

---

## 12. What this opens up for v1.0+

- **Year card variety as the primary expansion lever.** New expansions are new Year cards (the dad-life themes that come up). Card pool stays small; Year pool grows.
- **Tutorial → branching scenarios.** Once tutorial works, "scenario" matches with hand-curated Year sequences (e.g., "The First Year of Fatherhood" — 8 Years all about a brand-new kid).
- **Cooperative play.** Two players against a Year deck, trying to capture all 8 Moments together. Trivial extension of the resolution rules.
- **Solo "year of your life" mode.** One player vs an automated Year deck, no opponent. Matches feel like a journal.

---

## 12.5 The opponent in solo mode — competitor and co-author

The AI opponent in solo mode is two things at once:

- **A real competitor.** They play to win. They use the AI heuristic from /js/ai.js (or its rewrite) to score plays, race to capture Moments, and contest Years. Beating them feels earned because they're trying.
- **A co-author of the story.** They're "another dad living the same eight Years" — their Highlight Reel sits next to yours at end of match. Both reels read as parallel chapters. The story is about how differently two dads meet the same week.

Concretely:
- Solo-mode AI opponents have **names** ("The Dad Next Door," "The Dad Across The Street," "The Dad Who Coached My Kid"), not "AI." Names give them a face for the parallel-narrative framing without softening their competitive role.
- End-of-match copy names the winner directly: *"You captured 5. He captured 3."* Below it, both reels sit at full visual weight.
- The shared Year deck reinforces this: both of you are answering the *same* moments. Different responses, same Years.

This solves the user's "how do you tell a story to a CPU when you're just clicking" problem: the AI isn't your storytelling interlocutor; the AI is a *parallel character* whose Highlight Reel sits beside yours after the match. The story emerges from the side-by-side, not from real-time conversation.

In future versions, named AIs could develop personalities visible to the player (e.g., "The Dad Next Door tends to play in Your Craft early; bring cards that mismatch his rhythm") — but v0.2 just needs the framing.

---

## 13. Locked decisions (D031–D038)

The eight major v0.2 design decisions are now locked in DECISIONS.md:

- **D031** — v0.2 design pivot to tactical-and-story balance
- **D032** — 8-Year match (was 18)
- **D033** — 15-card singleton decks (Snap-style)
- **D034** — Per-Year Attention reset
- **D035** — Every Year has capture criteria
- **D036** — Snap-style board persistence (no slot cap; cards accumulate)
- **D037** — Resonance becomes Year-card-specific (no global mechanic)
- **D038** — No declared Intention phase (actions speak)

Smaller items still to decide before/during the rewrite (lower-impact, can be inferred during implementation):

- **Hand draw cadence:** likely "refill to 5 at start of each Year." Confirm in playtest.
- **Initiative each Year:** likely alternating (P1 first in odd Years, P2 first in even Years). Confirm.
- **Kin:** still a separate card type, more central now (Year cards often check Kin presence).
- **Tools:** still attach permanently to Dads.
- **Tutorial duration:** first 3 Years inline coached, then hover tooltips for remainder.

---

## 14. Implementation phases (after this doc is approved)

**Phase 1: Mechanics design** (~3-5 alignment questions to lock the open issues above).

**Phase 2: Card-text rewrite** (~12 sample cards + 28 Year cards rewritten in player-goal language, with capture criteria on every Year).

**Phase 3: Engine rewrite** to match new mechanics (8 Years, no Intention phase, alternating plays per Year, Year-end resolution). Reuse most of the current pure-functional structure; redo the phase machine and resolution logic.

**Phase 4: UI rewrite** with always-visible Highlight Reel, Year card front-and-center, hover tooltips, recent-events feed, plain-language card text, persistent Legacy panel.

**Phase 5: Tutorial first-match.** Scripted coach overlays for Years 1-3 of a new player's first match.

**Phase 6: Playtest and iterate.** Open the prototype; play it; refine.

Estimated effort: Phase 2 + 3 + 4 are the bulk; ~2-3 sessions of focused work.

---

## 15. The voice test (still applies, more important than before)

Every card, every Year card, every UI string passes the **Rogers test** — could this be said to a child without flinching? — and the **Rapid Reflection test** — does it have lived specificity rather than abstract virtue?

The new design makes the voice MORE important, not less, because the Year cards are now front-and-center. A Year card that reads as preachy or saccharine would land in the player's face every match. A Year card in the Rapid Reflection voice ("Burned the first one. Got the second one right. The kid ate three.") teaches the game AND carries the warmth.
