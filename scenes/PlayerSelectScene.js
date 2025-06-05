import {
    config,
    _,
    AudioManager
} from '../game.js';

export default class PlayerSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayerSelectScene' });
    }

    create() {
        // Initialize audio manager
        this.audio = new AudioManager(this);
        this.audio.ensureMusicPlaying();

        // Title
        this.add.text(config.width / 2, config.height / 4, 'SELECT MODE', {
            ..._.styles.text,
            fontSize: '48px',
        }).setOrigin(0.5);

        // One Player button
        _.createButton(
            this,
            config.width / 2,
            config.height / 2,
            'ONE PLAYER',
            () => {
                this.scene.start('GameScene', { mode: 'single' });
            }
        );

        // Two Players button
        _.createButton(
            this,
            config.width / 2,
            config.height / 2 + 80,
            'TWO PLAYERS',
            () => {
                this.scene.start('GameScene', { mode: 'multi' });
            }
        );

        // Back button
        _.createButton(
            this,
            config.width / 2,
            config.height - 50,
            'BACK',
            () => {
                this.scene.start('StartMenu');
            }
        );
    }
} 