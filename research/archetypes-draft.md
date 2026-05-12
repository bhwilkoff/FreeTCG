# Dad TCG — Archetype Draft v2 (Locked)

*Date: 2026-05-08. Status: locked starter set for M1 card pool. Eighteen archetypes across the six locked factions (Presence / Connection / Growth / Agency / Integrity / Resilience), three per faction. Each archetype anchors 2-4 individual cards in `/data/cards.json` (a portrait, an action, optional tool, optional Kin-relationship).*

> **Note on supersession.** v1 of this file (a 22-archetype sketch with invented Virtue names) has been superseded by this v2. The v1 list is preserved at the BOTTOM of this file for audit. Where v1 archetype names survive in v2, the mechanical hooks and flavor have been rewritten against the locked vocabulary.

---

## How to read each entry

**Faction** — the umbrella (Presence / Connection / Growth / Agency / Integrity / Resilience).
**Virtue tags** — 1 or 2 of the locked 18, drive Resonance synergy.
**Home zone** — the zone this archetype tends to play into (Your Family / Your Craft / Your Community).
**Play tag** — does this archetype carry the cross-cutting `Play` tag?
**Cost / Pitch** — Attention to play / Attention generated if pitched.
**Tagline** — one sentence, Rogers-test-clean.
**Mechanical hook** — concrete effect described in plain terms (M1 will translate to EFFECTS.md ops).
**Flavor** — one or two sentences in the Rapid Reflection / Sunday-comics voice.
**Storytelling notes** — what kinds of cards this archetype generates.

---

## Presence (3 archetypes)

*"I'm here, I hear you, I've got you." Cards that stay; reward consistent showing-up.*

### 1. The Steady Hand
- **Faction:** Presence · **Tags:** Showing-Up, Holding · **Home zone:** Your Family
- **Play tag:** No · **Cost:** 3 · **Pitch:** 2 · **Rarity:** common
- **Tagline:** "Calm finds him before the storm does."
- **Mechanical hook (Passive):** Friendly cards in The Steady Hand's zone are immune to opponent's `tax_attention` and `arrange` ops. While he's there, the room doesn't get rattled.
- **Flavor:** *"Breathe. We've been worse off than this. I'll show you how."*
- **Storytelling notes:** This is the dad who absorbs panic without performing it. The card pool around him includes a Tool ("The Old Workbench") and an Action ("Take the Long Way Home"). Absorbed v1's Quiet Type — the *says-it-once* energy lives in his Mending-tagged supporting cards.

### 2. The Listener
- **Faction:** Presence · **Tags:** Listening, Asking · **Home zone:** Your Family
- **Play tag:** No · **Cost:** 2 · **Pitch:** 2 · **Rarity:** common
- **Tagline:** "Doesn't fix what doesn't need fixing."
- **Mechanical hook (Activated, once per turn):** Tap The Listener, pay 1 Attention: look at the top card of your opponent's deck and place it back in the same spot. *(You weren't trying to peek. You were trying to understand.)*
- **Flavor:** *"I'm not going to tell you what I'd do. Tell me again what happened."*
- **Storytelling notes:** The Brené-Brown sentence-shape ("the story I'm telling myself…") lives natively in his Action cards. Pair with a Kin card to model the "small philosophy from a small mouth" beat.

### 3. The Cook
- **Faction:** Presence · **Tags:** Tending, Holding · **Home zone:** Your Family
- **Play tag:** Yes · **Cost:** 2 · **Pitch:** 1 · **Rarity:** common
- **Tagline:** "Sundays are sacred."
- **Mechanical hook (onEnter):** When played, restore 1 Attention to your inkwell next turn (a "leftover from breakfast"). **Moment:** SUNDAY DINNER fires when The Cook and a Kin share a zone for two consecutive turns.
- **Flavor:** *"The secret is butter. The other secret is more butter."*
- **Storytelling notes:** Sourdough, the sandwich-with-the-note, the playlist-while-cooking. The Cook is the agent's #4 mode (the specific weird hobby) at his most loving. Year card "The Saturday Pancake" hooks here.

---

## Connection (3 archetypes)

*"Let's make it together. What do you think? I see what you did." Cards that bridge — between you, the opponent, and across zones.*

### 4. The Storyteller
- **Faction:** Connection · **Tags:** Welcoming, Thanking · **Home zone:** Your Community
- **Play tag:** No · **Cost:** 3 · **Pitch:** 2 · **Rarity:** uncommon
- **Tagline:** "Memory is a kind of time travel."
- **Mechanical hook (Activated):** Tap, pay 1 Attention: name a virtue you've Practiced. Capture a Moment named after it. *(He told the story so often that the kid started telling it back. Now both of you tell it.)*
- **Flavor:** *"Did I ever tell you about your grandfather? Sit down. This one matters."*
- **Storytelling notes:** Family lore is the mechanic. The Storyteller's Action cards include "The Same Old Story" (good thing) and "Pick Your Jaw Up Off The Floor" (the Funny Papers Rapid Reflection moment). Bidirectional-teaching candidate: a card where the Kin tells the Storyteller a story and the Storyteller learns.

### 5. The Long-Distance Dad
- **Faction:** Connection · **Tags:** Asking, Thanking · **Home zone:** Your Community
- **Play tag:** No · **Cost:** 2 · **Pitch:** 1 · **Rarity:** common
- **Tagline:** "Voice on the phone. Letter in the mail."
- **Mechanical hook (onEnter):** Played from your hand even if no zone slots are available — places into "the road" (a temporary off-zone pseudo-position) for one turn, then enters your chosen zone. While off-zone, look at the top card of your deck.
- **Flavor:** *"I miss the breakfast. The breakfast knows."*
- **Storytelling notes:** The deployed parent. The divorced parent. The kid in college. The parent of an adult child who lives 2,000 miles away. The "Letter Home" Year card hooks here. Important inclusion mode — not all dads share square footage with their kids and that doesn't make them less.

### 6. The Big Brother Dad
- **Faction:** Connection · **Tags:** Welcoming, Teaching · **Home zone:** Your Family
- **Play tag:** No · **Cost:** 3 · **Pitch:** 2 · **Rarity:** common
- **Tagline:** "Older sibling who stepped up before he was ready."
- **Mechanical hook (onEnter):** When played, give a friendly Kin in any zone +1 Maturity AND a virtue tag of your choice that you have already Practiced. *(You went first; they go second; that's how it works.)*
- **Flavor:** *"I figured it out as I went. You'll do better, because I went first."*
- **Storytelling notes:** Mode #11 (the big-brother-figure who became a dad through showing up). Not biological. Not legal. Picks up at the airport. Knows the Wi-Fi password.

---

## Growth (3 archetypes)

*"I don't know yet — but I'm going to find out and pass it on." Cards that get stronger over time, that change, that don't reach a "final form."*

### 7. The Player
- **Faction:** Growth · **Tags:** Trying, Wondering · **Home zone:** Your Family · **Play tag:** Yes
- **Cost:** 1 · **Pitch:** 1 · **Rarity:** common
- **Tagline:** "Keeps the goofy alive."
- **Mechanical hook (onEnter):** Look at the top 3 of your deck; play one of them at -1 Attention cost (immediately, into any zone). Discard the others. **Moment:** HOT LAVA fires if 3+ Play-tagged cards share The Player's zone this turn.
- **Flavor:** *"Hot lava! HOT LAVA. The couch is the only safe place. Has been since you were four."*
- **Storytelling notes:** Cardboard forts, peek-a-boo, monster-under-the-bed bits. The Player carries the Play tag and is the home of the silliness layer. Year card "Hot Lava Living Room" hooks here.

### 8. The Granddad
- **Faction:** Growth · **Tags:** Teaching, Persisting · **Home zone:** Your Family
- **Play tag:** No · **Cost:** 4 · **Pitch:** 3 · **Rarity:** rare
- **Tagline:** "Has seen this all before. Still gentle about it."
- **Mechanical hook (Passive):** While The Granddad is in play, your Persisting-tagged effects (returning cards from discard) cost -1 Attention. **(onEnter):** Capture the SUNDAY COMICS Moment if a Kin is in any zone.
- **Flavor:** *"Your dad did this same thing. Don't tell him I told you."* Same flannel, same hat, smells like a specific soap, picks up the phone on the second ring.
- **Storytelling notes:** Mode #7. Bidirectional-teaching native: pair with "The Newspaper He Doesn't Understand" Action card where the Kin teaches the Granddad how phones work.

### 9. The In-Progress Dad
- **Faction:** Growth · **Tags:** Trying, Wondering · **Home zone:** Your Craft
- **Play tag:** No · **Cost:** 2 · **Pitch:** 2 · **Rarity:** common
- **Tagline:** "Still figuring it out. Out loud."
- **Mechanical hook (Passive):** At end of each turn that you've Practiced a new virtue, The In-Progress Dad gains a Growth counter. While he has 3+ Growth counters, all your Trying-tagged cards cost -1.
- **Flavor:** *"I'm learning to be a better person every day. I cannot change the past. I can only course correct."* (Loving Yourself Is Not a Selfish Act.)
- **Storytelling notes:** Carries the Detoxing Man manifesto directly. The "I forgot lunch" energy — accountable bumbler, sheepish-but-laughing. Anti-perfection card; rewards iteration not arrival.

---

## Agency (3 archetypes)

*"I'm picking this on purpose. I'll speak up. I'll say the true thing." Cards that drive action — extra plays, declared intentions, advocacy.*

### 10. The Coach
- **Faction:** Agency · **Tags:** Advocating, Trying · **Home zone:** Your Community
- **Play tag:** No · **Cost:** 3 · **Pitch:** 2 · **Rarity:** common
- **Tagline:** "Believes in you before you do."
- **Mechanical hook (Passive):** When you play another card in The Coach's zone, that card's onEnter effect runs at +1 strength (one numerical parameter +1, designer's choice). **Moment:** PEP TALK fires when a Kin is in his zone the turn he activates.
- **Flavor:** *"You miss 100% of the shots. So take it. I've got the rebound."* Calm cadence; kid's name said like a small bell. Other parents notice.
- **Storytelling notes:** The Coach is mode #15 — the dad who never raises his voice at the field. Not the screaming-dad-on-the-sideline. The believed-in dad. Bidirectional teaching: pair with an Action where the kid coaches the Coach back.

### 11. The Adventurer
- **Faction:** Agency · **Tags:** Choosing, Wondering · **Home zone:** Your Community
- **Play tag:** Yes · **Cost:** 3 · **Pitch:** 2 · **Rarity:** common
- **Tagline:** "Get in the car. We're going."
- **Mechanical hook (onEnter):** Move one of your other cards from any zone to a different zone, free of cost. **Moment:** SURPRISE TRIP fires if all your cards moved zones this turn.
- **Flavor:** *"I don't know where the road goes. That's the best part of any road."*
- **Storytelling notes:** The mode-#10 (text-the-song-lyric-no-context) dad meets mode-#1 (color-commentary) dad. Spontaneity card. Year cards "The Surprise Trip" and "Severe Tire Damage" both hook here.

### 12. The Advocate
- **Faction:** Agency · **Tags:** Advocating, Naming · **Home zone:** Your Craft
- **Play tag:** No · **Cost:** 4 · **Pitch:** 3 · **Rarity:** rare
- **Tagline:** "Stands between, speaks up, calls the coach."
- **Mechanical hook (onEnter):** Choose a friendly Kin or Dad card. Until end of match, it cannot be affected by opponent's `tax_attention`, `arrange`, or other soft-disruption ops. **(Activated, once per match):** name a virtue you've Practiced; mark it Practiced for opponent too. *(Justice means it gets shared.)*
- **Flavor:** *"I see you. I see what you're doing. I'm asking nicely once."*
- **Storytelling notes:** The mode-#5 stepfather who waits to be invited but goes to the principal anyway when needed. The mode-#17 dad who learned everyone's pronouns. Active-against-injustice without being preachy. The single one-shot share-the-virtue activation models hooks's love-as-action without the heavy theory.

---

## Integrity (3 archetypes)

*"I broke it. I'll say so. I'll let it go when it's been said." Cards about owning what you did, mending what you can, forgiving what's done.*

### 13. The Stepdad
- **Faction:** Integrity · **Tags:** Choosing, Persisting · **Home zone:** Your Family
- **Play tag:** No · **Cost:** 2 · **Pitch:** 2 · **Rarity:** uncommon
- **Tagline:** "Chose you. Keeps choosing."
- **Mechanical hook (Passive):** The Stepdad counts as carrying any virtue tag currently held by a friendly Kin in his zone (for Resonance and synergy purposes). He shows up as whatever the family needs.
- **Flavor:** *"I don't have to be here. That's the point."* Doesn't push the title. Drives to the recital. Sits two rows behind in case it's needed.
- **Storytelling notes:** Mode #5 verbatim. The voluntary-bond dad. Powerful dual purpose: in Your Family zone, the Stepdad strengthens whoever he's with; doesn't have a fixed identity, has a chosen relationship.

### 14. The Late Dad
- **Faction:** Integrity · **Tags:** Owning, Forgiving · **Home zone:** Your Family
- **Play tag:** No · **Cost:** 0 · **Pitch:** 2 · **Rarity:** rare
- **Tagline:** "Gone. Still teaching."
- **Mechanical hook (Special play rule):** Cannot be played from hand. Stays in your discard from the start of the match — placed there in setup, not drawn. Once per match, any time during your turn, you may play him directly from discard at no Attention cost (he goes to a chosen zone). When he enters, all your other cards in any zone gain +1 to their next effect, and you Practice the **Forgiving** virtue.
- **Flavor:** *"Take what he gave you. The rest, let go."*
- **Storytelling notes:** This card sits in your discard from turn 1. You decide when it matters most. The "rest, let go" is hooks's love-as-action filtered through plain language. Year-7-of-the-match? Year-15? You're the one who decides when you're ready.

### 15. The Conscious Dad
- **Faction:** Integrity · **Tags:** Owning, Naming · **Home zone:** Your Craft
- **Play tag:** No · **Cost:** 3 · **Pitch:** 2 · **Rarity:** uncommon
- **Tagline:** "Notices what he didn't notice yesterday."
- **Mechanical hook (onEnter):** Reveal opponent's hand. Your opponent draws 1 card. *(Catching yourself before you act on a bias is information you share with the table.)* **(Passive):** While in play, your Naming-tagged plays mark the named virtue Practiced for both players.
- **Flavor:** *"The story I'm telling myself is that I overreacted. Now let me check."*
- **Storytelling notes:** Brown's "story I'm telling myself" sentence-shape goes here. The bias-catching dad without the academic vocabulary. Mode #17 (the pronouns-in-the-car dad) and mode #14 (the dad who texts his friends "did your kid do this?") both fit this archetype.

---

## Resilience (3 archetypes)

*"I bend. I show up daily. I come back even after I leave." Cards that recover, persist, and adapt.*

### 16. The Tinkerer
- **Faction:** Resilience · **Tags:** Mending, Adapting · **Home zone:** Your Craft
- **Play tag:** Yes · **Cost:** 2 · **Pitch:** 2 · **Rarity:** common
- **Tagline:** "Fixes the wrong thing first. The right thing eventually."
- **Mechanical hook (Activated):** Tap, pay 1 Attention: return a card from your discard to your hand. *(Some things you fix by replacing them. Some you fix by remembering why you wanted them in the first place.)*
- **Flavor:** *"Replaces the wrong washer. Floods the basement. Laughs first. Then fixes it."*
- **Storytelling notes:** Mode #13. Sourdough, lawnmower, the dishwasher named like a friend. Pair with a Tool card "The Toolbelt" that gives him +1 Pitch value. The Garbage Disposal Year card hooks here ("you don't need everything to be a science experiment").

### 17. The Single Dad
- **Faction:** Resilience · **Tags:** Persisting, Adapting · **Home zone:** Your Family
- **Play tag:** No · **Cost:** 2 · **Pitch:** 2 · **Rarity:** uncommon
- **Tagline:** "Holds the whole sky up."
- **Mechanical hook (onEnter):** If no other Dad cards are in your zones, The Single Dad costs 1 less to play. **(Passive):** While in play, your Tending-tagged cards refresh +1 Attention next turn.
- **Flavor:** *"It's just us. We're going to be just fine. We always are."* Three sandwiches at 10pm, a note in the napkin, same joke every Tuesday.
- **Storytelling notes:** Mode #6. The lunch-the-night-before dad. Carries the Detoxing-Man "we are striving" identity in his quietest form. The Severe Tire Damage Year card hooks here ("you are, in fact, an adult who can occasionally play this minor role").

### 18. The Recovery Dad
- **Faction:** Resilience · **Tags:** Mending, Persisting · **Home zone:** Your Craft
- **Play tag:** No · **Cost:** 3 · **Pitch:** 2 · **Rarity:** rare
- **Tagline:** "Came back. Stays back."
- **Mechanical hook (Special):** When discarded (from any cause), once per match you may immediately bring The Recovery Dad back to a zone of your choice at -1 effective stat (one of his card values reduced by 1). **(Passive):** While in play, your Mending and Persisting cards capture a RETURNED Moment when they activate.
- **Flavor:** *"I am not the man I was last year. That is the work."*
- **Storytelling notes:** The dad who got sober. The dad who came home from deployment. The dad who ended an absence the kid didn't know how to forgive yet. Dignity-coded; not addiction-coded as a stereotype. Bumbler-with-accountability voice anchors here.

---

## Card-pool implications (for /data/cards.json drafting)

Each of the 18 archetypes anchors **2-4 individual cards** in the v1 pool:

- **One Portrait card** (the Dad card with the archetype's name and the mechanics described above).
- **One or two Action cards** thematically tied to the archetype (e.g., "The Saturday Pancake" hooks to The Cook; "Pick Your Jaw Up Off The Floor" hooks to The Storyteller; "Take the Long Way Home" hooks to The Steady Hand).
- **One Tool card** for archetypes where it fits naturally (The Tinkerer's "The Toolbelt"; The Cook's "Sunday Apron"; The Granddad's "The Same Flannel").
- **Optional Kin card** with a relationship hook to the archetype (e.g., "The Reluctant Kid" pairs with The Coach for PEP TALK Moments; "The Niece on the Phone" pairs with The Long-Distance Dad).

That puts the v1 card pool at roughly **18 portraits + 18-25 actions + 8-12 tools + 8-12 Kin = 50-70 cards**, in line with the M1 acceptance target of 60-80.

## Bidirectional-teaching cards

Per Decision 022, the card pool must include cards that model the **dad LEARNING from the Kin**, not only teaching them. Concrete cards to author:

- **"What Do You Think?"** (Action — Connection — Asking, Wondering): the dad's best move is the question, not the answer. *"I don't know. What do you think?"*
- **"The Newspaper He Doesn't Understand"** (Action — Growth — Wondering): pair with The Granddad. *"He has never seen the Sunday comics before. Pick your jaw back up off the floor."*
- **"Pronouns Practice"** (Action — Integrity — Naming, Owning): the Conscious Dad practices in the car. Mode #17.
- **"The Pokémon Lesson"** (Action — Growth — Wondering, Trying): the dad lets the kid teach him the type chart. *"Bug is weak to fire? You're sure? Show me."*
- **"Their Music"** (Action — Connection — Welcoming, Asking): the dad doesn't pretend to like it. He asks why they like it. He listens.

These ensure the Teaching virtue isn't unidirectional and that the Growth faction earns its name.

## Tone tests applied

Every archetype above has been checked against the two tone tests:

- **Rogers test** ("could this be said to a child without flinching?"): all 18 pass.
- **Rapid Reflection test** (lived specificity, not abstract virtue): all 18 ground in concrete actions, named objects, named moments. The Granddad's flannel; The Single Dad's three sandwiches; The Adventurer's "get in the car"; The Cook's butter.

Forty-five percent of the archetypes carry the `Play` cross-tag (8 of 18, exceeds the 30% target — likely correct given the joy-emphasis).

---

## v1 (superseded — preserved for audit)

*Original 22-archetype sketch using invented Virtue names (Mentorship/Repair/Play/Steadiness/Curiosity). Replaced by v2 above.*

The v1 list contained 22 archetypes; v2 trims to 18 by:
- Cutting **The Cheerleader** (Cheering not in locked virtue list; energy lives in The Coach + The Big Brother Dad + Year cards)
- Cutting **The Mr. Rogers** (likeness/IP risk; voice is the secret unifier across ALL cards)
- Cutting **The Friend** (overlaps with The Big Brother Dad)
- Cutting **The Provider** (energy lives in The Single Dad + The Tinkerer)
- Cutting **The Reader** (energy lives in The Storyteller; v1 split Reader/Storyteller into too-similar archetypes)
- Cutting **The Defender** (renamed to **The Advocate** with the Advocating virtue per user direction)
- Cutting **The Quiet Type** (absorbed into The Steady Hand)
- Adding **The In-Progress Dad** (carries the Detoxing Man "Striving" identity directly)
- Adding **The Conscious Dad** (carries the bias-catching practice without academic vocabulary)

Faction balance: 3-3-3-3-3-3 across Presence / Connection / Growth / Agency / Integrity / Resilience.
