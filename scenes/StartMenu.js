import { menuMusic, musicMuted, musicVolume, config, setMenuMusic } from '../game.js';

export default class StartMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'StartMenu' });
    }

    create() {
        // Load sound effects
        this.clickSound = this.sound.add('click');
        this.hoverSound = this.sound.add('hover');
        
        // Play background music if not already playing
        if (!menuMusic) {
            const music = this.sound.add('music', {
                volume: musicMuted ? 0 : musicVolume,
                loop: true
            });
            music.play();
            setMenuMusic(music);
        } else {
             // Ensure volume is correct if music was already playing
             menuMusic.setVolume(musicMuted ? 0 : musicVolume);
        }

        // Title
        this.add.text(config.width / 2, config.height / 4, 'PING PONG', {
            fontSize: '64px',
            color: '#fff',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Play Button
        const playButton = this.add.text(config.width / 2, config.height / 2 - 40, 'PLAY', {
            fontSize: '32px',
            color: '#fff',
            fontFamily: 'monospace',
            backgroundColor: '#444',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        playButton.on('pointerover', () => {
            playButton.setStyle({ backgroundColor: '#666' });
            this.hoverSound.play();
        });

        playButton.on('pointerout', () => {
            playButton.setStyle({ backgroundColor: '#444' });
        });

        playButton.on('pointerdown', () => {
            this.clickSound.play();
            this.scene.start('GameScene');
        });

        // High Scores Button
        const highScoresButton = this.add.text(config.width / 2, config.height / 2 + 40, 'HIGH SCORES', {
            fontSize: '32px',
            color: '#fff',
            fontFamily: 'monospace',
            backgroundColor: '#444',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        highScoresButton.on('pointerover', () => {
            highScoresButton.setStyle({ backgroundColor: '#666' });
            this.hoverSound.play();
        });

        highScoresButton.on('pointerout', () => {
            highScoresButton.setStyle({ backgroundColor: '#444' });
        });

        highScoresButton.on('pointerdown', () => {
            this.clickSound.play();
            this.scene.start('HighScores');
        });

        // Options Button
        const optionsButton = this.add.text(config.width / 2, config.height / 2 + 120, 'OPTIONS', {
            fontSize: '32px',
            color: '#fff',
            fontFamily: 'monospace',
            backgroundColor: '#444',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        optionsButton.on('pointerover', () => {
            optionsButton.setStyle({ backgroundColor: '#666' });
            this.hoverSound.play();
        });

        optionsButton.on('pointerout', () => {
            optionsButton.setStyle({ backgroundColor: '#444' });
        });

        optionsButton.on('pointerdown', () => {
            this.clickSound.play();
            this.scene.start('OptionsScene');
        });
    }
} 