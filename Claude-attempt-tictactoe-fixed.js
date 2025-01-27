const display = {
    coordinates: '',
    cell: null,
    allCells: document.querySelectorAll('#cell'),
    messageElement: document.querySelector('.text_display_text'),
    
    get messageLine() {
        return this.messageElement.textContent;
    },
    
    set messageLine(value) {
        this.messageElement.textContent = value;
    },
    
    get player1Name() {
        return document.querySelector('#player1').value;
    },
    
    get player2Name() {
        return document.querySelector('#player2').value;
    },

    primeCells: function(cells) {
        cells.forEach((cell) => {
            cell.addEventListener('click', (event) => {
                this.coordinates = event.target.id;
                this.executeClick();
            });
        });
    },

    fetchCell: function(position) {
        this.cell = document.querySelector(`#${position}`);
    },

    markCell: function(cell, marker) {
        cell.textContent = marker;
    },

    updateCell: function(marker) {
        this.markCell(this.cell, marker);
    },
    
    executeClick: function() {
        gamePlay.takeTurn(gamePlay.activePlayer);
    }
};

const gameBoard = {
    board: [],
    rows: 3,
    columns: 3,
    turnSuccess: false,
    winStatus: false,

    createBoard: function() {
        this.board = Array(this.rows).fill().map(() => Array(this.columns).fill(''));
        this.turnSuccess = false;
        this.winStatus = false;
        this.render();
    },
    
    render: function() {
        console.log(this.board);
    },

    getSuccess: function() {
        return this.turnSuccess;
    },
    
    mark: function(row, column, marker) {
        const position = this.board[row-1][column-1];
        if (position === "") {
            this.board[row-1][column-1] = marker;
            this.render();
            this.turnSuccess = true;
        } else {
            this.turnSuccess = false;
            display.messageLine = `Try again ${gamePlay.activePlayer.name}`;
        }
    },

    setWinStatus: function(marker) {
        const threeMarks = marker.repeat(3);

        // Check rows and columns
        for (let i = 0; i < this.rows; i++) {
            const row = this.board[i].join('');
            const column = this.board.map(row => row[i]).join('');
            
            if (row === threeMarks || column === threeMarks) {
                return this.winStatus = true;
            }
        }
        
        // Check diagonals
        const diagonal1 = this.board[0][0] + this.board[1][1] + this.board[2][2];
        const diagonal2 = this.board[0][2] + this.board[1][1] + this.board[2][0];

        if (diagonal1 === threeMarks || diagonal2 === threeMarks) {
            return this.winStatus = true;
        }
        
        return false;
    },

    checkForWin: function(marker) {
        this.setWinStatus(marker);
        return this.winStatus;
    }
};

const gamePlay = {
    Player: function(name, marker) {
        this.name = name;
        this.marker = marker;
    },

    initialize: function() {
        this.player1 = new this.Player(display.player1Name || 'Player 1', 'X');
        this.player2 = new this.Player(display.player2Name || 'Player 2', 'O');
        this.turnCount = 0;
        this.winStatus = false;
        this.lastTurn = '';
        this.activePlayer = null;
    },
    
    checkTurn: function(marker) {
        if (this.turnCount < 5) {
            this.nextTurn();
        } else if (this.turnCount >= 5 && this.turnCount < 9) {
            this.winStatus = gameBoard.checkForWin(marker);

            if (!this.winStatus) {
                this.nextTurn();
            } else {
                this.endGame(true);
            }
        } else if (this.turnCount === 9) {
            if (this.winStatus) {
                this.endGame(true);
            } else {
                this.endGame(false);
            }
        }
    },

    nextTurn: function() {
        if (!this.lastTurn || this.lastTurn === this.player2.name) {
            this.activePlayer = this.player1;
        } else {
            this.activePlayer = this.player2;
        }
        this.turnMessage(this.activePlayer);
    },

    turnMessage: function(player) {
        display.messageLine = `${player.name}'s turn.`;
    },
    
    takeTurn: function(player) {
        const coordinates = display.coordinates;
        display.fetchCell(coordinates);
        const [row, col] = coordinates.split(',');
        gameBoard.mark(row, col, player.marker);
        
        if (gameBoard.getSuccess()) {
            display.updateCell(player.marker);
            this.turnCount++;
            this.lastTurn = player.name;
            this.checkTurn(player.marker);
        }
    },

    endGame: function(value) {
        if (value) {
            display.messageLine = `Game over. ${this.lastTurn} wins!`;
        } else {
            display.messageLine = 'Game over. Cat game! No winners!';
        }
    },

    start: function() {
        this.initialize();
        gameBoard.createBoard();
        display.primeCells(display.allCells);
        this.nextTurn();
    }
};
