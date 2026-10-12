# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.2] - 2026-10-12

### Changed

- Canvas size increased from 800x600 to 960x720, keeping the 4:3 aspect ratio. The logical space, minimum size, and game container minimum all follow the new dimensions.

## [0.3.1] - 2026-10-12

### Changed

- The canvas now scales to fill the available window while keeping the 800x600 aspect ratio, holding the current 800x600 size as a hard minimum. Scenes still render in the fixed 800x600 logical space; the browser window is the only thing that changes.
- The page background is black so the letterbox area blends in, and the border moved from the canvas to the outer game container at the viewport edge.

## [0.3.0] - 2026-10-12

### Added

- Charge-shot mechanic: each paddle fills a six-segment charge meter drawn on the paddle, glowing when full.
- Center hits add 1/6 charge, edge hits add 2/6; arming with the action key fires the next hit at double ball speed and resets the charge.
- Deflecting a charged ball auto-fills and spends the deflecting paddle's charge, chaining charged returns.
- Scoring a point grants the scorer 3/6 charge.
- Player 1 arms with **Space**, co-op Player 2 arms with **L**; the AI builds and fires charge shots on its own.
- Charged shots tint the ball and leave a particle trail until the next hit or point.
- `CHARGE_MAX`, `CHARGE_CENTER`, `CHARGE_SIDE`, `CHARGE_SCORE`, and `BOOST_FACTOR` constants in `game.js`.

## [0.2.0] - 2026-10-12

Codebase simplification pass: less duplication, dead code removed, behavior unchanged.

### Added

- `scenes/BaseScene.js` with shared `fadeIn` and `goTo` helpers; every scene now extends it.
- `CHANGELOG.md` and a `## Versioning` section in the README.

### Changed

- Standardized the project version in `package.json` and `package-lock.json` (previously `1.0.0`, inconsistent with the git tags).
- Collapsed `AudioManager` to a sounds map with a single `play(key)` entry point.
- Rewrote `GameScene.gameOver` (single sort plus rank lookup) and simplified the hit-angle, scoring, and countdown logic.
- Simplified `HighScores` rendering into column-driven loops.
- Updated README controls to match the code (A/Z and K/M in co-op).

### Removed

- Write-only `registry` state and the unused `FONT` export in `game.js`.
- No-op scene groups and empty `shutdown` handlers.

## [0.1.0] - 2026-02-02

First tracked release. Covers all development after the initial commit.

### Added

- Gameplay: top-down ping pong with dynamic deflection angles based on paddle hit position.
- Progressive difficulty: ball speed starts at 300 units/s, grows 5 units/s, capped at 800.
- Co-op mode for two players plus single-player mode against a simple tracking AI.
- Match win at 5 points; per-match timer and live speed percentage readout.
- Scene flow: `BootScene`, `LoadingScene`, `StartMenu`, `PlayerSelectScene`, `GameScene`, `OptionsScene`, `HighScores`.
- Pause screen (ESC) with resume and main-menu actions.
- Options screen with music/SFX volume sliders and mute toggles, persisted per session.
- High-score system: top 10 with player names and dates, stored in `localStorage`.
- Dedicated `AudioManager` for background music and click/hover/hit/score effects.
- Custom `kenney-mini` web font loaded through WebFont.
- Scene transitions with camera fades.
- `deploy.sh` packaging and a Phaser-flattened layout for itch.io uploads.
- CI/CD: build/release workflow and itch.io publish workflow; committed `package-lock.json`.

### Changed

- Co-op controls: Player 1 uses A/Z, Player 2 uses K/M; single-player uses arrow keys.
- Refactored scattered audio handling into the audio manager.
- Flattened Phaser into the deploy root for itch.io compatibility.

### Fixed

- Options screen control placement.
- Name-input styling and keyboard event handling.
- GitHub Actions permissions and release creation; invalid secrets reference.
- itch.io version auto-detection from the latest git tag.

### Removed

- Deprecated Cursor game development guidelines.
- Obsolete project files.

[0.3.1]: https://github.com/galtrhan/ping-pong/releases/tag/v0.3.1
[0.3.0]: https://github.com/galtrhan/ping-pong/releases/tag/v0.3.0
[0.2.0]: https://github.com/galtrhan/ping-pong/releases/tag/v0.2.0
[0.1.0]: https://github.com/galtrhan/ping-pong/releases/tag/v0.1.0
