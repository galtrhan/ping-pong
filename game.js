import BootScene from './scenes/BootScene.js';
import LoadingScene from './scenes/LoadingScene.js';
import StartMenu from './scenes/StartMenu.js';
import GameScene from './scenes/GameScene.js';
import HighScores from './scenes/HighScores.js';
import OptionsScene from './scenes/OptionsScene.js';

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

const BALL_SPEED = 300;
const SPEED_INCREASE = 5;
const WINNING_SCORE = 5;
const MAX_SPEED = 800;

const FONT = 'kenney-mini';

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
            scene.hoverSound?.play();
        });

        button.on('pointerout', () => {
            button.setStyle({ backgroundColor: '#444' });
        });

        if (onClick) {
            button.on('pointerdown', () => {
                scene.clickSound?.play();
                onClick();
            });
        }

        return button;
    }
}; 

let menuMusic = null;
let musicVolume = 0.5;
let sfxVolume = 0.5;
let musicMuted = false;
let sfxMuted = false;

const game = new Phaser.Game(config);

function setMenuMusic(music) {
    if (menuMusic) {
        menuMusic.stop();
        menuMusic.destroy();
    }
    menuMusic = music;
}

export {
    menuMusic,
    musicVolume,
    sfxVolume,
    musicMuted,
    sfxMuted,
    config,
    _,
    BALL_SPEED,
    SPEED_INCREASE,
    WINNING_SCORE,
    MAX_SPEED,
    FONT,
    setMenuMusic
}; 