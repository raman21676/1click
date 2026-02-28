/**
 * Tic-Tac-Toe Game Logic
 * Features: 2-Player mode, AI with Minimax, Score tracking, LocalStorage
 */

class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameMode = '2p'; // '2p' or 'ai'
        this.difficulty = 'medium';
        this.scores = { x: 0, o: 0, draw: 0 };
        
        // DOM elements
        this.cells = document.querySelectorAll('.cell');
        this.turnIndicator = document.getElementById('turn-indicator');
        this.modal = document.getElementById('game-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.modalBtn = document.getElementById('modal-btn');
        
        // Initialize
        this.init();
    }
    
    init() {
        this.loadScores();
        this.updateScoreDisplay();
        this.attachEventListeners();
        this.updateTurnIndicator();
    }
    
    attachEventListeners() {
        // Cell clicks
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });
        
        // Mode buttons
        document.getElementById('mode-2p').addEventListener('click', () => this.setMode('2p'));
        document.getElementById('mode-ai').addEventListener('click', () => this.setMode('ai'));
        
        // Difficulty selector
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
        });
        
        // Control buttons
        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('clear-scores-btn').addEventListener('click', () => this.clearScores());
        
        // Modal button
        this.modalBtn.addEventListener('click', () => {
            this.hideModal();
            this.resetGame();
        });
        
        // Close modal on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
    }
    
    setMode(mode) {
        this.gameMode = mode;
        
        // Update UI
        document.getElementById('mode-2p').classList.toggle('active', mode === '2p');
        document.getElementById('mode-ai').classList.toggle('active', mode === 'ai');
        document.getElementById('difficulty-selector').style.display = mode === 'ai' ? 'flex' : 'none';
        
        this.resetGame();
    }
    
    handleCellClick(e) {
        const index = parseInt(e.target.dataset.index);
        
        if (this.board[index] || !this.gameActive) return;
        
        this.makeMove(index, this.currentPlayer);
        
        if (this.gameMode === 'ai' && this.gameActive && this.currentPlayer === 'O') {
            this.cells.forEach(cell => cell.style.pointerEvents = 'none');
            setTimeout(() => {
                this.makeAIMove();
                this.cells.forEach(cell => cell.style.pointerEvents = 'auto');
            }, 300);
        }
    }
    
    makeMove(index, player) {
        this.board[index] = player;
        const cell = this.cells[index];
        cell.textContent = player;
        cell.classList.add(player.toLowerCase(), 'taken');
        
        // Check for win or draw
        if (this.checkWin(player)) {
            this.handleGameEnd(player);
        } else if (this.checkDraw()) {
            this.handleGameEnd('draw');
        } else {
            this.currentPlayer = player === 'X' ? 'O' : 'X';
            this.updateTurnIndicator();
        }
    }
    
    makeAIMove() {
        if (!this.gameActive) return;
        
        let index;
        
        switch (this.difficulty) {
            case 'easy':
                index = this.getRandomMove();
                break;
            case 'medium':
                index = Math.random() < 0.6 ? this.getBestMove() : this.getRandomMove();
                break;
            case 'hard':
            default:
                index = this.getBestMove();
                break;
        }
        
        this.makeMove(index, 'O');
    }
    
    getRandomMove() {
        const available = this.board.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);
        return available[Math.floor(Math.random() * available.length)];
    }
    
    getBestMove() {
        // Minimax algorithm for perfect play
        let bestScore = -Infinity;
        let bestMove = 0;
        
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                const score = this.minimax(this.board, 0, false);
                this.board[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }
    
    minimax(board, depth, isMaximizing) {
        // Check terminal states
        if (this.checkWinForMinimax('O')) return 10 - depth;
        if (this.checkWinForMinimax('X')) return depth - 10;
        if (this.checkDrawForMinimax()) return 0;
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    const score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    const score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    
    checkWinForMinimax(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        return winPatterns.some(pattern => {
            return pattern.every(index => this.board[index] === player);
        });
    }
    
    checkDrawForMinimax() {
        return this.board.every(cell => cell !== '');
    }
    
    checkWin(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        const winningPattern = winPatterns.find(pattern => {
            return pattern.every(index => this.board[index] === player);
        });
        
        if (winningPattern) {
            winningPattern.forEach(index => this.cells[index].classList.add('winning'));
            return true;
        }
        
        return false;
    }
    
    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
    
    handleGameEnd(result) {
        this.gameActive = false;
        
        if (result === 'draw') {
            this.scores.draw++;
            this.showModal('Game Over!', "It's a Draw!");
        } else {
            this.scores[result.toLowerCase()]++;
            const winner = result === 'X' ? 'Player X' : (this.gameMode === 'ai' ? 'AI' : 'Player O');
            this.showModal('Game Over!', `${winner} Wins!`);
        }
        
        this.saveScores();
        this.updateScoreDisplay();
    }
    
    showModal(title, message) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.modal.classList.remove('hidden');
    }
    
    hideModal() {
        this.modal.classList.add('hidden');
    }
    
    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        this.updateTurnIndicator();
        this.hideModal();
    }
    
    updateTurnIndicator() {
        this.turnIndicator.textContent = `Player ${this.currentPlayer}'s Turn`;
        this.turnIndicator.className = this.currentPlayer === 'X' ? 'turn-x' : 'turn-o';
    }
    
    updateScoreDisplay() {
        document.getElementById('score-x').textContent = this.scores.x;
        document.getElementById('score-o').textContent = this.scores.o;
        document.getElementById('score-draw').textContent = this.scores.draw;
    }
    
    loadScores() {
        const saved = Storage.get('tictactoe_scores');
        if (saved) {
            this.scores = saved;
        }
    }
    
    saveScores() {
        Storage.set('tictactoe_scores', this.scores);
    }
    
    clearScores() {
        this.scores = { x: 0, o: 0, draw: 0 };
        this.saveScores();
        this.updateScoreDisplay();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
