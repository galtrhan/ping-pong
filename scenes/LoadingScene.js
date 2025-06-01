import { config } from '../game.js';

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Loading text
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontSize: '32px',
            color: '#fff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Progress bar background
        const progressBox = this.add.rectangle(width / 2, height / 2 + 50, 320, 50, 0x222222);
        progressBox.setOrigin(0.5);

        // Progress bar fill
        const progressBar = this.add.rectangle(width / 2 - 160, height / 2 + 50, 0, 50, 0xffffff);
        progressBar.setOrigin(0, 0.5);

        // Loading progress text
        const progressText = this.add.text(width / 2, height / 2 + 50, '0%', {
            fontSize: '18px',
            color: '#fff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Update progress bar as assets load
        this.load.on('progress', (value) => {
            progressBar.width = 320 * value;
            progressText.setText(parseInt(value * 100) + '%');
        });

        // Remove progress bar when loading complete
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
        // Start the start menu scene
        this.scene.start('StartMenu');
    }
} 