
// Display Logic
const display = {
    allCells: document.querySelectorAll('.cell'),
    messageLine: document.querySelector('.text_display_text'),
    player1Name: document.querySelector('#player1').value,
    player2Name: document.querySelector('#player2').value,
    coordinates: '',
    cell: '',

    init: function () {
        function primeCells (cells) {
            cells.forEach((div) => {
                div.addEventListener('click', () => {
                    display.coordinates = div.id;
                    gamePlay.takeTurn(gamePlay.activePlayer);
                })
            })
        };

        primeCells(this.allCells);
    },
    

    fetchCell: function (position) {
        this.cell = document.querySelector(`#${position}`)
    },

    markCell: function (cell, marker) {
        cell.textContent = marker;
    },

    updateCell: function (marker) {
        this.markCell(this.cell, marker)
    }
};

// Game board logic
const gameBoard = {
    board: [],
    rows: 3,
    columns: 3,
    turnSuccess: false,
    winStatus: false,

    createBoard: function () {
    for (let i = 0; i < this.rows; i++) {
        this.board[i] = [];
        for (let j = 0; j < this.columns; j++) {
            this.board[i][j] = '';
        }
    }

    this.turnSuccess = false;  
    this.winStatus = false; // Resets the game entirely. Missing this led to false win condition failure testing multiple games (DUH!)
    this.render();
    },
    
    render: function () {
        console.log(this.board);
    },

    getSuccess: function () {
        return this.turnSuccess;
    },
    
    mark: function(row, column, marker) {
        var position = this.board[row][column];
        if (position == "") {
            this.board[row][column] = marker;
            this.render();
            this.turnSuccess = true;
        } else {
            this.turnSuccess = false;
            console.log("Try another position");
            display.messageLine.textContent = `Try again ${gamePlay.activePlayer.name}`;
        }
    },

    setWinStatus: function (marker) {
        const threeMarks = marker.repeat(3);

        let row = '';
        let column = '';
        for (let i = 0; i < this.rows; i++) {
            //row win condition
            row = this.board[i].join('');
            
            column = this.board[0][i] + this.board[1][i] + this.board[2][i];

            if (row == threeMarks || column == threeMarks) {
                return this.winStatus = true;
            };
        };

        
        
        //diagonal win conditions
        let diagonal1 = this.board[1][1]+this.board[0][0]+this.board[2][2];
        let diagonal2 = this.board[1][1]+this.board[0][2]+this.board[2][0];

        if (diagonal1 == threeMarks || diagonal2 == threeMarks) {
            return this.winStatus = true;
        }
    },

    checkForWin: function (marker) {
        this.setWinStatus(marker);
        return this.winStatus;
    },
};

// Game mechanics
const gamePlay = {
    Player: function (name, marker) {
        this.name = name;
        this.marker = marker;
    },

    init: function() {
        this.player1 = new this.Player(display.player1Name, 'X');
        this.player2 = new this.Player(display.player2Name, 'O');

        this.turnCount = 0;
        this.winStatus = false;
        this.lastTurn = '';
        this.activePlayer= '';
    },

    start: function () {
        this.init();
        display.init();
        gameBoard.createBoard()
        this.nextTurn();
    },
 
    //turn logic
    nextTurn: function () {
        if (this.lastTurn == '' || this.lastTurn == this.player2.name) {
            this.activePlayer = this.player1;
            this.turnMessage(this.activePlayer);
        } else if (this.lastTurn == this.player1.name) {
            this.activePlayer = this.player2;
            this.turnMessage(this.activePlayer);
        };
    },

    //Limits running win check until someone can possibly win
    checkTurn: function (marker) {
        if (this.turnCount < 5) {
            this.nextTurn();
        } else if (this.turnCount >= 5 && this.turnCount < 9) {
            this.winStatus = gameBoard.checkForWin(marker);

            if (this.winStatus == false) {
                this.nextTurn();
            } else if (this.winStatus == true) {
                this.endGame(true);
            }
        } else if (this.turnCount == 9) {
            if (this.winStatus == true) {
                this.endGame(true);
            } else if (this.winStatus == false) {
                this.endGame(false);
            }
        };
    },

    turnMessage: function(player) {
        console.log(`${player.name}'s turn.`);
        display.messageLine.textContent = `${player.name}'s turn.`;
    },
    
    takeTurn: function (player) {
        console.log(display.coordinates);
        let coordinates = display.coordinates;
        console.log("Stored coordinates:", coordinates);
        display.fetchCell(coordinates);
        const turnCoordinates = coordinates.split('-');
        console.log(turnCoordinates);
        gameBoard.mark(turnCoordinates[1], turnCoordinates[2], player.marker);
        const status = gameBoard.getSuccess();
        if (status == true) {
            display.updateCell(player.marker);
            this.turnCount++;
            this.lastTurn = player.name;
            this.checkTurn(player.marker);
        } else if (status == false) {
            //takeTurn(player);
        }
    },

    endGame: function (value) {
        if (value == true) {
            console.log(`Game over. ${this.lastTurn} wins!`);
            display.messageLine.textContent = `Game over. ${this.lastTurn} wins!`;
        } else {
            console.log('Game over. Cat game! No winners!');
            display.messageLine.textContent = 'Game over. Cat game! No winners!';
        }
    },
}

