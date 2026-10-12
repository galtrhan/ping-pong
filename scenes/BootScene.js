// BootScene for custom web font loading and initial setup

import BaseScene from "./BaseScene.js";

export default class BootScene extends BaseScene {
    constructor() {
        super({ key: "BootScene" });
    }

    init() {
        // Create font face CSS for custom font
        const element = document.createElement("style");
        document.head.appendChild(element);
        const sheet = element.sheet;
        const styles =
            '@font-face { font-family: "kenney-mini"; src: url("assets/Kenney Mini Square.ttf") format("truetype"); }';

        try {
            sheet.insertRule(styles, 0);
        } catch (e) {
            console.warn("Failed to load custom font CSS:", e);
        }
    }

    preload() {
        // Show a simple loading indicator
        this.add
            .text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "Loading...",
                {
                    fontSize: "32px",
                    color: "#ffffff",
                    fontFamily: "Arial",
                },
            )
            .setOrigin(0.5);

        // Load WebFont library
        this.load.script(
            "webfont",
            "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js",
        );
    }

    create() {
        // Check if WebFont loaded successfully
        if (typeof window.WebFont !== "undefined") {
            window.WebFont.load({
                custom: {
                    families: ["kenney-mini"],
                    urls: ["assets/Kenney Mini Square.ttf"],
                },
                active: () => {
                    this.goTo("LoadingScene");
                },
                inactive: () => {
                    console.warn("Font failed to load, using fallback");
                    this.goTo("LoadingScene");
                },
                timeout: 5000, // 5 second timeout
            });
        } else {
            console.warn(
                "WebFont library failed to load, proceeding without custom font",
            );
            this.goTo("LoadingScene");
        }
    }
}
