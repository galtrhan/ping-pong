# Top-Down Ping Pong

A modern take on the classic ping pong game, built with Phaser 3. This top-down arcade experience features updated gameplay mechanics, refined constants, and a robust scene management system.

## Features

- Top-down 2D gameplay with refined mechanics
- Dynamic ball angles based on paddle hit location
- Progressive difficulty with continuous ball speed increment
- Updated winning score and speed limits for balanced gameplay
- High score system saving the top 10 scores with player names
- Clean, modern UI with multiple scenes including menus and options
- Co-op mode for two players with dedicated controls

## How to Play

1. Use the **Up** and **Down** arrow keys to move Player 1's paddle.
2. In co-op mode, Player 2 uses the **W** and **S** keys to move their paddle.
3. Deflect the ball with your paddle to keep it in play.
4. Exploit ball angle dynamics:
   - Center hits result in primarily horizontal returns.
   - Edge hits produce steeper angles.
5. The ball accelerates over time. Stay alert as the game pace increases.
6. The game ends when a player reaches 5 points.

## Game Mechanics

### Ball Speed & Scoring

- **Initial Ball Speed:** 300 units per second (movement is measured in game units, not strictly pixels)
- **Speed Increase:** 5 units per second added continuously as the game progresses
- **Maximum Ball Speed:** 800 units per second

The speed values refer to movement units per second within the game engine, ensuring consistent behavior across different resolutions.

### Winning Score

- **Win Condition:** First player to reach **5 points** wins the match.
- Points are scored when the opponent misses the ball.

### Paddle Dynamics

- **Player 1 Paddle Speed:** 5 units per frame
- **Player 2 Paddle Speed (Co-op):** 5 units per frame
- **AI Paddle Speed:** 4 units per frame (when playing against the computer)

### Ball Angle Mechanics

The angle at which the ball deflects off the paddle is determined by the hit position:

| Hit Area    | Angle Change       | Description                      |
|-------------|--------------------|----------------------------------|
| 0-20%       | Steep upward       | Sharp change upward              |
| 20-40%      | Moderate upward    | Subtle upward adjustment         |
| 40-60%      | Horizontal         | Minimal deviation                |
| 60-80%      | Moderate downward  | Subtle downward adjustment       |
| 80-100%     | Steep downward     | Sharp change downward            |

- Center hits (40-60%) typically keep trajectories more predictable.
- Hits closer to the edges produce more dramatic directional changes.
- After striking a paddle, the ball always moves towards the opponent's side.

## Scene Structure

The game is organized into multiple scenes to streamline gameplay and enhance user experience:

- **BootScene:** Initializes game settings and assets.
- **LoadingScene:** Preloads assets and displays a loading screen.
- **StartMenu:** Main menu offering play, high scores, options, and co-op mode.
- **GameScene:** Core gameplay mechanics, ball-paddle interactions, and co-op mode.
- **OptionsScene:** Allows players to adjust game settings.
- **PlayerSelectScene:** Facilitates player selection/input before gameplay.
- **HighScores:** Displays the top 10 scores.

## Setup & Development

1. **Installation:**
   ```bash
   npm install
   ```

2. **Starting the Game:**
   ```bash
   npm start
   ```

3. **Access the Game:**
   Open your browser to the address provided by the console (typically http://localhost:8080).

## Controls

### Single-Player Mode (vs AI)
- **Player 1:** 
  - **↑** - Move paddle up
  - **↓** - Move paddle down

### Co-op Mode (Two Players)
- **Player 1:** 
  - **↑** - Move paddle up
  - **↓** - Move paddle down
- **Player 2:**
  - **W** - Move paddle up
  - **S** - Move paddle down

Additionally:
- **Enter** - Confirm input (e.g., name entry)
- **Click** - Menu navigation

## Technical Details

- **Framework:** Phaser 3
- **Rendering:** HTML5 Canvas
- **Asset Management:** All game assets are preloaded in the respective scenes.
- **Local Storage:** High scores are stored in the browser's localStorage.
- **Audio:** Managed via a dedicated Audio Manager handling sound effects like hover and click.

## Development

The source is organized into distinct modules and scenes:
- Core game constants and configuration are defined in `game.js`.
- Scenes are located under the `/scenes` directory and include BootScene, LoadingScene, StartMenu, GameScene, OptionsScene, PlayerSelectScene, and HighScores.
- An Audio Manager (`AudioManager.js`) handles sound effects for UI interactions.

## License

MIT License