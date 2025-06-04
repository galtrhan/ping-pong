import {
    config,
    _,
    AudioManager
} from '../game.js';

export default class StartMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'StartMenu' });
    }

    create() {
        // Initialize audio manager
        this.audio = new AudioManager(this);
        this.audio.ensureMusicPlaying();

        this.add.text(config.width / 2, config.height / 4, 'PING PONG', {
            ... _.styles.text,
            fontSize: '64px',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        _.createButton(
            this,
            config.width / 2,
            config.height / 2,
            'PLAY',
            () => {
                this.scene.start('GameScene');
            },
        );

        _.createButton(
            this,
            config.width / 2,
            config.height / 2 + 80,
            'HIGH SCORES',
            () => {
                this.scene.start('HighScores');
            },
        );

        _.createButton(
            this,
            config.width / 2,
            config.height / 2 + 160,
            'OPTIONS',
            () => {
                this.scene.start('OptionsScene');
            }
        );
    }
} 