import { config, _, AudioManager } from "../game.js";
import BaseScene from "./BaseScene.js";

export default class OptionsScene extends BaseScene {
    constructor() {
        super({ key: "OptionsScene" });
    }

    create() {
        this.fadeIn();

        this.audio = new AudioManager(this);
        this.audio.ensureMusicPlaying();

        this.add
            .text(config.width / 2, 50, "OPTIONS", {
                ..._.styles.text,
                fontSize: "48px",
            })
            .setOrigin(0.5);

        this.createVolumeSection("MUSIC", 150, true);
        this.createVolumeSection("SFX", 220, false);

        this.createMuteToggle("MUTE MUSIC", 320, true);
        this.createMuteToggle("MUTE SFX", 380, false);

        _.createButton(this, config.width / 2, config.height - 50, "BACK", () =>
            this.goTo("StartMenu"),
        );
    }

    createVolumeSection(label, y, isMusic) {
        this.add
            .text(config.width / 2 - 200, y, `${label} VOLUME:`, {
                ..._.styles.text,
                fontSize: "24px",
            })
            .setOrigin(0, 0.5);

        const slider = this.add.rectangle(
            config.width / 2,
            y + 30,
            400,
            20,
            0x444444,
        );

        const volume = isMusic ? this.audio.musicVolume : this.audio.sfxVolume;
        const fill = this.add
            .rectangle(config.width / 2 - 200, y + 30, volume * 400, 18, 0xffffff)
            .setOrigin(0, 0.5);

        const volumeText = this.add
            .text(config.width / 2 + 220, y, `${Math.round(volume * 100)}%`, {
                ..._.styles.text,
                fontSize: "20px",
            })
            .setOrigin(1, 0.5);

        this.makeSliderInteractive(slider, fill, volumeText, isMusic);
    }

    createMuteToggle(label, y, isMusic) {
        const isMuted = isMusic ? this.audio.musicMuted : this.audio.sfxMuted;

        const toggleButton = _.createButton(
            this,
            config.width / 2,
            y,
            `${label}: ${isMuted ? "OFF" : "ON"}`,
            () => {
                if (isMusic) {
                    this.audio.toggleMusicMute();
                    toggleButton.setText(
                        `${label}: ${this.audio.musicMuted ? "OFF" : "ON"}`,
                    );
                } else {
                    this.audio.toggleSFXMute();
                    toggleButton.setText(
                        `${label}: ${this.audio.sfxMuted ? "OFF" : "ON"}`,
                    );
                    if (!this.audio.sfxMuted) {
                        this.audio.play("click");
                    }
                }
            },
            {
                fontSize: "20px",
                backgroundColor: isMuted ? "#800000" : "#006600",
            },
        );
    }

    makeSliderInteractive(slider, fill, text, isMusic) {
        slider.setInteractive();

        const updateVolume = (pointer) => {
            const bounds = slider.getBounds();
            const volume = Phaser.Math.Clamp(
                (pointer.x - bounds.left) / bounds.width,
                0,
                1,
            );

            fill.width = volume * slider.width;
            fill.x = slider.x - slider.width / 2;
            text.setText(`${Math.round(volume * 100)}%`);

            if (isMusic) {
                this.audio.setMusicVolume(volume);
            } else {
                this.audio.setSFXVolume(volume);
                if (volume > 0) {
                    this.audio.play("hover");
                }
            }
        };

        slider.on("pointerdown", updateVolume);
        slider.on("pointermove", (pointer) => {
            if (pointer.isDown) {
                updateVolume(pointer);
            }
        });

        slider.on("pointerover", () => slider.setFillStyle(0x666666));
        slider.on("pointerout", () => slider.setFillStyle(0x444444));
    }
}
