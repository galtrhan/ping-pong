import { config, _, AudioManager } from "../game.js";

export default class StartMenu extends Phaser.Scene {
  constructor() {
    super({ key: "StartMenu" });
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

    this.add
      .text(config.width / 2, config.height / 4, "PING PONG", {
        ..._.styles.text,
        fontSize: "64px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    _.createButton(this, config.width / 2, config.height / 2, "PLAY", () => {
      this.scene.transition({
        target: "PlayerSelectScene",
        duration: 300,
        moveAbove: true,
        onUpdate: (progress) => {
          this.cameras.main.setAlpha(1 - progress);
        },
      });
    });

    _.createButton(
      this,
      config.width / 2,
      config.height / 2 + 80,
      "HIGH SCORES",
      () => {
        this.scene.transition({
          target: "HighScores",
          duration: 300,
          moveAbove: true,
          onUpdate: (progress) => {
            this.cameras.main.setAlpha(1 - progress);
          },
        });
      },
    );

    _.createButton(
      this,
      config.width / 2,
      config.height / 2 + 160,
      "OPTIONS",
      () => {
        this.scene.transition({
          target: "OptionsScene",
          duration: 300,
          moveAbove: true,
          onUpdate: (progress) => {
            this.cameras.main.setAlpha(1 - progress);
          },
        });
      },
    );
  }
}
