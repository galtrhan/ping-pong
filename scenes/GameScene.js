import {
    config,
    _,
    AudioManager,
    BALL_SPEED,
    SPEED_INCREASE,
    WINNING_SCORE,
    MAX_SPEED,
    PADDLE_SPEED,
    AI_SPEED,
} from "../game.js";
import BaseScene from "./BaseScene.js";

export default class GameScene extends BaseScene {
    constructor() {
        super({ key: "GameScene" });
    }

    preload() {
        this.add
            .graphics()
            .fillStyle(0xffffff, 1)
            .fillRect(0, 0, 10, 10)
            .generateTexture("pixel", 10, 10)
            .destroy();
    }

    init(data) {
        this.gameMode = data.mode || "single";
        this.playerScore = 0;
        this.aiScore = 0;
        this.gameTimer = 0;
        this.gameActive = true;
        this.ballDirection = 1;
        this.currentBallSpeed = BALL_SPEED;
        this.isPaused = false;

        this.highScores = [];
        try {
            this.highScores =
                JSON.parse(localStorage.getItem("pingPongHighScores")) || [];
        } catch (e) {
            console.warn("Failed to load high scores from localStorage:", e);
        }
    }

    create() {
        this.fadeIn();

        this.audio = new AudioManager(this);
        this.audio.ensureMusicPlaying();

        this.player = this.add.rectangle(
            50,
            config.height / 2,
            20,
            100,
            0xffffff,
        );
        this.physics.add.existing(this.player, true);

        this.ai = this.add.rectangle(
            config.width - 50,
            config.height / 2,
            20,
            100,
            0xffffff,
        );
        this.physics.add.existing(this.ai, true);

        this.add
            .rectangle(config.width / 2, config.height / 2, 3, config.height - 100, 0xffffff)
            .setAlpha(0.75);

        this.ball = this.add.rectangle(
            config.width / 2,
            config.height / 2,
            20,
            20,
            0xffffff,
        );
        this.physics.add.existing(this.ball);
        this.ball.body.setCollideWorldBounds(true, 1, 1);
        this.ball.body.setBounce(1, 1);
        this.resetBall();

        this.physics.add.collider(
            this.ball,
            this.player,
            this.ballHitPaddle,
            null,
            this,
        );
        this.physics.add.collider(
            this.ball,
            this.ai,
            this.ballHitPaddle,
            null,
            this,
        );

        this.setupInput();
        this.setupUI();

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true,
        });

        this.createPauseMenu();

        this.hitParticles = this.add.particles(0, 0, "pixel", {
            frame: "white",
            lifespan: 800,
            speed: { min: 50, max: 150 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            blendMode: "ADD",
            frequency: -1,
        });
        this.hitParticles.setDepth(1);
    }

    setupInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.escKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC,
        );
        this.player1Up = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.A,
        );
        this.player1Down = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.Z,
        );
        this.player2Up = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.K,
        );
        this.player2Down = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.M,
        );
    }

    setupUI() {
        this.scoreText = this.add
            .text(80, 30, "0 : 0", _.styles.text)
            .setOrigin(0.5);

        this.timerText = this.add
            .text(config.width - 100, 30, "TIME: 0s", {
                ..._.styles.text,
                fontSize: "24px",
            })
            .setOrigin(0.5);

        this.speedText = this.add
            .text(config.width - 100, 70, "SPEED: +0%", {
                ..._.styles.text,
                fontSize: "24px",
            })
            .setOrigin(0.5);

        const controlsText =
            this.gameMode === "single"
                ? "Controls: Arrow Keys (Player 1)"
                : "Controls: A/Z (Player 1), K/M (Player 2)";

        this.add
            .text(config.width / 2, config.height - 30, controlsText, {
                ..._.styles.text,
                fontSize: "16px",
            })
            .setOrigin(0.5);
    }

    createPauseMenu() {
        this.pauseBg = this.add
            .rectangle(
                config.width / 2,
                config.height / 2,
                config.width,
                config.height,
                0x000000,
                0.7,
            )
            .setVisible(false)
            .setInteractive();

        this.pauseMenu = this.add
            .container(config.width / 2, config.height / 2)
            .setVisible(false);

        const pauseTitle = this.add
            .text(0, -100, "PAUSED", {
                ..._.styles.text,
                fontSize: "48px",
            })
            .setOrigin(0.5);

        const resumeButton = _.createButton(this, 0, 0, "RESUME", () => {
            this.togglePause();
        });

        const menuButton = _.createButton(this, 0, 60, "MAIN MENU", () => {
            this.goTo("StartMenu");
        });

        this.pauseMenu.add([pauseTitle, resumeButton, menuButton]);
    }

    togglePause() {
        this.isPaused = !this.isPaused;

        this.physics[this.isPaused ? "pause" : "resume"]();
        this.timerEvent.paused = this.isPaused;
        this.pauseBg.setVisible(this.isPaused);
        this.pauseMenu.setVisible(this.isPaused);

        if (this.isPaused) {
            this.pauseBg.setDepth(999);
            this.pauseMenu.setDepth(1000);
        }
    }

    updateTimer() {
        if (!this.gameActive) return;

        this.gameTimer++;
        this.timerText.setText(`TIME: ${this.gameTimer}s`);

        if (this.currentBallSpeed >= MAX_SPEED) return;

        this.currentBallSpeed = Math.min(
            this.currentBallSpeed + SPEED_INCREASE,
            MAX_SPEED,
        );
        const speedIncreasePercent = Math.round(
            ((this.currentBallSpeed - BALL_SPEED) / BALL_SPEED) * 100,
        );
        this.speedText.setText(`SPEED: +${speedIncreasePercent}%`);

        const { x, y } = this.ball.body.velocity;
        if (x === 0 && y === 0) return;

        const angle = Math.atan2(y, x);
        this.ball.body.velocity.x = Math.cos(angle) * this.currentBallSpeed;
        this.ball.body.velocity.y = Math.sin(angle) * this.currentBallSpeed;
    }

    resetBall() {
        this.ball.x = config.width / 2;
        this.ball.y = config.height / 2;
        this.ball.fillColor = 0xffffff;
        this.ball.body.setVelocity(0, 0);
        this.startCountdown();
    }

    startCountdown() {
        const steps = ["READY?", "GO!"];
        let index = 0;

        const showNext = () => {
            if (index >= steps.length) {
                this.ball.body.setVelocity(
                    this.currentBallSpeed * this.ballDirection,
                    0,
                );
                this.ballDirection *= -1;
                return;
            }

            const text = this.add
                .text(config.width / 2, config.height / 2, steps[index], {
                    ..._.styles.text,
                    fontSize: "120px",
                    fontStyle: "bold",
                })
                .setOrigin(0.5)
                .setScale(2);

            this.tweens.add({
                targets: text,
                scale: 1,
                alpha: 0,
                duration: 800,
                ease: "Power2",
                onComplete: () => {
                    text.destroy();
                    index++;
                    setTimeout(showNext, index < steps.length ? 200 : 500);
                },
            });
        };

        showNext();
    }

    ballHitPaddle(ball, paddle) {
        this.audio.play("hit");
        this.hitParticles.explode(10, ball.x, ball.y);

        const hitPosition =
            (ball.y - (paddle.y - paddle.height / 2)) / paddle.height;
        const angle = Phaser.Math.DegToRad(
            Phaser.Math.Clamp(Math.round((hitPosition - 0.5) * 5) * 30, -60, 60),
        );

        const speed = Math.hypot(ball.body.velocity.x, ball.body.velocity.y);
        const xDirection = paddle === this.player ? 1 : -1;

        ball.body.velocity.x = Math.cos(angle) * speed * xDirection;
        ball.body.velocity.y = Math.sin(angle) * speed;
    }

    update() {
        if (this.isPaused || !this.gameActive) return;

        this.handleInput();
        this.updatePaddles();
        this.checkScoring();
        this.checkGameOver();
    }

    handleInput() {
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.togglePause();
        }
    }

    updatePaddles() {
        const playerUp =
            this.gameMode === "single" ? this.cursors.up : this.player1Up;
        const playerDown =
            this.gameMode === "single" ? this.cursors.down : this.player1Down;

        if (playerUp.isDown) {
            this.player.y -= PADDLE_SPEED;
        } else if (playerDown.isDown) {
            this.player.y += PADDLE_SPEED;
        }

        if (this.gameMode === "single") {
            if (this.ball.y < this.ai.y) {
                this.ai.y -= AI_SPEED;
            } else if (this.ball.y > this.ai.y) {
                this.ai.y += AI_SPEED;
            }
        } else if (this.player2Up.isDown) {
            this.ai.y -= PADDLE_SPEED;
        } else if (this.player2Down.isDown) {
            this.ai.y += PADDLE_SPEED;
        }

        for (const paddle of [this.player, this.ai]) {
            paddle.y = Phaser.Math.Clamp(
                paddle.y,
                paddle.height / 2,
                config.height - paddle.height / 2,
            );
            paddle.body.updateFromGameObject();
        }
    }

    checkScoring() {
        if (this.ball.x < 20) {
            this.aiScore++;
        } else if (this.ball.x > config.width - 20) {
            this.playerScore++;
        } else {
            return;
        }

        this.updateScore();
        this.audio.play("score");
        this.resetBall();
    }

    checkGameOver() {
        if (
            this.playerScore >= WINNING_SCORE ||
            this.aiScore >= WINNING_SCORE
        ) {
            this.gameOver();
        }
    }

    updateScore() {
        this.scoreText.setText(`${this.playerScore} : ${this.aiScore}`);
    }

    createNameInput() {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter your name";
        try {
            input.value = localStorage.getItem("lastPlayerName") || "";
        } catch (e) {
            console.warn("Failed to load last player name:", e);
        }
        input.style.cssText =
            "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);" +
            "padding:10px;font-size:20px;width:200px;text-align:center;z-index:10000;" +
            "border:2px solid black;border-radius:5px;background-color:white;color:black;" +
            "outline:none;font-family:kenney-mini,monospace;font-weight:normal";
        document.body.appendChild(input);
        input.focus();

        const stop = (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
        };
        input.addEventListener("keydown", (e) => {
            stop(e);
            if (e.key === "Enter") input.blur();
        });
        input.addEventListener("keypress", stop);
        input.addEventListener("keyup", stop);

        this.currentNameInput = input;
        return input;
    }

    gameOver() {
        this.gameActive = false;

        const newScore = {
            playerScore: this.playerScore,
            aiScore: this.aiScore,
            time: this.gameTimer,
            date: new Date().toLocaleDateString(),
            name: "Player",
        };

        this.highScores.push(newScore);
        this.highScores.sort(
            (a, b) => b.playerScore - a.playerScore || a.time - b.time,
        );
        const rank = this.highScores.indexOf(newScore) + 1;
        const isTop10 = rank <= 10;
        this.highScores = this.highScores.slice(0, 10);

        this.add
            .text(config.width / 2, config.height / 2 - 150, "GAME OVER!", {
                ..._.styles.text,
                fontSize: "48px",
            })
            .setOrigin(0.5);

        this.add
            .text(
                config.width / 2,
                config.height / 2 - 80,
                `Final Score: ${this.playerScore} - ${this.aiScore}\nTime: ${this.gameTimer}s\nRank: #${rank}`,
                { ..._.styles.text, align: "center" },
            )
            .setOrigin(0.5);

        const nameInput = isTop10 ? this.createNameInput() : null;

        const saveScore = () => {
            if (!isTop10 || !nameInput?.parentNode) return;

            const playerName = (nameInput.value.trim() || "Player").replace(
                /[<>]/g,
                "",
            );
            newScore.name = playerName;

            try {
                localStorage.setItem("lastPlayerName", playerName);
            } catch (e) {
                console.warn("Failed to save player name:", e);
            }

            try {
                localStorage.setItem(
                    "pingPongHighScores",
                    JSON.stringify(this.highScores),
                );
            } catch (e) {
                console.warn("Failed to save high scores:", e);
            }

            this.cleanupNameInput();
        };

        const finish = (target, data) => {
            saveScore();
            this.goTo(target, data);
        };

        _.createButton(
            this,
            config.width / 2,
            config.height / 2 + 60,
            "SAVE & CONTINUE",
            () => finish("HighScores"),
        );

        _.createButton(
            this,
            config.width / 2,
            config.height / 2 + 140,
            "PLAY AGAIN",
            () => finish("GameScene", { mode: this.gameMode }),
        );

        _.createButton(
            this,
            config.width / 2,
            config.height / 2 + 220,
            "MAIN MENU",
            () => finish("StartMenu"),
        );
    }

    cleanupNameInput() {
        if (!this.currentNameInput?.parentNode) return;

        try {
            document.body.removeChild(this.currentNameInput);
        } catch (e) {
            console.warn("Input element already removed:", e);
        }
        this.currentNameInput = null;
    }

    shutdown() {
        this.cleanupNameInput();
    }
}
