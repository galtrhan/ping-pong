// for custom web font loading

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    init() {
        const element = document.createElement('style');
        document.head.appendChild(element);
        const sheet = element.sheet;
        const styles = '@font-face { font-family: "kenney-mini"; src: url("assets/Kenney Mini Square.ttf") format("truetype"); }';
        sheet.insertRule(styles, 0);
    }

    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        window.WebFont.load({
            custom: {
                families: ['kenney-mini'],
                urls: ['assets/Kenney Mini Square.ttf']
            },
            active: () => {
                this.scene.start('LoadingScene');
            },
            inactive: () => {
                console.warn('Font failed to load, using fallback');
                this.scene.start('LoadingScene');
            }
        });
    }
} 