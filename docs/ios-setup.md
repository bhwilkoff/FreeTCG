# Dad TCG — iOS Project Setup

This document walks through creating the Xcode project for Dad TCG. **The
Xcode project must be created via the Xcode UI** — the `.xcodeproj` bundle
cannot be reliably generated from the command line.

Once created, the structure must follow the conventions in `CLAUDE.md`
(specifically: `.xcodeproj` at the repo root, no spaces in the project name,
shared `AppVersion.xcconfig`).

## Prerequisites

- macOS 14+ with Xcode 15+ installed
- Apple Developer account (free works for local builds; paid for App Store)
- Repository cloned locally to `/Users/user/Documents/GitHub/FreeTCG/`

## 1. Create the Xcode project

1. Open Xcode → **File → New → Project**
2. Choose **iOS → App** → Next
3. Fill in:
   - **Product Name**: `DadTCG` *(no spaces — critical for Xcode Cloud)*
   - **Team**: your Apple ID team
   - **Organization Identifier**: `com.yourdomain` (or similar reverse-DNS)
   - **Bundle Identifier**: `com.yourdomain.DadTCG`
   - **Interface**: SwiftUI
   - **Language**: Swift
   - **Storage**: SwiftData
   - **Include Tests**: Yes
4. Click **Next**
5. Save location: **the repository root** at `/Users/user/Documents/GitHub/FreeTCG/`
   - **CRITICAL**: When the file picker opens, navigate to the repo root and click
     "Create" *without* creating a subfolder. Xcode will place
     `DadTCG.xcodeproj` and `DadTCG/` directly inside `/FreeTCG/`.
6. **Uncheck "Create Git repository on my Mac"** — the repo already has git.

After this step, your repo should look like:

```
/Users/user/Documents/GitHub/FreeTCG/
├── DadTCG.xcodeproj/         ← new
├── DadTCG/                   ← new
│   ├── DadTCGApp.swift
│   ├── ContentView.swift
│   ├── Item.swift            ← SwiftData example, can delete later
│   └── Assets.xcassets/
├── DadTCGTests/              ← new
├── DadTCGUITests/            ← new
├── AppVersion.xcconfig       ← already there
├── ci_scripts/               ← already there
├── ios/                      ← old template starter; see step 4
├── CLAUDE.md, SCRATCHPAD.md, DECISIONS.md, README.md
├── index.html, css/, js/, data/, research/, docs/
└── .git/
```

## 2. Wire up `AppVersion.xcconfig`

The repo ships with `AppVersion.xcconfig` at root. Without this step, version
numbers will drift between targets.

1. In Xcode, select the **DadTCG project** (top item in Project Navigator)
2. Select the **DadTCG project** entry (not the target)
3. Go to **Info → Configurations**
4. For both **Debug** and **Release**, click the dropdown next to the project row
5. Select **AppVersion** (Xcode auto-discovers `AppVersion.xcconfig` at the repo root)
6. Repeat for the test targets if you want their versions synced

Verify: open the target's General tab. **Version** should show `1.0` and
**Build** should show `1`. If they're empty, the xcconfig isn't wired correctly.

**Never edit Version or Build via the Xcode UI Identity panel.** Doing so
creates per-target overrides in `project.pbxproj` that shadow the xcconfig
and cause silent drift. To bump versions: edit `AppVersion.xcconfig` at the
repo root.

## 3. Set the deployment target

1. Select the **DadTCG target** (not the project)
2. **General → Minimum Deployments** → set **iOS** to **17.0**

(Per `CLAUDE.md`, the iOS app uses iOS 17+ APIs: `@Observable`, SwiftData,
the modern SwiftUI navigation stack.)

## 4. Move starter source files (if any) and delete `ios/` template stub

The repo template includes an `ios/` directory with starter Swift files. Once
the Xcode project exists:

1. In Finder, copy any useful starter files from `ios/` into the new
   `DadTCG/` subfolder (organized into `App/`, `Models/`, `Views/`, etc. per
   `CLAUDE.md`).
2. In Xcode, drag those files into the project navigator under the
   appropriate group.
3. Delete the `ios/` directory once nothing references it.

For Dad TCG, the recommended folder layout inside `DadTCG/`:

```
DadTCG/
├── App/                      ← DadTCGApp.swift, app delegate
├── Game/                     ← Pure-Swift game engine (no UI imports)
├── Models/                   ← Card, Archetype, GameState
├── Views/                    ← SwiftUI views (one subfolder per feature)
├── Components/               ← Reusable components (CardView, etc.)
├── Networking/               ← GameKit wrapper (turn-based match plumbing)
├── Store/                    ← @Observable global state
├── Resources/Cards/          ← Bundled card data JSON (snapshot of /data/)
└── Assets.xcassets/
```

## 5. Bundle the shared card data

Dad TCG keeps canonical card data in `/data/` at the repo root. iOS needs a
snapshot bundled into the app at build time.

Two options:

**Option A — Symlink (simpler, may surprise reviewers):**
```bash
cd /Users/user/Documents/GitHub/FreeTCG/DadTCG/Resources
ln -s ../../data/archetypes.json archetypes.json
ln -s ../../data/cards.json cards.json
```
Add the symlinks to the Xcode target.

**Option B — Build phase script (recommended):**
Add a Run Script phase to the DadTCG target that copies `/data/*.json` into
the build's Resources directory. Update `ci_scripts/ci_post_clone.sh` to do
the same for Xcode Cloud.

Either way, the iOS engine should fail loud if these files are missing.

## 6. Configure Game Center capability (deferred to M6)

When implementing M6 (Game Center peer-to-peer):

1. Target → **Signing & Capabilities** → **+ Capability** → **Game Center**
2. App Store Connect → My Apps → DadTCG → **Game Center** → enable
3. Define one **leaderboard** (optional) and the **multiplayer match** support
4. Reference: GameKit / `GKTurnBasedMatch` API. See
   `/research/claude-skills/ios-tcg-architecture.md` for implementation notes.

## 7. Verify Xcode Cloud (optional)

If using Xcode Cloud:

1. Xcode → **Integrate → Create Workflow**
2. Confirm Xcode finds `DadTCG.xcodeproj` at the repo root (it should — that's
   why it's there).
3. The `ci_scripts/ci_post_clone.sh` script runs after Xcode Cloud clones the
   repo. Use it to install dependencies if any are added later (none in v1).

## 8. First build sanity check

Before committing:

1. Select the iPhone 15 Pro simulator
2. Cmd+R to build and run
3. The default SwiftUI view should appear

If you see "Project does not exist at the root of the repository" from Xcode
Cloud, your `.xcodeproj` is in a subdirectory — move it back to the root.

## 9. Commit

```bash
git status
git add DadTCG.xcodeproj DadTCG DadTCGTests DadTCGUITests
git commit -m "iOS: scaffold Xcode project at repo root"
```

(Don't add Xcode user data — `.gitignore` should already exclude it.)

## Troubleshooting

- **"Project does not exist at root" (Xcode Cloud)**: Your `.xcodeproj` is
  nested. Move it to the repo root.
- **Version numbers drift between Debug and Release**: You edited Version/Build
  in the Identity panel. Open `project.pbxproj`, search for
  `MARKETING_VERSION = ` and `CURRENT_PROJECT_VERSION = ` lines that aren't
  `$(MARKETING_VERSION)` / `$(CURRENT_PROJECT_VERSION)`, and remove them.
- **Card data fails to load at runtime**: Confirm Resources/*.json is in the
  target's "Copy Bundle Resources" phase. Symlinks sometimes drop out of the
  build phase silently.
