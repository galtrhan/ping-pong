import { config, _, AudioManager } from "../game.js";
import BaseScene from "./BaseScene.js";

export default class PlayerSelectScene extends BaseScene {
    constructor() {
        super({ key: "PlayerSelectScene" });
    }

    create() {
        this.fadeIn();

        this.audio = new AudioManager(this);
        this.audio.ensureMusicPlaying();

        this.add
            .text(config.width / 2, config.height / 4, "SELECT MODE", {
                ..._.styles.text,
                fontSize: "48px",
            })
            .setOrigin(0.5);

        _.createButton(
            this,
            config.width / 2,
            config.height / 2,
            "ONE PLAYER",
            () => this.goTo("GameScene", { mode: "single" }),
        );

        _.createButton(
            this,
            config.width / 2,
            config.height / 2 + 80,
            "TWO PLAYERS",
            () => this.goTo("GameScene", { mode: "multi" }),
        );

        _.createButton(this, config.width / 2, config.height - 50, "BACK", () =>
            this.goTo("StartMenu"),
        );
    }
}
