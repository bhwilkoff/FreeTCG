# SwiftUI / SwiftData Architecture for Dad TCG (iOS)

The iOS client mirrors the web architecture: a single store, intent-based mutations, JSON-driven cards. The two platforms share the card catalog verbatim. This file covers the iOS-specific patterns and Game Center for online play.

## Store: @Observable + intent dispatch

```swift
@Observable
final class GameStore {
    private(set) var state: GameState

    func dispatch(_ intent: Intent) {
        state = engine.applyIntent(state, intent)
        // notify subscribers via @Observable
    }
}
```

`GameState` is a plain Swift `struct` (value type) so `applyIntent` can be a pure function. SwiftUI views observe the store via `@Environment(GameStore.self)`.

This mirrors the web reducer 1:1. Both platforms ship the same intent vocabulary. The engine is ~the same code in two languages.

## SwiftData

Use SwiftData for:
- The card catalog (read on first launch from bundled `cards.json`, stored as SwiftData models for query convenience). Re-import on app update if the bundled JSON's version is newer.
- Saved in-progress matches (one model per saved game; serialize the `GameState` to a JSON Data field).
- Player profile (deck collection, win/loss record, settings).

Don't use SwiftData for in-flight game state during an active match — that lives in the `@Observable` store as a struct. Persist to SwiftData at end of turn or when the user backgrounds the app.

## Card animations

The two key APIs:

### `matchedGeometryEffect`

For card-from-hand-to-board moves: tag the source card and destination card with the same `id` and `namespace`. SwiftUI animates the transform automatically.

```swift
@Namespace private var cardNamespace

CardView(card)
    .matchedGeometryEffect(id: card.instanceId, in: cardNamespace)
```

This is the magic that makes "play card" feel right.

### `transition` modifiers

For cards entering/leaving zones (draw, destroy, summon), use `.transition(.asymmetric(...))` with custom transitions. Pair with `withAnimation { store.dispatch(...) }` to drive them.

### Per CLAUDE.md gotcha

> "VideoPlayer animation crash: wrap VideoThumbnailView with `.transaction { $0.animation = nil }`"

Probably not relevant for Dad TCG (no video) but the *pattern* is: SwiftUI sometimes propagates animations into views that misbehave. If a UIKit-bridged view crashes during animation, kill the transaction.

Also from CLAUDE.md: image grids need both width and height before `.clipped()`. Card art images on the catalog screen will hit this; constrain dimensions explicitly.

## Drag-to-play gestures

`DragGesture` with `onChanged` and `onEnded`:

```swift
@State private var dragOffset: CGSize = .zero

CardView(card)
    .offset(dragOffset)
    .gesture(
        DragGesture()
            .onChanged { dragOffset = $0.translation }
            .onEnded { value in
                if let target = hitTest(value.location) {
                    store.dispatch(.playCard(card.id, target: target))
                }
                withAnimation { dragOffset = .zero }
            }
    )
```

The hit-test is the tricky part — you need a coordinate space shared between the hand and the board. Use `GeometryReader` + `coordinateSpace(name:)` to register a named coordinate space, then convert the gesture's `location` into it.

For multi-target spells (e.g., "deal 3 damage, then 2 to another target"), use a sequence of taps after the initial drag rather than chained drags. Drag-then-drag is finicky.

## Game Center turn-based multiplayer

For online play with zero backend, GameKit's `GKTurnBasedMatch` is the only option. From training-data recall:

### API surface (recall, may be slightly off)

- `GKLocalPlayer.local.authenticateHandler` — authenticate the player on app launch.
- `GKMatchRequest` — describe the match (player count, etc.).
- `GKTurnBasedMatchmakerViewController` — present the matchmaker UI; users find/invite opponents.
- `GKTurnBasedMatch` — the match instance; persists across app launches and devices.
- `match.matchData: Data` — the per-match payload, **limited to ~64KB last I knew**. This is the per-turn state limit.
- `match.endTurn(withNextParticipants:turnTimeout:matchData:completionHandler:)` — submit your turn and pass to the next player.
- `match.endMatchInTurn(withMatch:matchData:completionHandler:)` — end the match (one side wins / draw / quit).
- `GKTurnBasedEventListener` (delegate) — receives `player:receivedTurnEventForMatch:didBecomeActive:` etc. for incoming-turn notifications.

### 64KB constraint

A full Dad TCG state — two players' decks, hands, boards, graveyards, log — at 80 cards across the pool with maybe 60-card decks, modeled in JSON, can comfortably fit in 64KB if encoded efficiently. But it's tight. Strategies:

- **Send a delta-encoded turn log, not full state.** Each turn appends the intents that were dispatched; the recipient replays them. The full game log over a 30-turn match is *much* smaller than the materialized state if encoded as opcodes.
- **Use card IDs, not full card objects.** Both clients have the catalog locally; just reference `"fireball"`.
- **Compress** with `NSData.compressed(using: .zlib)` if needed.
- **Deck contents** are the largest single chunk. Don't re-send them every turn — establish them in the match's first turn and reference by hash thereafter.

### Match lifecycle

1. **Authenticate** — `GKLocalPlayer.local.authenticateHandler` runs on launch.
2. **Find or invite** — `GKTurnBasedMatchmakerViewController` handles UI.
3. **First turn** — initial player loads the matchmaker, takes their turn, calls `endTurn`.
4. **Notification** — opponent receives `didBecomeActive` on their `GKTurnBasedEventListener` (or a push if app is backgrounded; Game Center handles the push for you).
5. **Take turn** — opponent loads `match.matchData`, hydrates state, plays, calls `endTurn`.
6. **End** — winning player calls `endMatchInTurn` with final state and outcomes.
7. **Disconnect / resume** — matches persist on Game Center servers; players can resume from any device for up to N days (recall ~60 days but verify).

### Anti-cheat

GameKit is **client-authoritative**. There is no server-side validation; whatever state a client submits via `endTurn` is the new truth. This means:

- A determined cheater can edit their `matchData` before submission.
- The opposing client can detect cheating only if it re-validates the entire turn against its own engine and rejects invalid transitions.

For Dad TCG, **build a turn-validator**: when a turn is received, the recipient replays the intent log against its local engine and verifies the resulting state matches the submitted state. Reject if mismatched (concede, or report). This catches casual cheaters but not sophisticated ones who replay the entire game in a modified engine.

True anti-cheat requires a server (out of scope for v1). Document this honestly: "Game Center matches are casual play; ranked play would require a server."

## Sample apps / tutorials

There is no canonical, well-maintained SwiftUI + GameKit turn-based-multiplayer sample app from Apple as of Jan 2026 cutoff that I can recommend confidently. Apple's WWDC sessions on GameKit are the most reliable source, but they tend to use UIKit examples. Hacking with Swift and Kodeco (formerly Ray Wenderlich) have historically had GameKit articles; quality varies.

## Performance

Per CLAUDE.md, profile with Instruments before shipping. TCG-specific concerns:
- Many simultaneous card animations during a complex turn — frame rate dips here are noticeable.
- `matchedGeometryEffect` with many cards can be expensive; profile and consider falling back to manual transitions for the busiest moments.
- Avoid `@Query`-driven feeds during active play (per CLAUDE.md: "Seen posts: use in-memory `@State` `Set<String>` cache instead of `@Query` to avoid ForEach cascade re-renders") — same pattern applies to the active-game state. Persist between turns; don't drive each frame from SwiftData.

## Layout sketch

```
/DadTCG/
  /App/                    — entry point, GameKit auth
  /Models/                 — GameState, Card, Intent (Codable)
  /Game/                   — applyIntent (pure), validators
  /AI/                     — action scorer, lookahead
  /Views/Game/             — board, hand, cards
  /Views/Matchmaker/       — Game Center matchmaker UI
  /Store/                  — @Observable GameStore
  /Networking/             — GKTurnBasedMatch wrapper
  /Resources/cards.json    — same file as web
```
