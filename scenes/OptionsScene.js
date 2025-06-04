import {
    config,
    _,
    AudioManager
} from '../game.js';

export default class OptionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OptionsScene' });
    }

    create() {
        // Initialize audio manager
        this.audio = new AudioManager(this);
        this.audio.ensureMusicPlaying();

        // Title
        this.add.text(config.width / 2, 50, 'OPTIONS', {
            ..._.styles.text,
            fontSize: '48px',
        }).setOrigin(0.5);

        // Music Volume
        const musicVolumeY = 150;
        this.add.text(config.width / 2 - 200, musicVolumeY, 'MUSIC VOLUME:', {
            ..._.styles.text,
            fontSize: '24px',
        }).setOrigin(0, 0.5);

        // Music Volume Slider
        const musicSlider = this.add.rectangle(config.width / 2, musicVolumeY + 30, 400, 20, 0x444444);
        const musicFill = this.add.rectangle(
            config.width / 2 - 200, 
            musicVolumeY + 30,
            this.audio.musicVolume * 400,
            20,
            0xffffff
        );
        musicFill.setOrigin(0, 0.5);

        // Music Volume Text
        const musicVolumeText = this.add.text(
            config.width / 2 + 200,
            musicVolumeY,
            `${Math.round(this.audio.musicVolume * 100)}%`,
            {
                ..._.styles.text,
                fontSize: '20px',
            }
        ).setOrigin(1, 0.5);

        // SFX Volume
        const sfxVolumeY = 220;
        this.add.text(config.width / 2 - 200, sfxVolumeY, 'SFX VOLUME:', {
            ..._.styles.text,
            fontSize: '24px',
        }).setOrigin(0, 0.5);

        // SFX Volume Slider
        const sfxSlider = this.add.rectangle(config.width / 2, sfxVolumeY + 30, 400, 20, 0x444444);
        const sfxFill = this.add.rectangle(
            config.width / 2 - 200,
            sfxVolumeY + 30,
            this.audio.sfxVolume * 400,
            20,
            0xffffff
        );
        sfxFill.setOrigin(0, 0.5);

        // SFX Volume Text
        const sfxVolumeText = this.add.text(
            config.width / 2 + 200,
            sfxVolumeY,
            `${Math.round(this.audio.sfxVolume * 100)}%`,
            {
                ..._.styles.text,
                fontSize: '20px',
            }
        ).setOrigin(1, 0.5);

        // Make sliders interactive
        const makeSliderInteractive = (slider, fill, text, isMusic) => {
            slider.setInteractive();
            
            slider.on('pointerdown', (pointer) => {
                const newVolume = (pointer.x - slider.x + slider.width/2) / slider.width;
                const volume = Math.max(0, Math.min(1, newVolume));
                fill.width = volume * slider.width;
                fill.x = slider.x - slider.width/2;
                text.setText(`${Math.round(volume * 100)}%`);
                
                if (isMusic) {
                    this.audio.setMusicVolume(volume);
                } else {
                    this.audio.setSFXVolume(volume);
                }
            });

            slider.on('pointermove', (pointer) => {
                if (pointer.isDown) {
                    const newVolume = (pointer.x - slider.x + slider.width/2) / slider.width;
                    const volume = Math.max(0, Math.min(1, newVolume));
                    fill.width = volume * slider.width;
                    fill.x = slider.x - slider.width/2;
                    text.setText(`${Math.round(volume * 100)}%`);
                    
                    if (isMusic) {
                        this.audio.setMusicVolume(volume);
                    } else {
                        this.audio.setSFXVolume(volume);
                    }
                }
            });
        };

        makeSliderInteractive(musicSlider, musicFill, musicVolumeText, true);
        makeSliderInteractive(sfxSlider, sfxFill, sfxVolumeText, false);

        _.createButton(
            this,
            config.width / 2,
            config.height - 50,
            'BACK',
            () => {
                this.scene.start('StartMenu');
            }
        );
    }
} 