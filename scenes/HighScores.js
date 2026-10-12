import { _, config, AudioManager } from "../game.js";
import BaseScene from "./BaseScene.js";

const COLUMNS = [
    { label: "RANK", x: 0 },
    { label: "NAME", x: 100 },
    { label: "SCORE", x: 200 },
    { label: "TIME", x: 300 },
    { label: "DATE", x: 400 },
];

export default class HighScores extends BaseScene {
    constructor() {
        super({ key: "HighScores" });
    }

    create() {
        this.fadeIn();

        this.audio = new AudioManager(this);
        this.audio.ensureMusicPlaying();

        this.add
            .text(config.width / 2, 50, "HIGH SCORES", {
                ..._.styles.text,
                fontSize: "48px",
            })
            .setOrigin(0.5);

        let highScores = [];
        try {
            highScores = JSON.parse(localStorage.getItem("pingPongHighScores")) || [];
        } catch (e) {
            console.warn("Failed to load high scores:", e);
        }

        const startX = config.width / 2 - 200;
        const startY = 150;
        const rowHeight = 40;

        COLUMNS.forEach(({ label, x }) => {
            this.add
                .text(startX + x, startY, label, {
                    ..._.styles.text,
                    fontSize: "24px",
                })
                .setOrigin(0, 0.5);
        });

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
            const rowStyle = { ..._.styles.text, fontSize: "20px" };
            highScores.forEach((score, index) => {
                const y = startY + (index + 1) * rowHeight;
                const values = [
                    `${index + 1}.`,
                    score.name || "Player",
                    `${score.playerScore} - ${score.aiScore}`,
                    `${score.time}s`,
                    score.date,
                ];
                values.forEach((value, column) => {
                    this.add
                        .text(startX + COLUMNS[column].x, y, value, rowStyle)
                        .setOrigin(0, 0.5);
                });
            });
        }

        _.createButton(this, config.width / 2, config.height - 50, "BACK", () =>
            this.goTo("StartMenu"),
        );

        _.createButton(
            this,
            config.width / 2,
            config.height - 100,
            "CLEAR SCORES",
            () => {
                try {
                    localStorage.removeItem("pingPongHighScores");
                    this.goTo("HighScores");
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
}
