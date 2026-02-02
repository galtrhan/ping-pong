import { _, config, AudioManager } from "../game.js";

export default class HighScores extends Phaser.Scene {
    constructor() {
        super({ key: "HighScores" });
    }

    create() {
        // Fade in the scene using manual tween
        this.cameras.main.setAlpha(0);
        this.tweens.add({
            targets: this.cameras.main,
            alpha: 1,
            duration: 300,
            ease: "Power2",
            delay: 100,
        });

        // Initialize audio manager
        this.audio = new AudioManager(this);
        this.audio.ensureMusicPlaying();

        // Title
        this.add
            .text(config.width / 2, 50, "HIGH SCORES", {
                ..._.styles.text,
                fontSize: "48px",
            })
            .setOrigin(0.5);

        // Get high scores from localStorage with error handling
        let highScores = [];
        try {
            highScores = JSON.parse(localStorage.getItem("pingPongHighScores")) || [];
        } catch (e) {
            console.warn("Failed to load high scores:", e);
        }

        // Display high scores
        const startX = config.width / 2 - 200;
        const startY = 150;
        const rowHeight = 40;

        // Headers
        this.add
            .text(startX, startY, "RANK", {
                ..._.styles.text,
                fontSize: "24px",
            })
            .setOrigin(0, 0.5);

        this.add
            .text(startX + 100, startY, "NAME", {
                ..._.styles.text,
                fontSize: "24px",
            })
            .setOrigin(0, 0.5);

        this.add
            .text(startX + 200, startY, "SCORE", {
                ..._.styles.text,
                fontSize: "24px",
            })
            .setOrigin(0, 0.5);

        this.add
            .text(startX + 300, startY, "TIME", {
                ..._.styles.text,
                fontSize: "24px",
            })
            .setOrigin(0, 0.5);

        this.add
            .text(startX + 400, startY, "DATE", {
                ..._.styles.text,
                fontSize: "24px",
            })
            .setOrigin(0, 0.5);

        // Display scores or "No scores yet" message
        if (highScores.length === 0) {
            this.add
                .text(
                    config.width / 2,
                    startY + 100,
                    "No high scores yet!\nPlay a game to set a record.",
                    {
                        ..._.styles.text,
                        fontSize: "24px",
                        align: "center",
                    },
                )
                .setOrigin(0.5);
        } else {
            highScores.forEach((score, index) => {
                const y = startY + (index + 1) * rowHeight;

                // Rank
                this.add
                    .text(startX, y, `${index + 1}.`, {
                        fontSize: "20px",
                        color: "#fff",
                        fontFamily: "kenney-mini",
                    })
                    .setOrigin(0, 0.5);

                // Name
                this.add
                    .text(startX + 100, y, score.name || "Player", {
                        fontSize: "20px",
                        color: "#fff",
                        fontFamily: "kenney-mini",
                    })
                    .setOrigin(0, 0.5);

                // Score
                this.add
                    .text(startX + 200, y, `${score.playerScore} - ${score.aiScore}`, {
                        fontSize: "20px",
                        color: "#fff",
                        fontFamily: "kenney-mini",
                    })
                    .setOrigin(0, 0.5);

                // Time
                this.add
                    .text(startX + 300, y, `${score.time}s`, {
                        fontSize: "20px",
                        color: "#fff",
                        fontFamily: "kenney-mini",
                    })
                    .setOrigin(0, 0.5);

                // Date
                this.add
                    .text(startX + 400, y, score.date, {
                        fontSize: "20px",
                        color: "#fff",
                        fontFamily: "kenney-mini",
                    })
                    .setOrigin(0, 0.5);
            });
        }

        // Back button
        _.createButton(this, config.width / 2, config.height - 50, "BACK", () => {
            this.scene.transition({
                target: "StartMenu",
                duration: 300,
                moveAbove: true,
                onUpdate: (progress) => {
                    this.cameras.main.setAlpha(1 - progress);
                },
            });
        });

        // Clear scores button (for development/testing)
        _.createButton(
            this,
            config.width / 2,
            config.height - 100,
            "CLEAR SCORES",
            () => {
                try {
                    localStorage.removeItem("pingPongHighScores");
                    this.scene.transition({
                        target: "HighScores",
                        duration: 300,
                        moveAbove: true,
                        onUpdate: (progress) => {
                            this.cameras.main.setAlpha(1 - progress);
                        },
                    });
                } catch (e) {
                    console.warn("Failed to clear high scores:", e);
                }
            },
            {
                fontSize: "18px",
                backgroundColor: "#800000",
            },
        );
    }

    shutdown() {
        // Cleanup when scene ends
        // Any cleanup specific to high scores scene can go here
    }
}
