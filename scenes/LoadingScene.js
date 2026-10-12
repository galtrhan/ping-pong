import { config, _ } from "../game.js";
import BaseScene from "./BaseScene.js";

export default class LoadingScene extends BaseScene {
    constructor() {
        super({ key: "LoadingScene" });
    }

    preload() {
        this.add.rectangle(config.width / 2, config.height / 2, 400, 50, 0x333333);

        const loadingBar = this.add
            .rectangle(config.width / 2 - 200, config.height / 2, 0, 46, 0x00ff00)
            .setOrigin(0, 0.5);

        const loadingText = this.add
            .text(config.width / 2, config.height / 2 - 100, "Loading Assets...", {
                ..._.styles.text,
                fontSize: "32px",
            })
            .setOrigin(0.5);

        const percentText = this.add
            .text(config.width / 2, config.height / 2 + 100, "0%", {
                ..._.styles.text,
                fontSize: "24px",
            })
            .setOrigin(0.5);

        this.load.on("progress", (value) => {
            loadingBar.width = 400 * value;
            percentText.setText(Math.round(value * 100) + "%");
        });

        this.load.on("fileprogress", (file) => {
            loadingText.setText("Loading: " + file.key);
        });

        this.load.on("complete", () => {
            loadingText.setText("Loading Complete!");
            this.time.delayedCall(500, () => this.goTo("StartMenu", undefined, 500));
        });

        this.load.audio("click", "assets/click.wav");
        this.load.audio("hover", "assets/hover.wav");
        this.load.audio("hit", "assets/hit.wav");
        this.load.audio("score", "assets/score.wav");
        this.load.audio("music", "assets/music.mp3");
    }

    create() {
        this.fadeIn();
    }
}
