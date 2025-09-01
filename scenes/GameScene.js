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

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    // Create programmatic textures for particles during preload
    this.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRect(0, 0, 10, 10)
      .generateTexture("pixel", 10, 10)
      .destroy();
  }

  init(data) {
    // Use scene data management
    this.registry.set("gameMode", data.mode || "single");
    this.registry.set("playerScore", 0);
    this.registry.set("aiScore", 0);
    this.registry.set("gameTimer", 0);
    this.registry.set("gameActive", true);

    this.gameMode = data.mode || "single";
    this.playerScore = 0;
    this.aiScore = 0;
    this.gameTimer = 0;
    this.gameActive = true;

    try {
      this.highScores =
        JSON.parse(localStorage.getItem("pingPongHighScores")) || [];
    } catch (e) {
      console.warn("Failed to load high scores from localStorage:", e);
      this.highScores = [];
    }
    this.ballDirection = 1; // 1 for right, -1 for left
    this.currentBallSpeed = BALL_SPEED;
    this.isPaused = false;
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

    // Create groups for better object management
    this.paddles = this.add.group();
    this.uiElements = this.add.group();

    // Player paddle
    this.player = this.add.rectangle(50, config.height / 2, 20, 100, 0xffffff);
    this.physics.add.existing(this.player, true);
    this.paddles.add(this.player);

    // AI/Second player paddle
    this.ai = this.add.rectangle(
      config.width - 50,
      config.height / 2,
      20,
      100,
      0xffffff,
    );
    this.physics.add.existing(this.ai, true);
    this.paddles.add(this.ai);

    // Center line
    const centerLine = this.add.rectangle(
      config.width / 2,
      config.height / 2,
      3,
      config.height - 100,
      0xffffff,
    );
    centerLine.setAlpha(0.75);
    this.uiElements.add(centerLine);

    // Ball
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

    // Collisions
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

    // Input setup
    this.setupInput();

    // UI setup
    this.setupUI();

    // Timer event
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    // Create pause menu (initially hidden)
    this.createPauseMenu();

    // Setup particles (now texture exists from preload)
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
    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.escKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC,
    );

    // Player 1 controls (A and Z)
    this.player1Up = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A,
    );
    this.player1Down = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Z,
    );

    // Player 2 controls (K and M)
    this.player2Up = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.K,
    );
    this.player2Down = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.M,
    );
  }

  setupUI() {
    // Score
    this.scoreText = this.add
      .text(80, 30, "0 : 0", _.styles.text)
      .setOrigin(0.5);
    this.uiElements.add(this.scoreText);

    // Timer
    this.timerText = this.add
      .text(config.width - 100, 30, "TIME: 0s", {
        ..._.styles.text,
        fontSize: "24px",
      })
      .setOrigin(0.5);
    this.uiElements.add(this.timerText);

    // Speed display
    this.speedText = this.add
      .text(config.width - 100, 70, "SPEED: +0%", {
        ..._.styles.text,
        fontSize: "24px",
      })
      .setOrigin(0.5);
    this.uiElements.add(this.speedText);

    // Add control instructions
    const controlsText =
      this.gameMode === "single"
        ? "Controls: Arrow Keys (Player 1)"
        : "Controls: A/Z (Player 1), K/M (Player 2)";

    const controlsLabel = this.add
      .text(config.width / 2, config.height - 30, controlsText, {
        ..._.styles.text,
        fontSize: "16px",
      })
      .setOrigin(0.5);
    this.uiElements.add(controlsLabel);
  }

  createPauseMenu() {
    // Create a semi-transparent background
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

    // Create pause menu container
    this.pauseMenu = this.add
      .container(config.width / 2, config.height / 2)
      .setVisible(false);

    // Pause title
    const pauseTitle = this.add
      .text(0, -100, "PAUSED", {
        ..._.styles.text,
        fontSize: "48px",
      })
      .setOrigin(0.5);

    // Resume button
    const resumeButton = _.createButton(this, 0, 0, "RESUME", () => {
      this.togglePause();
    });

    // Main menu button
    const menuButton = _.createButton(this, 0, 60, "MAIN MENU", () => {
      this.scene.transition({
        target: "StartMenu",
        duration: 300,
        moveAbove: true,
        onUpdate: (progress) => {
          this.cameras.main.setAlpha(1 - progress);
        },
      });
    });

    this.pauseMenu.add([pauseTitle, resumeButton, menuButton]);
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      // Pause the game
      this.physics.pause();
      this.timerEvent.paused = true;
      this.pauseBg.setVisible(true);
      this.pauseMenu.setVisible(true);

      // Ensure the pause menu is on top
      this.pauseMenu.setDepth(1000);
      this.pauseBg.setDepth(999);
    } else {
      // Resume the game
      this.physics.resume();
      this.timerEvent.paused = false;
      this.pauseBg.setVisible(false);
      this.pauseMenu.setVisible(false);
    }
  }

  updateTimer() {
    if (this.gameActive) {
      this.gameTimer++;
      this.registry.set("gameTimer", this.gameTimer);
      this.timerText.setText(`TIME: ${this.gameTimer}s`);

      // Increase ball speed with maximum limit
      if (this.currentBallSpeed < MAX_SPEED) {
        this.currentBallSpeed = Math.min(
          this.currentBallSpeed + SPEED_INCREASE,
          MAX_SPEED,
        );
        const speedIncreasePercent = Math.round(
          ((this.currentBallSpeed - BALL_SPEED) / BALL_SPEED) * 100,
        );
        this.speedText.setText(`SPEED: +${speedIncreasePercent}%`);

        // Update ball velocity while maintaining direction (only if ball is moving)
        if (
          this.ball.body.velocity.x !== 0 ||
          this.ball.body.velocity.y !== 0
        ) {
          const angle = Math.atan2(
            this.ball.body.velocity.y,
            this.ball.body.velocity.x,
          );
          this.ball.body.velocity.x = Math.cos(angle) * this.currentBallSpeed;
          this.ball.body.velocity.y = Math.sin(angle) * this.currentBallSpeed;
        }
      }
    }
  }

  resetBall() {
    this.ball.x = config.width / 2;
    this.ball.y = config.height / 2;
    // Reset ball color to white
    this.ball.fillColor = 0xffffff;
    // Stop the ball
    this.ball.body.setVelocity(0, 0);
    // Start countdown
    this.startCountdown();
  }

  startCountdown() {
    const countdownNumbers = ["READY?", "GO!"];
    let currentIndex = 0;

    const showNumber = () => {
      if (currentIndex >= countdownNumbers.length) {
        // Launch the ball after countdown
        this.ball.body.setVelocity(
          this.currentBallSpeed * this.ballDirection,
          0,
        );
        // Reverse direction for next serve
        this.ballDirection *= -1;
        return;
      }

      const number = countdownNumbers[currentIndex];
      const text = this.add
        .text(config.width / 2, config.height / 2, number.toString(), {
          ..._.styles.text,
          fontSize: "120px",
          fontStyle: "bold",
        })
        .setOrigin(0.5);

      // Initial scale
      text.setScale(2);

      // Animate the countdown number
      this.tweens.add({
        targets: text,
        scale: 1,
        alpha: 0,
        duration: 800,
        ease: "Power2",
        onComplete: () => {
          text.destroy();
          currentIndex++;
          if (currentIndex < countdownNumbers.length) {
            setTimeout(showNumber, 200);
          } else {
            setTimeout(showNumber, 500);
          }
        },
      });
    };

    showNumber();
  }

  ballHitPaddle(ball, paddle) {
    // Play hit sound
    this.audio.playHit();

    // Emit particles at the ball's position
    this.hitParticles.explode(10, ball.x, ball.y);

    // Calculate where the ball hit the paddle (0 to 1, where 0.5 is center)
    const hitPosition =
      (ball.y - (paddle.y - paddle.height / 2)) / paddle.height;

    // Calculate angle based on hit position
    // Center hits (0.4-0.6) will be more horizontal
    // Edge hits (0-0.2 or 0.8-1) will be more vertical
    let angle;
    if (hitPosition < 0.2) {
      // Top edge - angle up
      angle = -60;
    } else if (hitPosition < 0.4) {
      // Upper middle - slight angle up
      angle = -30;
    } else if (hitPosition < 0.6) {
      // Center - mostly horizontal
      angle = 0;
    } else if (hitPosition < 0.8) {
      // Lower middle - slight angle down
      angle = 30;
    } else {
      // Bottom edge - angle down
      angle = 60;
    }

    // Convert angle to radians
    const angleRad = Phaser.Math.DegToRad(angle);

    // Calculate new velocity based on angle
    const speed = Math.sqrt(
      ball.body.velocity.x * ball.body.velocity.x +
        ball.body.velocity.y * ball.body.velocity.y,
    );

    // Set new velocity with the calculated angle
    // Maintain the same speed but change direction
    // Always ensure x velocity moves towards opponent's side
    const xDirection = paddle === this.player ? 1 : -1;
    ball.body.velocity.x = Math.cos(angleRad) * speed * xDirection;
    ball.body.velocity.y = Math.sin(angleRad) * speed;
  }

  update() {
    if (this.isPaused || !this.gameActive) return;

    this.handleInput();
    this.updatePaddles();
    this.checkScoring();
    this.checkGameOver();
  }

  handleInput() {
    // Check for pause toggle
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.togglePause();
    }
  }

  updatePaddles() {
    // Player 1 movement
    if (this.gameMode === "single") {
      // Single player mode - use arrow keys
      if (this.cursors.up.isDown) {
        this.player.y -= PADDLE_SPEED;
      } else if (this.cursors.down.isDown) {
        this.player.y += PADDLE_SPEED;
      }
    } else {
      // Multiplayer mode - use A/Z keys
      if (this.player1Up.isDown) {
        this.player.y -= PADDLE_SPEED;
      } else if (this.player1Down.isDown) {
        this.player.y += PADDLE_SPEED;
      }
    }
    // Clamp player 1 paddle
    this.player.y = Phaser.Math.Clamp(
      this.player.y,
      this.player.height / 2,
      config.height - this.player.height / 2,
    );
    this.player.body.updateFromGameObject();

    // Player 2/AI movement
    if (this.gameMode === "single") {
      // AI movement (simple follow)
      if (this.ball.y < this.ai.y) {
        this.ai.y -= AI_SPEED;
      } else if (this.ball.y > this.ai.y) {
        this.ai.y += AI_SPEED;
      }
    } else {
      // Player 2 movement (K and M keys)
      if (this.player2Up.isDown) {
        this.ai.y -= PADDLE_SPEED;
      } else if (this.player2Down.isDown) {
        this.ai.y += PADDLE_SPEED;
      }
    }
    // Clamp player 2/AI paddle
    this.ai.y = Phaser.Math.Clamp(
      this.ai.y,
      this.ai.height / 2,
      config.height - this.ai.height / 2,
    );
    this.ai.body.updateFromGameObject();
  }

  checkScoring() {
    // Check for scoring
    if (this.ball.x < 20) {
      this.aiScore++;
      this.registry.set("aiScore", this.aiScore);
      this.updateScore();
      this.audio.playScore();
      this.resetBall();
    } else if (this.ball.x > config.width - 20) {
      this.playerScore++;
      this.registry.set("playerScore", this.playerScore);
      this.updateScore();
      this.audio.playScore();
      this.resetBall();
    }
  }

  checkGameOver() {
    // Check for game over
    if (this.playerScore >= WINNING_SCORE || this.aiScore >= WINNING_SCORE) {
      this.gameOver();
    }
  }

  updateScore() {
    this.scoreText.setText(`${this.playerScore} : ${this.aiScore}`);
  }

  gameOver() {
    this.gameActive = false;
    this.registry.set("gameActive", false);

    // Add current score to high scores
    const newScore = {
      playerScore: this.playerScore,
      aiScore: this.aiScore,
      time: this.gameTimer,
      date: new Date().toLocaleDateString(),
      name: "Player", // Default name until input
    };

    this.highScores.push(newScore);

    // Sort high scores (by player score descending, then by time ascending)
    this.highScores.sort((a, b) => {
      if (a.playerScore !== b.playerScore) {
        return b.playerScore - a.playerScore;
      }
      return a.time - b.time;
    });

    // Find the rank of the current score
    const currentRank =
      this.highScores.findIndex(
        (score) =>
          score.playerScore === this.playerScore &&
          score.aiScore === this.aiScore &&
          score.time === this.gameTimer,
      ) + 1;

    // Keep only top 10 scores
    this.highScores = this.highScores.slice(0, 10);

    // Check if the current score made it to top 10
    const isTop10 = currentRank <= 10;

    // Display game over screen
    const gameOverText = this.add
      .text(config.width / 2, config.height / 2 - 150, "GAME OVER!", {
        ..._.styles.text,
        fontSize: "48px",
      })
      .setOrigin(0.5);

    const finalScoreText = this.add
      .text(
        config.width / 2,
        config.height / 2 - 80,
        `Final Score: ${this.playerScore} - ${this.aiScore}\nTime: ${this.gameTimer}s\nRank: #${currentRank}`,
        {
          ..._.styles.text,
          align: "center",
        },
      )
      .setOrigin(0.5);

    let nameInput;
    if (isTop10) {
      // Create name input only for top 10 scores
      nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.placeholder = "Enter your name";
      try {
        nameInput.value = localStorage.getItem("lastPlayerName") || "";
      } catch (e) {
        console.warn("Failed to load last player name:", e);
        nameInput.value = "";
      }
      nameInput.style.position = "absolute";
      nameInput.style.left = "50%";
      nameInput.style.top = "50%";
      nameInput.style.transform = "translate(-50%, -50%)";
      nameInput.style.padding = "10px";
      nameInput.style.fontSize = "20px";
      nameInput.style.width = "200px";
      nameInput.style.textAlign = "center";
      nameInput.style.zIndex = "10000";
      nameInput.style.border = "2px solid black";
      nameInput.style.borderRadius = "5px";
      nameInput.style.backgroundColor = "white";
      nameInput.style.color = "black";
      nameInput.style.outline = "none";
      nameInput.style.fontFamily = "kenney-mini, monospace";
      nameInput.style.fontWeight = "normal";
      document.body.appendChild(nameInput);

      // Focus the input and prevent event propagation
      nameInput.focus();

      // Prevent Phaser from capturing keydown events
      nameInput.addEventListener("keydown", (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.key === "Enter") {
          nameInput.blur();
        }
      });

      nameInput.addEventListener("keypress", (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
      });

      nameInput.addEventListener("keyup", (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
      });

      // Store reference for cleanup
      this.currentNameInput = nameInput;
    }

    const saveScore = () => {
      if (isTop10 && nameInput && nameInput.parentNode) {
        // Update the score with the entered name (sanitized)
        const playerName = (nameInput.value.trim() || "Player").replace(
          /[<>]/g,
          "",
        );
        newScore.name = playerName;

        // Save the name for next time
        try {
          localStorage.setItem("lastPlayerName", playerName);
        } catch (e) {
          console.warn("Failed to save player name:", e);
        }

        // Remove the old score and add the new one with the name
        this.highScores = this.highScores.filter(
          (score) =>
            !(
              score.playerScore === this.playerScore &&
              score.aiScore === this.aiScore &&
              score.time === this.gameTimer
            ),
        );
        this.highScores.push(newScore);

        // Sort again
        this.highScores.sort((a, b) => {
          if (a.playerScore !== b.playerScore) {
            return b.playerScore - a.playerScore;
          }
          return a.time - b.time;
        });

        // Keep only top 10
        this.highScores = this.highScores.slice(0, 10);

        // Save to localStorage
        try {
          localStorage.setItem(
            "pingPongHighScores",
            JSON.stringify(this.highScores),
          );
        } catch (e) {
          console.warn("Failed to save high scores:", e);
        }

        // Safely remove the input field
        this.cleanupNameInput();
      }
    };

    _.createButton(
      this,
      config.width / 2,
      config.height / 2 + 60,
      "SAVE & CONTINUE",
      () => {
        saveScore();
        this.scene.transition({
          target: "HighScores",
          duration: 300,
          moveAbove: true,
          onUpdate: (progress) => {
            this.cameras.main.setAlpha(1 - progress);
          },
        });
      },
    );

    _.createButton(
      this,
      config.width / 2,
      config.height / 2 + 140,
      "PLAY AGAIN",
      () => {
        saveScore();
        this.scene.transition({
          target: "GameScene",
          duration: 300,
          moveAbove: true,
          data: { mode: this.gameMode },
          onUpdate: (progress) => {
            this.cameras.main.setAlpha(1 - progress);
          },
        });
      },
    );

    _.createButton(
      this,
      config.width / 2,
      config.height / 2 + 220,
      "MAIN MENU",
      () => {
        saveScore();
        this.scene.transition({
          target: "StartMenu",
          duration: 300,
          moveAbove: true,
          onUpdate: (progress) => {
            this.cameras.main.setAlpha(1 - progress);
          },
        });
      },
    );
  }

  cleanupNameInput() {
    if (this.currentNameInput && this.currentNameInput.parentNode) {
      try {
        // No need to restore keys with the new approach
        document.body.removeChild(this.currentNameInput);
      } catch (e) {
        console.warn("Input element already removed:", e);
      }
      this.currentNameInput = null;
    }
  }

  shutdown() {
    // Cleanup when scene ends
    if (this.timerEvent) {
      this.timerEvent.destroy();
      this.timerEvent = null;
    }

    // Clean up DOM elements
    this.cleanupNameInput();

    // Clean up particles
    if (this.hitParticles) {
      this.hitParticles.destroy();
    }

    // Clean up groups
    if (this.paddles) {
      this.paddles.destroy(true);
    }
    if (this.uiElements) {
      this.uiElements.destroy(true);
    }
  }
}
