class AudioManager {
    constructor(scene) {
        if (AudioManager.instance) {
            AudioManager.instance.scene = scene;
            if (!scene.sound.get("click")) {
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
        this.updateVolumes();

        AudioManager.instance = this;
    }

    initializeSounds(scene) {
        this.sounds = {};
        for (const key of ["click", "hover", "hit", "score"]) {
            this.sounds[key] = scene.sound.add(key);
        }
    }

    updateVolumes() {
        if (this.menuMusic) {
            this.menuMusic.setVolume(this.musicMuted ? 0 : this.musicVolume);
        }

        const volume = this.sfxMuted ? 0 : this.sfxVolume;
        for (const sound of Object.values(this.sounds)) {
            sound.setVolume(volume);
        }
    }

    ensureMusicPlaying() {
        if (this.menuMusic) {
            this.menuMusic.setVolume(this.musicMuted ? 0 : this.musicVolume);
            return;
        }

        try {
            this.menuMusic = this.scene.sound.add("music", {
                volume: this.musicMuted ? 0 : this.musicVolume,
                loop: true,
            });
            this.menuMusic.play()?.catch?.((error) => {
                console.log("Music autoplay prevented by browser:", error);
            });
        } catch (error) {
            console.log("Failed to create music:", error);
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

    play(key) {
        this.sounds[key]?.play();
    }
}

export default AudioManager;
