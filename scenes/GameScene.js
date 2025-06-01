import { menuMusic, musicMuted, musicVolume, config, BALL_SPEED, SPEED_INCREASE, WINNING_SCORE, setMenuMusic } from '../game.js';

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

        // Score
        this.scoreText = this.add.text(80, 30, '0 : 0', {
            fontSize: '32px',
            color: '#fff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Timer
        this.timerText = this.add.text(config.width - 100, 30, 'Time: 0s', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Speed display
        this.speedText = this.add.text(config.width - 100, 70, 'Speed: +0%', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Timer event
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    updateTimer() {
        if (this.gameActive) {
            this.gameTimer++;
            this.timerText.setText(`Time: ${this.gameTimer}s`);
            
            // Increase ball speed
            this.currentBallSpeed += SPEED_INCREASE;
            const speedIncreasePercent = Math.round(((this.currentBallSpeed - BALL_SPEED) / BALL_SPEED) * 100);
            this.speedText.setText(`Speed: +${speedIncreasePercent}%`);
            
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
                fontSize: '120px',
                color: '#fff',
                fontFamily: 'monospace',
                fontStyle: 'bold'
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
        const gameOverText = this.add.text(config.width / 2, config.height / 2 - 150, 'Game Over!', {
            fontSize: '48px',
            color: '#fff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        const finalScoreText = this.add.text(config.width / 2, config.height / 2 - 80, 
            `Final Score: ${this.playerScore} - ${this.aiScore}\nTime: ${this.gameTimer}s\nRank: #${currentRank}`, {
            fontSize: '32px',
            color: '#fff',
            fontFamily: 'monospace',
            align: 'center'
        }).setOrigin(0.5);

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

        // Add menu button
        const menuButton = this.add.text(config.width / 2, config.height / 2 + 100, 'Back to Menu', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'monospace',
            backgroundColor: '#444',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();
        
        menuButton.on('pointerover', () => {
            menuButton.setStyle({ backgroundColor: '#666' });
            this.hoverSound.play();
        });

        menuButton.on('pointerout', () => {
            menuButton.setStyle({ backgroundColor: '#444' });
        });

        menuButton.on('pointerdown', () => {
            this.clickSound.play();
            saveScore();
            this.scene.start('StartMenu');
        });

        // Add restart button
        const restartButton = this.add.text(config.width / 2, config.height / 2 + 160, 'Play Again', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'monospace',
            backgroundColor: '#444',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();
        
        restartButton.on('pointerover', () => {
            restartButton.setStyle({ backgroundColor: '#666' });
            this.hoverSound.play();
        });

        restartButton.on('pointerout', () => {
            restartButton.setStyle({ backgroundColor: '#444' });
        });

        restartButton.on('pointerdown', () => {
            this.clickSound.play();
            saveScore();
            this.scene.restart();
        });
    }
} 