import { _, config, AudioManager } from '../game.js';

export default class HighScores extends Phaser.Scene {
    constructor() {
        super({ key: 'HighScores' });
    }

    create() {
        // Initialize audio manager
        this.audio = new AudioManager(this);
        this.audio.ensureMusicPlaying();

        // Title
        this.add.text(config.width / 2, 50, 'HIGH SCORES', {
            ..._.styles.text,
            fontSize: '48px',
        }).setOrigin(0.5);

        // Get high scores from localStorage
        const highScores = JSON.parse(localStorage.getItem('pingPongHighScores')) || [];

        // Display high scores
        const startX = config.width / 2 - 200;
        const startY = 150;
        const rowHeight = 40;

        // Headers
        this.add.text(startX, startY, 'RANK', {
            ..._.styles.text,
            fontSize: '24px',
        }).setOrigin(0, 0.5);

        this.add.text(startX + 100, startY, 'NAME', {
            ..._.styles.text,
            fontSize: '24px',
        }).setOrigin(0, 0.5);

        this.add.text(startX + 200, startY, 'SCORE', {
            ..._.styles.text,
            fontSize: '24px',
        }).setOrigin(0, 0.5);

        this.add.text(startX + 300, startY, 'TIME', {
            ..._.styles.text,
            fontSize: '24px',
        }).setOrigin(0, 0.5);

        this.add.text(startX + 400, startY, 'DATE', {
            ..._.styles.text,
            fontSize: '24px',
        }).setOrigin(0, 0.5);

        // Display scores
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