import { _, menuMusic, musicMuted, musicVolume, config, setMenuMusic } from '../game.js';

export default class HighScores extends Phaser.Scene {
    constructor() {
        super({ key: 'HighScores' });
    }

    create() {
        // Load sound effects
        this.clickSound = this.sound.add('click');
        this.hoverSound = this.sound.add('hover');

        // Ensure music is playing
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
        this.add.text(config.width / 2, 50, 'HIGH SCORES', {
            ..._.styles.text,
            fontSize: '48px',
        }).setOrigin(0.5);

        // Get high scores from localStorage
        const highScores = JSON.parse(localStorage.getItem('pingPongHighScores')) || [];

        // Display high scores
        if (highScores.length === 0) {
            this.add.text(config.width / 2, config.height / 2, 'NO DATA!', _.styles.text).setOrigin(0.5);
        } else {
            // Create table headers
            const headers = ['Rank', 'Name', 'Score', 'Time', 'Date'];
            const startX = config.width / 2 - 200;
            const startY = 120;
            const rowHeight = 40;

            // Draw headers
            headers.forEach((header, index) => {
                this.add.text(startX + (index * 100), startY, header, {
                    fontSize: '24px',
                    color: '#fff',
                    fontFamily: 'kenney-mini'
                }).setOrigin(0, 0.5);
            });

            // Draw scores
            highScores.forEach((score, index) => {
                const y = startY + (index + 1) * rowHeight;
                
                // Rank
                this.add.text(startX, y, `${index + 1}.`, {
                    fontSize: '20px',
                    color: '#fff',
                    fontFamily: 'kenney-mini'
                }).setOrigin(0, 0.5);

                // Name
                this.add.text(startX + 100, y, score.name || 'Player', {
                    fontSize: '20px',
                    color: '#fff',
                    fontFamily: 'kenney-mini'
                }).setOrigin(0, 0.5);

                // Score
                this.add.text(startX + 200, y, `${score.playerScore} - ${score.aiScore}`, {
                    fontSize: '20px',
                    color: '#fff',
                    fontFamily: 'kenney-mini'
                }).setOrigin(0, 0.5);

                // Time
                this.add.text(startX + 300, y, `${score.time}s`, {
                    fontSize: '20px',
                    color: '#fff',
                    fontFamily: 'kenney-mini'
                }).setOrigin(0, 0.5);

                // Date
                this.add.text(startX + 400, y, score.date, {
                    fontSize: '20px',
                    color: '#fff',
                    fontFamily: 'kenney-mini'
                }).setOrigin(0, 0.5);
            });
        }

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