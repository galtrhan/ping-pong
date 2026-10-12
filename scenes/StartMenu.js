import { config, _, AudioManager } from "../game.js";
import BaseScene from "./BaseScene.js";

export default class StartMenu extends BaseScene {
    constructor() {
        super({ key: "StartMenu" });
    }

    create() {
        this.fadeIn();

        this.audio = new AudioManager(this);

        this.unlockAudio();

        this.add
            .text(config.width / 2, config.height / 4, "PING PONG", {
                ..._.styles.text,
                fontSize: "64px",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        _.createButton(this, config.width / 2, config.height / 2, "PLAY", () => {
            this.goTo("PlayerSelectScene");
        });

        _.createButton(
            this,
            config.width / 2,
            config.height / 2 + 80,
            "HIGH SCORES",
            () => this.goTo("HighScores"),
        );

        _.createButton(
            this,
            config.width / 2,
            config.height / 2 + 160,
            "OPTIONS",
            () => this.goTo("OptionsScene"),
        );
    }

    unlockAudio() {
        const unlockButton = this.add
            .rectangle(0, 0, config.width * 2, config.height * 2, 0x000000, 0)
            .setOrigin(0)
            .setInteractive({ useHandCursor: true });

        const instructionText = this.add
            .text(
                config.width / 2,
                config.height - 100,
                "Click anywhere to enable audio",
                {
                    ..._.styles.text,
                    fontSize: "18px",
                    alpha: 0.7,
                },
            )
            .setOrigin(0.5);

        unlockButton.once("pointerdown", () => {
            this.audio.ensureMusicPlaying();
            unlockButton.destroy();
            instructionText.destroy();
        });
    }
}
