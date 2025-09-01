import { config, _, AudioManager } from "../game.js";

export default class PlayerSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlayerSelectScene" });
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
      .text(config.width / 2, config.height / 4, "SELECT MODE", {
        ..._.styles.text,
        fontSize: "48px",
      })
      .setOrigin(0.5);

    // One Player button
    _.createButton(
      this,
      config.width / 2,
      config.height / 2,
      "ONE PLAYER",
      () => {
        this.scene.transition({
          target: "GameScene",
          duration: 300,
          moveAbove: true,
          data: { mode: "single" },
          onUpdate: (progress) => {
            this.cameras.main.setAlpha(1 - progress);
          },
        });
      },
    );

    // Two Players button
    _.createButton(
      this,
      config.width / 2,
      config.height / 2 + 80,
      "TWO PLAYERS",
      () => {
        this.scene.transition({
          target: "GameScene",
          duration: 300,
          moveAbove: true,
          data: { mode: "multi" },
          onUpdate: (progress) => {
            this.cameras.main.setAlpha(1 - progress);
          },
        });
      },
    );

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
  }
}
