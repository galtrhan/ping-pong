// Import scenes
import BootScene from './scenes/BootScene.js';
import LoadingScene from './scenes/LoadingScene.js';
import StartMenu from './scenes/StartMenu.js';
import GameScene from './scenes/GameScene.js';
import HighScores from './scenes/HighScores.js';
import OptionsScene from './scenes/OptionsScene.js';

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, LoadingScene, StartMenu, GameScene, HighScores, OptionsScene]
};

// Game constants
const BALL_SPEED = 300;
const SPEED_INCREASE = 5;
const WINNING_SCORE = 5;
const MAX_SPEED = 800;

// Global variables for audio management
let menuMusic = null;
let musicVolume = 0.5;
let sfxVolume = 0.5;
let musicMuted = false;
let sfxMuted = false;

// Initialize the game
const game = new Phaser.Game(config);

// Function to set music instance
function setMenuMusic(music) {
    if (menuMusic) {
        menuMusic.stop();
        menuMusic.destroy();
    }
    menuMusic = music;
}

// Export variables and functions for use in scene files
export { menuMusic, musicVolume, sfxVolume, musicMuted, sfxMuted, config, BALL_SPEED, SPEED_INCREASE, WINNING_SCORE, MAX_SPEED, setMenuMusic }; 