import {
    config,
    _,
    menuMusic,
    setMenuMusic,
    musicMuted,
    musicVolume,
    BALL_SPEED,
    SPEED_INCREASE,
    WINNING_SCORE,
} from '../game.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        this.playerScore = 0;
        this.aiScore = 0;
        this.gameTimer = 0;
        this.gameActive = true;
        this.highScores = JSON.parse(localStorage.getItem('pingPongHighScores')) || [];
        this.ballDirection = 1; // 1 for right, -1 for left
        this.currentBallSpeed = BALL_SPEED;
        this.isPaused = false;
    }

    create() {
        // Load sound effects
        this.clickSound = this.sound.add('click');
        this.hitSound = this.sound.add('hit');
        this.hoverSound = this.sound.add('hover');
        this.scoreSound = this.sound.add('score');

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

        // Player paddle
        this.player = this.add.rectangle(50, config.height / 2, 20, 100, 0xffffff);
        this.physics.add.existing(this.player, true);

        // AI paddle
        this.ai = this.add.rectangle(config.width - 50, config.height / 2, 20, 100, 0xffffff);
        this.physics.add.existing(this.ai, true);

        // Center line
        const centerLine = this.add.rectangle(config.width / 2, config.height / 2, 3, config.height - 100, 0xffffff);
        centerLine.setAlpha(0.75);

        // Ball
        this.ball = this.add.rectangle(config.width / 2, config.height / 2, 20, 20, 0xffffff);
        this.physics.add.existing(this.ball);
        this.ball.body.setCollideWorldBounds(true, 1, 1);
        this.ball.body.setBounce(1, 1);
        this.resetBall();

        // Collisions
        this.physics.add.collider(this.ball, this.player, this.ballHitPaddle, null, this);
        this.physics.add.collider(this.ball, this.ai, this.ballHitPaddle, null, this);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Score
        this.scoreText = this.add.text(80, 30, '0 : 0', _.styles.text).setOrigin(0.5);

        // Timer
        this.timerText = this.add.text(config.width - 100, 30, 'TIME: 0s', {
            ..._.styles.text,
            fontSize: '24px',
        }).setOrigin(0.5);

        // Speed display
        this.speedText = this.add.text(config.width - 100, 70, 'SPEED: +0%', {
            ..._.styles.text,
            fontSize: '24px',
        }).setOrigin(0.5);

        // Timer event
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Create pause menu (initially hidden)
        this.createPauseMenu();

        // Create a small white texture for particles
        if (!this.textures.exists('pixel')) {
            const graphics = this.add.graphics()
                .fillStyle(0xffffff, 1)
                .fillRect(0, 0, 10, 10)
                .generateTexture('pixel', 10, 10)
                .destroy();
        }
        this.hitParticles = this.add.particles(0, 0, 'pixel', {
            frame: 'white',
            lifespan: 800,
            speed: { min: 50, max: 150 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            blendMode: 'ADD',
            frequency: -1
        });
        this.hitParticles.setDepth(1);
    }

    createPauseMenu() {
        // Create a semi-transparent background
        this.pauseBg = this.add.rectangle(config.width / 2, config.height / 2, config.width, config.height, 0x000000, 0.7)
            .setVisible(false)
            .setInteractive();

        // Create pause menu container
        this.pauseMenu = this.add.container(config.width / 2, config.height / 2)
            .setVisible(false);

        // Pause title
        const pauseTitle = this.add.text(0, -100, 'PAUSED', {
            ..._.styles.text,
            fontSize: '48px',
        }).setOrigin(0.5);

        // Resume button
        const resumeButton = _.createButton(
            this,
            0,
            0,
            'RESUME',
            () => {
                this.togglePause();
            }
        );        

        // Main menu button
        const menuButton = _.createButton(
            this,
            0,
            60, 
            'MAIN MENU',
            () => {
                this.scene.start('StartMenu');
            }
        );

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
            this.timerText.setText(`TIME: ${this.gameTimer}s`);
            
            // Increase ball speed
            this.currentBallSpeed += SPEED_INCREASE;
            const speedIncreasePercent = Math.round(((this.currentBallSpeed - BALL_SPEED) / BALL_SPEED) * 100);
            this.speedText.setText(`SPEED: +${speedIncreasePercent}%`);
            
            // Update ball velocity while maintaining direction
            if (this.ball.body.velocity.x !== 0 || this.ball.body.velocity.y !== 0) {
                const angle = Math.atan2(this.ball.body.velocity.y, this.ball.body.velocity.x);
                this.ball.body.velocity.x = Math.cos(angle) * this.currentBallSpeed;
                this.ball.body.velocity.y = Math.sin(angle) * this.currentBallSpeed;
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
        const countdownNumbers = ['READY?', 'GO!'];
        let currentIndex = 0;

        const showNumber = () => {
            if (currentIndex >= countdownNumbers.length) {
                // Launch the ball after countdown
                this.ball.body.setVelocity(
                    this.currentBallSpeed * this.ballDirection,
                    0
                );
                // Reverse direction for next serve
                this.ballDirection *= -1;
                return;
            }

            const number = countdownNumbers[currentIndex];
            const text = this.add.text(config.width / 2, config.height / 2, number.toString(), {
                ..._.styles.text,
                fontSize: '120px',
                fontStyle: 'bold',
            }).setOrigin(0.5);

            // Initial scale
            text.setScale(2);
            text.setAlpha(1);

            // Animate out
            this.tweens.add({
                targets: text,
                scale: 0.5,
                alpha: 0,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    text.destroy();
                    currentIndex++;
                    showNumber();
                }
            });
        };

        showNumber();
    }

    ballHitPaddle(ball, paddle) {
        // Play hit sound
        this.hitSound.play();
        
        // Emit particles at the ball's position
        this.hitParticles.explode(10, ball.x, ball.y);

        // Calculate where the ball hit the paddle (0 to 1, where 0.5 is center)
        const hitPosition = (ball.y - (paddle.y - paddle.height/2)) / paddle.height;
        
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
        const speed = Math.sqrt(ball.body.velocity.x * ball.body.velocity.x + 
                              ball.body.velocity.y * ball.body.velocity.y);
        
        // Set new velocity with the calculated angle
        // Maintain the same speed but change direction
        // Always ensure x velocity moves towards opponent's side
        const xDirection = paddle === this.player ? 1 : -1;
        ball.body.velocity.x = Math.cos(angleRad) * speed * xDirection;
        ball.body.velocity.y = Math.sin(angleRad) * speed;
    }

    update() {
        // Check for pause toggle only if game is active
        if (Phaser.Input.Keyboard.JustDown(this.escKey) && this.gameActive) {
            this.togglePause();
        }

        if (this.isPaused) return;

        if (!this.gameActive) return;

        // Player movement
        if (this.cursors.up.isDown) {
            this.player.y -= 5;
        } else if (this.cursors.down.isDown) {
            this.player.y += 5;
        }
        // Clamp player paddle
        this.player.y = Phaser.Math.Clamp(this.player.y, this.player.height / 2, config.height - this.player.height / 2);
        this.player.body.updateFromGameObject();

        // AI movement (simple follow)
        if (this.ball.y < this.ai.y) {
            this.ai.y -= 4;
        } else if (this.ball.y > this.ai.y) {
            this.ai.y += 4;
        }
        this.ai.y = Phaser.Math.Clamp(this.ai.y, this.ai.height / 2, config.height - this.ai.height / 2);
        this.ai.body.updateFromGameObject();

        // Check for scoring
        if (this.ball.x < 20) {
            this.aiScore++;
            this.updateScore();
            this.scoreSound.play();
            this.resetBall();
        } else if (this.ball.x > config.width - 20) {
            this.playerScore++;
            this.updateScore();
            this.scoreSound.play();
            this.resetBall();
        }

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
        
        // Add current score to high scores
        const newScore = {
            playerScore: this.playerScore,
            aiScore: this.aiScore,
            time: this.gameTimer,
            date: new Date().toLocaleDateString(),
            name: 'Player' // Default name until input
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
        const currentRank = this.highScores.findIndex(score => 
            score.playerScore === this.playerScore && 
            score.aiScore === this.aiScore && 
            score.time === this.gameTimer
        ) + 1;
        
        // Keep only top 10 scores
        this.highScores = this.highScores.slice(0, 10);
        
        // Check if the current score made it to top 10
        const isTop10 = currentRank <= 10;
        
        // Display game over screen
        const gameOverText = this.add.text(
            config.width / 2,
            config.height / 2 - 150,
            'GAME OVER!',
            {
                ..._.styles.text,
                fontSize: '48px',
            }
        ).setOrigin(0.5);
        
        const finalScoreText = this.add.text(
            config.width / 2,
            config.height / 2 - 80, 
            `Final Score: ${this.playerScore} - ${this.aiScore}\nTime: ${this.gameTimer}s\nRank: #${currentRank}`,
            {
                ..._.styles.text,
                align: 'center'
            }
        ).setOrigin(0.5);

        let nameInput;
        if (isTop10) {
            // Create name input only for top 10 scores
            nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.placeholder = 'Enter your name';
            nameInput.value = localStorage.getItem('lastPlayerName') || '';
            nameInput.style.position = 'absolute';
            nameInput.style.left = '50%';
            nameInput.style.top = '50%';
            nameInput.style.transform = 'translate(-50%, -50%)';
            nameInput.style.padding = '10px';
            nameInput.style.fontSize = '20px';
            nameInput.style.width = '200px';
            nameInput.style.textAlign = 'center';
            document.body.appendChild(nameInput);
        }

        const saveScore = () => {
            if (isTop10) {
                // Update the score with the entered name
                const playerName = nameInput.value.trim() || 'Player';
                newScore.name = playerName;
                
                // Save the name for next time
                localStorage.setItem('lastPlayerName', playerName);
                
                // Remove the old score and add the new one with the name
                this.highScores = this.highScores.filter(score => 
                    !(score.playerScore === this.playerScore && 
                      score.aiScore === this.aiScore && 
                      score.time === this.gameTimer)
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
                localStorage.setItem('pingPongHighScores', JSON.stringify(this.highScores));
                
                // Remove the input field
                document.body.removeChild(nameInput);
            }
        };

        _.createButton(
            this,
            config.width / 2,
            config.height / 2 + 100,
            'BACK TO MENU',
            () => {
                saveScore();
                this.scene.start('StartMenu');
            },
            {
                fontSize: '24px',
            }
        );

        _.createButton(
            this,
            config.width / 2,
            config.height / 2 + 160,
            'PLAY AGAIN',
            () => {
                saveScore();
                this.scene.restart();
            },
            {
                fontSize: '24px'
            }
        );

    }
} 