export default class BaseScene extends Phaser.Scene {
    fadeIn() {
        this.cameras.main.setAlpha(0);
        this.tweens.add({
            targets: this.cameras.main,
            alpha: 1,
            duration: 300,
            ease: "Power2",
            delay: 100,
        });
    }

    goTo(target, data, duration = 300) {
        this.scene.transition({
            target,
            duration,
            moveAbove: true,
            data,
            onUpdate: (progress) => {
                this.cameras.main.setAlpha(1 - progress);
            },
        });
    }
}
