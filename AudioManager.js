class AudioManager {
    constructor(scene) {
        if (AudioManager.instance) {
            // If an instance exists, just update the scene reference
            AudioManager.instance.scene = scene;
            // Re-initialize sounds if they don't exist for this scene
            if (!AudioManager.instance.clickSound || !scene.sound.get("click")) {
                AudioManager.instance.initializeSounds(scene);
            }
            return AudioManager.instance;
        }

        this.scene = scene;
        this.menuMusic = null;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.5;
        this.musicMuted = false;
        this.sfxMuted = false;

        this.initializeSounds(scene);

        // Set initial volumes
        this.updateVolumes();

        // Store the instance
        AudioManager.instance = this;
    }

    initializeSounds(scene) {
        // Load sound effects with error handling
        try {
            this.clickSound = scene.sound.add("click");
            this.hoverSound = scene.sound.add("hover");
            this.hitSound = scene.sound.add("hit");
            this.scoreSound = scene.sound.add("score");
        } catch (e) {
            console.warn("Failed to initialize some sounds:", e);
        }
    }

    updateVolumes() {
        // Update music volume
        if (this.menuMusic) {
            this.menuMusic.setVolume(this.musicMuted ? 0 : this.musicVolume);
        }

        // Update SFX volumes with null checks
        const sfxVolume = this.sfxMuted ? 0 : this.sfxVolume;
        this.clickSound && this.clickSound.setVolume(sfxVolume);
        this.hoverSound && this.hoverSound.setVolume(sfxVolume);
        this.hitSound && this.hitSound.setVolume(sfxVolume);
        this.scoreSound && this.scoreSound.setVolume(sfxVolume);
    }

    ensureMusicPlaying() {
        if (!this.menuMusic) {
            try {
                const music = this.scene.sound.add("music", {
                    volume: this.musicMuted ? 0 : this.musicVolume,
                    loop: true,
                });

                // Try to play, but handle autoplay restrictions
                const playPromise = music.play();
                if (playPromise && typeof playPromise.then === "function") {
                    playPromise.catch((error) => {
                        console.log("Music autoplay prevented by browser:", error);
                        // Music will start when user interacts with the page
                    });
                }
                this.menuMusic = music;
            } catch (error) {
                console.log("Failed to create music:", error);
            }
        } else {
            this.menuMusic.setVolume(this.musicMuted ? 0 : this.musicVolume);
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
    }

    toggleMusicMute() {
        this.musicMuted = !this.musicMuted;
        this.updateVolumes();
    }

    toggleSFXMute() {
        this.sfxMuted = !this.sfxMuted;
        this.updateVolumes();
    }

    playClick() {
        try {
            this.clickSound && this.clickSound.play();
        } catch (e) {
            console.log("Click sound failed:", e);
        }
    }

    playHover() {
        try {
            this.hoverSound && this.hoverSound.play();
        } catch (e) {
            console.log("Hover sound failed:", e);
        }
    }

    playHit() {
        try {
            this.hitSound && this.hitSound.play();
        } catch (e) {
            console.log("Hit sound failed:", e);
        }
    }

    playScore() {
        try {
            this.scoreSound && this.scoreSound.play();
        } catch (e) {
            console.log("Score sound failed:", e);
        }
    }

    destroy() {
        if (this.menuMusic) {
            this.menuMusic.stop();
            this.menuMusic.destroy();
            this.menuMusic = null;
        }
        AudioManager.instance = null;
    }
}

export default AudioManager;
