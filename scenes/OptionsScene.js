import { menuMusic, musicMuted, musicVolume, sfxVolume, sfxMuted, config, setMenuMusic } from '../game.js';

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
            fontSize: '48px',
            color: '#fff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Music Volume
        this.add.text(config.width / 2 - 150, 150, 'Music Volume:', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'monospace'
        }).setOrigin(0, 0.5);

        // Music Volume Slider
        const musicSlider = this.add.rectangle(config.width / 2 + 50, 150, 200, 20, 0x444444);
        const musicFill = this.add.rectangle(
            config.width / 2 + 50 - 100 + (musicVolume * 200),
            150,
            musicVolume * 200,
            20,
            0xffffff
        );
        musicFill.setOrigin(0, 0.5);

        // Music Volume Text
        const musicVolumeText = this.add.text(
            config.width / 2 + 160,
            150,
            `${Math.round(musicVolume * 100)}%`,
            {
                fontSize: '20px',
                color: '#fff',
                fontFamily: 'monospace'
            }
        ).setOrigin(0, 0.5);

        // Music Mute Button
        const musicMuteButton = this.add.text(
            config.width / 2 + 200,
            150,
            musicMuted ? '🔇' : '🔊',
            {
                fontSize: '24px',
                color: '#fff',
                fontFamily: 'monospace'
            }
        ).setOrigin(0, 0.5).setInteractive();

        // SFX Volume
        this.add.text(config.width / 2 - 150, 200, 'SFX Volume:', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'monospace'
        }).setOrigin(0, 0.5);

        // SFX Volume Slider
        const sfxSlider = this.add.rectangle(config.width / 2 + 50, 200, 200, 20, 0x444444);
        const sfxFill = this.add.rectangle(
            config.width / 2 + 50 - 100 + (sfxVolume * 200),
            200,
            sfxVolume * 200,
            20,
            0xffffff
        );
        sfxFill.setOrigin(0, 0.5);

        // SFX Volume Text
        const sfxVolumeText = this.add.text(
            config.width / 2 + 160,
            200,
            `${Math.round(sfxVolume * 100)}%`,
            {
                fontSize: '20px',
                color: '#fff',
                fontFamily: 'monospace'
            }
        ).setOrigin(0, 0.5);

        // SFX Mute Button
        const sfxMuteButton = this.add.text(
            config.width / 2 + 200,
            200,
            sfxMuted ? '🔇' : '🔊',
            {
                fontSize: '24px',
                color: '#fff',
                fontFamily: 'monospace'
            }
        ).setOrigin(0, 0.5).setInteractive();

        // Make sliders interactive
        const makeSliderInteractive = (slider, fill, text, volumeVar, muteVar, muteButton) => {
            slider.setInteractive();
            
            slider.on('pointerdown', (pointer) => {
                const newVolume = (pointer.x - slider.x + slider.width/2) / slider.width;
                volumeVar = Math.max(0, Math.min(1, newVolume));
                fill.width = volumeVar * slider.width;
                fill.x = slider.x - slider.width/2;
                text.setText(`${Math.round(volumeVar * 100)}%`);
                
                if (!muteVar) {
                    if (slider === musicSlider) {
                        menuMusic.setVolume(volumeVar);
                    }
                }
            });

            slider.on('pointermove', (pointer) => {
                if (pointer.isDown) {
                    const newVolume = (pointer.x - slider.x + slider.width/2) / slider.width;
                    volumeVar = Math.max(0, Math.min(1, newVolume));
                    fill.width = volumeVar * slider.width;
                    fill.x = slider.x - slider.width/2;
                    text.setText(`${Math.round(volumeVar * 100)}%`);
                    
                    if (!muteVar) {
                        if (slider === musicSlider) {
                            menuMusic.setVolume(volumeVar);
                        }
                    }
                }
            });

            muteButton.on('pointerdown', () => {
                muteVar = !muteVar;
                muteButton.setText(muteVar ? '🔇' : '🔊');
                
                if (slider === musicSlider) {
                    menuMusic.setVolume(muteVar ? 0 : volumeVar);
                }
            });
        };

        makeSliderInteractive(musicSlider, musicFill, musicVolumeText, musicVolume, musicMuted, musicMuteButton);
        makeSliderInteractive(sfxSlider, sfxFill, sfxVolumeText, sfxVolume, sfxMuted, sfxMuteButton);

        // Back button
        const backButton = this.add.text(config.width / 2, config.height - 50, 'Back to Menu', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'monospace',
            backgroundColor: '#444',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();
        
        backButton.on('pointerover', () => {
            backButton.setStyle({ backgroundColor: '#666' });
            this.hoverSound.play();
        });

        backButton.on('pointerout', () => {
            backButton.setStyle({ backgroundColor: '#444' });
        });

        backButton.on('pointerdown', () => {
            this.clickSound.play();
            this.scene.start('StartMenu');
        });
    }
} 