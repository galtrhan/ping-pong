# Top-Down Ping Pong

A modern take on the classic ping pong game, built with Phaser 3. This version features a top-down perspective, dynamic ball angles, and increasing difficulty.

## Features

- Top-down 2D gameplay
- Dynamic ball angles based on paddle hit position
- Progressive difficulty with increasing ball speed
- High score system with player names
- Modern UI with start menu and high scores screen

## How to Play

1. Use the **Up** and **Down** arrow keys to move your paddle
2. Hit the ball with your paddle to score points
3. The ball's angle changes based on where it hits your paddle:
   - Center hits result in more horizontal movement
   - Edge hits create steeper angles
4. The ball speed increases over time, making the game progressively more challenging
5. First player to reach 20 points wins

## Game Mechanics

### Ball Speed
- Base speed: 600 units
- Speed increase: +15 units per second
- Speed is displayed as percentage increase from base speed
- Speed increases continuously during gameplay

### Scoring System
- First to reach 20 points wins
- Points are awarded when the opponent misses the ball
- Game ends immediately when a player reaches 20 points

### High Score System
- Top 10 scores are saved with player names
- Scores are ranked by:
  1. Player points (higher is better)
  2. Game time (lower is better)
- Names are saved between sessions
- Only top 10 scores are stored

### Ball Angle Mechanics
The ball's angle is calculated based on where it hits the paddle:

| Hit Position | Angle | Description |
|--------------|-------|-------------|
| 0-20% | -60° | Steep upward angle |
| 20-40% | -30° | Moderate upward angle |
| 40-60% | 0° | Mostly horizontal |
| 60-80% | 30° | Moderate downward angle |
| 80-100% | 60° | Steep downward angle |

- Center hits (40-60% of paddle) result in more predictable, horizontal returns
- Edge hits create more dramatic angles for strategic play
- The ball always moves towards the opponent's side after hitting a paddle
- Ball speed is maintained during angle changes

### AI Behavior
- AI paddle follows the ball's vertical position
- Movement speed is constant (4 units per frame)
- AI cannot miss the ball (perfect tracking)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the game:
   ```bash
   npm start
   ```

3. Open your browser to the address shown (usually http://localhost:8080)

## Controls

- **↑** Move paddle up
- **↓** Move paddle down
- **Enter** Confirm name input
- **Click** Menu navigation

## Technical Details

- Built with Phaser 3
- Uses HTML5 Canvas
- Saves high scores in localStorage
- Responsive design

## Development

The game is structured into three main scenes:
- `StartMenu`: Main menu with play and high scores options
- `GameScene`: The main game
- `HighScores`: Displays the top 10 scores

## License

MIT License 