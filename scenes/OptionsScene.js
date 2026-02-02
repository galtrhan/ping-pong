import { config, _, AudioManager } from "../game.js";

export default class OptionsScene extends Phaser.Scene {
    constructor() {
        super({ key: "OptionsScene" });
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

        // Create UI groups for better management
        this.uiElements = this.add.group();

        // Title
        const title = this.add
            .text(config.width / 2, 50, "OPTIONS", {
                ..._.styles.text,
                fontSize: "48px",
            })
            .setOrigin(0.5);
        this.uiElements.add(title);

        // Music Volume Section
        this.createVolumeSection("MUSIC", 150, true);

        // SFX Volume Section
        this.createVolumeSection("SFX", 220, false);

        // Mute toggles
        this.createMuteToggle("MUTE MUSIC", 320, true);
        this.createMuteToggle("MUTE SFX", 380, false);

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

    createVolumeSection(label, y, isMusic) {
        // Label
        const labelText = this.add
            .text(config.width / 2 - 200, y, `${label} VOLUME:`, {
                ..._.styles.text,
                fontSize: "24px",
            })
            .setOrigin(0, 0.5);
        this.uiElements.add(labelText);

        // Slider background
        const slider = this.add.rectangle(
            config.width / 2,
            y + 30,
            400,
            20,
            0x444444,
        );
        this.uiElements.add(slider);

        // Slider fill
        const volume = isMusic ? this.audio.musicVolume : this.audio.sfxVolume;
        const fill = this.add.rectangle(
            config.width / 2 - 200,
            y + 30,
            volume * 400,
            18,
            0xffffff,
        );
        fill.setOrigin(0, 0.5);
        this.uiElements.add(fill);

        // Volume percentage text
        const volumeText = this.add
            .text(config.width / 2 + 220, y, `${Math.round(volume * 100)}%`, {
                ..._.styles.text,
                fontSize: "20px",
            })
            .setOrigin(1, 0.5);
        this.uiElements.add(volumeText);

        // Make slider interactive
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
                }

                // Play test sound for SFX
                if (!isMusic && !this.audio.sfxMuted) {
                    this.audio.playClick();
                }
            },
            {
                fontSize: "20px",
                backgroundColor: isMuted ? "#800000" : "#006600",
            },
        );

        this.uiElements.add(toggleButton);
    }

    makeSliderInteractive(slider, fill, text, isMusic) {
        slider.setInteractive();

        const updateVolume = (pointer) => {
            const sliderBounds = slider.getBounds();
            const relativeX = pointer.x - sliderBounds.left;
            const newVolume = Phaser.Math.Clamp(relativeX / sliderBounds.width, 0, 1);

            // Update visual elements
            fill.width = newVolume * slider.width;
            fill.x = slider.x - slider.width / 2;
            text.setText(`${Math.round(newVolume * 100)}%`);

            // Update audio
            if (isMusic) {
                this.audio.setMusicVolume(newVolume);
            } else {
                this.audio.setSFXVolume(newVolume);
                // Play test sound for immediate feedback
                if (newVolume > 0) {
                    this.audio.playHover();
                }
            }
        };

        slider.on("pointerdown", updateVolume);
        slider.on("pointermove", (pointer) => {
            if (pointer.isDown) {
                updateVolume(pointer);
            }
        });

        // Hover effects for better UX
        slider.on("pointerover", () => {
            slider.setFillStyle(0x666666);
        });

        slider.on("pointerout", () => {
            slider.setFillStyle(0x444444);
        });
    }

    shutdown() {
        // Cleanup when scene ends
        if (this.uiElements) {
            this.uiElements.destroy(true);
        }
    }
}
