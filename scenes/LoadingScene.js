import { config, _, FONT } from "../game.js";

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: "LoadingScene" });
  }

  preload() {
    // Create loading bar background
    const loadingBarBg = this.add.rectangle(
      config.width / 2,
      config.height / 2,
      400,
      50,
      0x333333,
    );

    // Create loading bar fill
    const loadingBar = this.add.rectangle(
      config.width / 2 - 200,
      config.height / 2,
      0,
      46,
      0x00ff00,
    );
    loadingBar.setOrigin(0, 0.5);

    // Loading text
    const loadingText = this.add
      .text(config.width / 2, config.height / 2 - 100, "Loading Assets...", {
        ..._.styles.text,
        fontSize: "32px",
      })
      .setOrigin(0.5);

    // Percentage text
    const percentText = this.add
      .text(config.width / 2, config.height / 2 + 100, "0%", {
        ..._.styles.text,
        fontSize: "24px",
      })
      .setOrigin(0.5);

    // Listen for loading progress
    this.load.on("progress", (value) => {
      // Update loading bar
      loadingBar.width = 400 * value;

      // Update percentage text
      percentText.setText(Math.round(value * 100) + "%");
    });

    // Listen for individual file loads
    this.load.on("fileprogress", (file) => {
      loadingText.setText("Loading: " + file.key);
    });

    // When loading is complete
    this.load.on("complete", () => {
      loadingText.setText("Loading Complete!");

      // Transition to StartMenu after a brief delay
      this.time.delayedCall(500, () => {
        this.scene.transition({
          target: "StartMenu",
          duration: 500,
          moveAbove: true,
          onUpdate: (progress) => {
            this.cameras.main.setAlpha(1 - progress);
          },
        });
      });
    });

    // Load audio assets
    this.load.audio("click", "assets/click.wav");
    this.load.audio("hover", "assets/hover.wav");
    this.load.audio("hit", "assets/hit.wav");
    this.load.audio("score", "assets/score.wav");
    this.load.audio("music", "assets/music.mp3");
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

    // This will run after preload is complete
    // Any additional setup can go here
  }
}
