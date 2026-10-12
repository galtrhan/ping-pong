import BootScene from './scenes/BootScene.js';
import LoadingScene from './scenes/LoadingScene.js';
import StartMenu from './scenes/StartMenu.js';
import GameScene from './scenes/GameScene.js';
import HighScores from './scenes/HighScores.js';
import OptionsScene from './scenes/OptionsScene.js';
import PlayerSelectScene from './scenes/PlayerSelectScene.js';
import AudioManager from './AudioManager.js';

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
    scene: [BootScene, LoadingScene, StartMenu, GameScene, HighScores, OptionsScene, PlayerSelectScene]
};

/** Game configuration constants */
const BALL_SPEED = 300;        // Initial ball speed in pixels/second
const SPEED_INCREASE = 5;      // Speed increase per second
const WINNING_SCORE = 5;       // Points needed to win
const MAX_SPEED = 800;         // Maximum ball speed
const PADDLE_SPEED = 5;        // Player paddle movement speed
const AI_SPEED = 4;            // AI paddle movement speed (slightly slower for balance)
const CHARGE_MAX = 6;          // Charge segments needed to fill a paddle
const CHARGE_CENTER = 1;       // Charge gained when the ball hits the paddle center
const CHARGE_SIDE = 2;         // Charge gained when the ball hits a paddle edge
const CHARGE_SCORE = 3;        // Charge gained by the scorer of a point
const BOOST_FACTOR = 2;        // Ball speed multiplier for a charged hit

const _ = {
    styles: {
        text: {
            color: '#fff',
            fontSize: '32px',
            fontFamily: 'kenney-mini',
        },
    },
    createButton: (scene, x, y, text, onClick = null, style = {}) => {
        const button = scene.add.text(x, y, text, {
            ..._.styles.text,
            backgroundColor: '#444',
            padding: { x: 20, top: 5, bottom: 15 },
            ...style
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        button.on('pointerover', () => {
            button.setStyle({ backgroundColor: '#666' });
            scene.audio?.play('hover');
        });

        button.on('pointerout', () => {
            button.setStyle({ backgroundColor: '#444' });
        });

        if (onClick) {
            button.on('pointerdown', () => {
                scene.audio?.play('click');
                onClick();
            });
        }

        return button;
    }
};

new Phaser.Game(config);

export {
    config,
    _,
    BALL_SPEED,
    SPEED_INCREASE,
    WINNING_SCORE,
    MAX_SPEED,
    PADDLE_SPEED,
    AI_SPEED,
    CHARGE_MAX,
    CHARGE_CENTER,
    CHARGE_SIDE,
    CHARGE_SCORE,
    BOOST_FACTOR,
    AudioManager
}; 
