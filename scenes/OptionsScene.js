import {
    config,
    _,
    menuMusic,
    setMenuMusic,
    musicMuted,
    musicVolume,
    sfxVolume,
    sfxMuted,
} from '../game.js';

export default class OptionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OptionsScene' });
    }

    create() {
        // Load sound effects
        this.clickSound = this.sound.add('click');
        this.hoverSound = this.sound.add('hover');

        // Ensure music is playing
        if (!menuMusic) {
            const music = this.sound.add('music', {
                volume: musicMuted ? 0 : musicVolume,
                loop: true
            });
            music.play();
            setMenuMusic(music);
        } else {
            // Ensure volume is correct if music was already playing
            menuMusic.setVolume(musicMuted ? 0 : musicVolume);
        }

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
            musicVolume * 400,
            20,
            0xffffff
        );
        musicFill.setOrigin(0, 0.5);

        // Music Volume Text
        const musicVolumeText = this.add.text(
            config.width / 2 + 200,
            musicVolumeY,
            `${Math.round(musicVolume * 100)}%`,
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
            sfxVolume * 400,
            20,
            0xffffff
        );
        sfxFill.setOrigin(0, 0.5);

        // SFX Volume Text
        const sfxVolumeText = this.add.text(
            config.width / 2 + 200,
            sfxVolumeY,
            `${Math.round(sfxVolume * 100)}%`,
            {
                ..._.styles.text,
                fontSize: '20px',
            }
        ).setOrigin(1, 0.5);

        // Make sliders interactive
        const makeSliderInteractive = (slider, fill, text, volumeVar) => {
            slider.setInteractive();
            
            slider.on('pointerdown', (pointer) => {
                const newVolume = (pointer.x - slider.x + slider.width/2) / slider.width;
                volumeVar = Math.max(0, Math.min(1, newVolume));
                fill.width = volumeVar * slider.width;
                fill.x = slider.x - slider.width/2;
                text.setText(`${Math.round(volumeVar * 100)}%`);
                
                if (slider === musicSlider) {
                    menuMusic.setVolume(volumeVar);
                }
            });

            slider.on('pointermove', (pointer) => {
                if (pointer.isDown) {
                    const newVolume = (pointer.x - slider.x + slider.width/2) / slider.width;
                    volumeVar = Math.max(0, Math.min(1, newVolume));
                    fill.width = volumeVar * slider.width;
                    fill.x = slider.x - slider.width/2;
                    text.setText(`${Math.round(volumeVar * 100)}%`);
                    
                    if (slider === musicSlider) {
                        menuMusic.setVolume(volumeVar);
                    }
                }
            });
        };

        makeSliderInteractive(musicSlider, musicFill, musicVolumeText, musicVolume);
        makeSliderInteractive(sfxSlider, sfxFill, sfxVolumeText, sfxVolume);

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