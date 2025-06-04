import { config, _ } from '../game.js';

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }

    preload() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'LOADING...', _.styles.text).setOrigin(0.5);
        const progressBox = this.add.rectangle(width / 2, height / 2 + 50, 320, 50, 0x222222).setOrigin(0.5);
        const progressBar = this.add.rectangle(width / 2 - 160, height / 2 + 50, 0, 50, 0xffffff).setOrigin(0, 0.5);
        const progressText = this.add.text(width / 2, height / 2 + 50, '0%', {
            ..._.styles.text,
            fontSize: '18px',
        }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            progressBar.width = 320 * value;
            progressText.setText(parseInt(value * 100) + '%');
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            progressText.destroy();
            loadingText.destroy();
        });

        // Load all sound effects
        this.load.audio('click', 'assets/click.wav');
        this.load.audio('hit', 'assets/hit.wav');
        this.load.audio('hover', 'assets/hover.wav');
        this.load.audio('score', 'assets/score.wav');
        this.load.audio('music', 'assets/music.mp3');
    }

    create() {
        this.scene.start('StartMenu');
    }
} 