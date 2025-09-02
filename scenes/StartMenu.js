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

    // Handle audio unlock for browser autoplay policy
    this.audioUnlocked = false;
    this.unlockAudio();

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

  unlockAudio() {
    // Create an invisible button that covers the whole screen to unlock audio
    const unlockButton = this.add
      .rectangle(0, 0, config.width * 2, config.height * 2, 0x000000, 0)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true });

    // Add instruction text
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

    // Handle the first user interaction
    unlockButton.once("pointerdown", () => {
      if (!this.audioUnlocked) {
        this.audioUnlocked = true;

        // Try to start music
        try {
          this.audio.ensureMusicPlaying();
        } catch (e) {
          console.log("Audio unlock attempted:", e);
        }

        // Remove the unlock elements
        unlockButton.destroy();
        instructionText.destroy();
      }
    });
  }
}
