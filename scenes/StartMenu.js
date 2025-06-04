import {
    config,
    _,
    menuMusic,
    setMenuMusic,
    musicMuted,
    musicVolume,
} from '../game.js';

export default class StartMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'StartMenu' });
    }

    create() {
        this.clickSound = this.sound.add('click');
        this.hoverSound = this.sound.add('hover');
        
        if (!menuMusic) {
            const music = this.sound.add('music', {
                volume: musicMuted ? 0 : musicVolume,
                loop: true
            });
            music.play();
            setMenuMusic(music);
        } else {
            menuMusic.setVolume(musicMuted ? 0 : musicVolume);
        }

        this.add.text(config.width / 2, config.height / 4, 'PING PONG', {
            ... _.styles.text,
            fontSize: '64px',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        _.createButton(
            this,
            config.width / 2,
            config.height / 2,
            'PLAY',
            () => {
                this.scene.start('GameScene');
            },
        );

        _.createButton(
            this,
            config.width / 2,
            config.height / 2 + 80,
            'HIGH SCORES',
            () => {
                this.scene.start('HighScores');
            },
        );

        _.createButton(
            this,
            config.width / 2,
            config.height / 2 + 160,
            'OPTIONS',
            () => {
                this.scene.start('OptionsScene');
            }
        );

    }
} 