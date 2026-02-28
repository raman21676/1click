/**
 * Snake Game Logic
 * Features: Canvas rendering, AI snake, food spawning, collision detection, mobile controls
 */

class SnakeGame {
    constructor() {
        // Canvas setup
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Grid settings
        this.gridSize = 20;
        this.tileCount = 20;
        
        // Adjust canvas size for mobile
        this.setupCanvas();
        
        // Game state
        this.snake = [
            { x: 10, y: 10 }
        ];
        this.food = this.generateFood();
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.highScore = 0;
        this.speed = 1;
        this.baseSpeed = 100; // ms per frame
        this.currentSpeed = this.baseSpeed;
        
        // Game control
        this.gameLoop = null;
        this.isPlaying = false;
        this.isPaused = false;
        
        // Touch handling
        this.touchStartX = 0;
        this.touchStartY = 0;
        
        // Colors
        this.colors = {
            snakeHead: '#10b981',
            snakeBody: '#34d399',
            food: '#ef4444',
            grid: 'rgba(51, 65, 85, 0.3)'
        };
        
        this.init();
    }
    
    setupCanvas() {
        // Check if mobile
        const isMobile = window.innerWidth <= 480;
        
        if (isMobile) {
            // Calculate available width
            const maxWidth = Math.min(window.innerWidth - 32, 350);
            this.canvas.width = maxWidth;
            this.canvas.height = maxWidth;
            this.gridSize = maxWidth / this.tileCount;
        }
    }
    
    init() {
        this.loadHighScore();
        this.updateHighScoreDisplay();
        this.attachEventListeners();
        this.draw();
    }
    
    attachEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Touch/Swipe controls
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        
        // Prevent scrolling on mobile
        this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
        
        // Button controls
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
        
        // Mobile D-pad
        document.getElementById('btn-up').addEventListener('click', () => this.setDirection(0, -1));
        document.getElementById('btn-down').addEventListener('click', () => this.setDirection(0, 1));
        document.getElementById('btn-left').addEventListener('click', () => this.setDirection(-1, 0));
        document.getElementById('btn-right').addEventListener('click', () => this.setDirection(1, 0));
        document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());
        
        // Window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            if (!this.isPlaying) this.draw();
        });
    }
    
    handleKeydown(e) {
        // Prevent default for arrow keys and space
        if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
            e.preventDefault();
        }
        
        if (!this.isPlaying) {
            if (e.keyCode === 32 || e.keyCode === 13) {
                this.startGame();
            }
            return;
        }
        
        if (e.keyCode === 32) { // Space
            this.togglePause();
            return;
        }
        
        if (this.isPaused) return;
        
        switch(e.keyCode) {
            case 37: // Left
                if (this.dx !== 1) this.setDirection(-1, 0);
                break;
            case 38: // Up
                if (this.dy !== 1) this.setDirection(0, -1);
                break;
            case 39: // Right
                if (this.dx !== -1) this.setDirection(1, 0);
                break;
            case 40: // Down
                if (this.dy !== -1) this.setDirection(0, 1);
                break;
        }
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        if (!this.isPlaying || this.isPaused) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const dx = touchEndX - this.touchStartX;
        const dy = touchEndY - this.touchStartY;
        
        const minSwipe = 30; // Minimum swipe distance
        
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
            // Horizontal swipe
            if (dx > 0 && this.dx !== -1) {
                this.setDirection(1, 0); // Right
            } else if (dx < 0 && this.dx !== 1) {
                this.setDirection(-1, 0); // Left
            }
        } else if (Math.abs(dy) > minSwipe) {
            // Vertical swipe
            if (dy > 0 && this.dy !== -1) {
                this.setDirection(0, 1); // Down
            } else if (dy < 0 && this.dy !== 1) {
                this.setDirection(0, -1); // Up
            }
        }
    }
    
    setDirection(dx, dy) {
        // Prevent reversing direction
        if (this.snake.length > 1) {
            if (dx !== 0 && dx === -this.dx) return;
            if (dy !== 0 && dy === -this.dy) return;
        }
        this.dx = dx;
        this.dy = dy;
    }
    
    startGame() {
        this.isPlaying = true;
        this.isPaused = false;
        this.hideOverlay();
        this.gameLoop = setInterval(() => this.update(), this.currentSpeed);
    }
    
    resetGame() {
        this.stopGame();
        this.snake = [{ x: 10, y: 10 }];
        this.food = this.generateFood();
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.speed = 1;
        this.currentSpeed = this.baseSpeed;
        this.updateScoreDisplay();
        this.updateSpeedDisplay();
        this.showStartOverlay();
        this.draw();
    }
    
    stopGame() {
        this.isPlaying = false;
        this.isPaused = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }
    
    togglePause() {
        if (!this.isPlaying) return;
        
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            clearInterval(this.gameLoop);
            this.showPauseOverlay();
        } else {
            this.hidePauseOverlay();
            this.gameLoop = setInterval(() => this.update(), this.currentSpeed);
        }
    }
    
    update() {
        // Move snake
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScoreDisplay();
            this.increaseSpeed();
            this.food = this.generateFood();
            
            // Check for new high score
            if (this.score > this.highScore) {
                this.highScore = this.score;
                this.saveHighScore();
                this.updateHighScoreDisplay();
            }
        } else {
            this.snake.pop();
        }
        
        this.draw();
    }
    
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }
    
    increaseSpeed() {
        // Increase speed every 50 points
        const newSpeed = Math.floor(this.score / 50) + 1;
        if (newSpeed > this.speed) {
            this.speed = newSpeed;
            this.currentSpeed = Math.max(50, this.baseSpeed - (this.speed - 1) * 10);
            this.updateSpeedDisplay();
            
            // Restart game loop with new speed
            clearInterval(this.gameLoop);
            this.gameLoop = setInterval(() => this.update(), this.currentSpeed);
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw food with glow
        this.drawFood();
        
        // Draw snake
        this.drawSnake();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= this.tileCount; i++) {
            const pos = i * this.gridSize;
            
            // Vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();
            
            // Horizontal lines
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }
    }
    
    drawFood() {
        const x = this.food.x * this.gridSize;
        const y = this.food.y * this.gridSize;
        const size = this.gridSize - 2;
        
        // Glow effect
        this.ctx.shadowColor = this.colors.food;
        this.ctx.shadowBlur = 15;
        
        this.ctx.fillStyle = this.colors.food;
        this.ctx.beginPath();
        this.ctx.roundRect(x + 1, y + 1, size, size, 4);
        this.ctx.fill();
        
        this.ctx.shadowBlur = 0;
    }
    
    drawSnake() {
        this.snake.forEach((segment, index) => {
            const x = segment.x * this.gridSize;
            const y = segment.y * this.gridSize;
            const size = this.gridSize - 2;
            
            // Head has different color
            if (index === 0) {
                this.ctx.fillStyle = this.colors.snakeHead;
                this.ctx.shadowColor = this.colors.snakeHead;
                this.ctx.shadowBlur = 10;
            } else {
                this.ctx.fillStyle = this.colors.snakeBody;
                this.ctx.shadowBlur = 0;
            }
            
            this.ctx.beginPath();
            this.ctx.roundRect(x + 1, y + 1, size, size, 4);
            this.ctx.fill();
            
            // Draw eyes on head
            if (index === 0) {
                this.drawEyes(x, y, size);
            }
        });
        
        this.ctx.shadowBlur = 0;
    }
    
    drawEyes(x, y, size) {
        this.ctx.fillStyle = '#fff';
        const eyeSize = size / 5;
        const eyeOffset = size / 4;
        
        let eye1X = x + eyeOffset;
        let eye1Y = y + eyeOffset;
        let eye2X = x + size - eyeOffset - eyeSize;
        let eye2Y = y + eyeOffset;
        
        // Adjust eyes based on direction
        if (this.dx === 1) { // Moving right
            eye1X += 2; eye2X += 2;
        } else if (this.dx === -1) { // Moving left
            eye1X -= 2; eye2X -= 2;
        } else if (this.dy === -1) { // Moving up
            eye1Y -= 2; eye2Y -= 2;
        } else if (this.dy === 1) { // Moving down
            eye1Y += 2; eye2Y += 2;
        }
        
        this.ctx.fillRect(eye1X, eye1Y, eyeSize, eyeSize);
        this.ctx.fillRect(eye2X, eye2Y, eyeSize, eyeSize);
    }
    
    gameOver() {
        this.stopGame();
        
        // Shake effect
        this.canvas.classList.add('shake');
        setTimeout(() => this.canvas.classList.remove('shake'), 500);
        
        // Show game over overlay
        const isNewHighScore = this.score > 0 && this.score >= this.highScore;
        const title = isNewHighScore ? '🎉 New High Score!' : 'Game Over!';
        const message = `Score: ${this.score}${isNewHighScore ? ' (Best: ' + this.highScore + ')' : ''}`;
        
        this.showGameOverOverlay(title, message);
    }
    
    // Overlay functions
    showStartOverlay() {
        document.getElementById('game-overlay').classList.remove('hidden');
        document.getElementById('overlay-title').textContent = '🐍 Snake Game';
        document.getElementById('overlay-message').textContent = 'Use arrow keys or swipe to play';
        document.getElementById('start-btn').textContent = 'Start Game';
    }
    
    showGameOverOverlay(title, message) {
        document.getElementById('game-overlay').classList.remove('hidden');
        document.getElementById('overlay-title').textContent = title;
        document.getElementById('overlay-message').textContent = message;
        document.getElementById('start-btn').textContent = 'Play Again';
    }
    
    hideOverlay() {
        document.getElementById('game-overlay').classList.add('hidden');
    }
    
    showPauseOverlay() {
        document.getElementById('pause-overlay').classList.remove('hidden');
    }
    
    hidePauseOverlay() {
        document.getElementById('pause-overlay').classList.add('hidden');
    }
    
    // Score functions
    updateScoreDisplay() {
        document.getElementById('score').textContent = this.score;
    }
    
    updateSpeedDisplay() {
        document.getElementById('speed').textContent = this.speed + 'x';
    }
    
    updateHighScoreDisplay() {
        document.getElementById('high-score-display').textContent = this.highScore;
    }
    
    loadHighScore() {
        const saved = Storage.get('snake_highscore');
        if (saved) {
            this.highScore = saved;
        }
    }
    
    saveHighScore() {
        Storage.set('snake_highscore', this.highScore);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
