
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
        var position = this.board[row-1][column-1];
        if (position == "") {
            this.board[row-1][column-1] = marker;
            this.render();
            this.turnSuccess = true;
        } else {
            this.turnSuccess = false;
            console.log("Try another position");
            display.messageLine = `Try again ${gamePlay.activePlayer.name}`;
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
    }
};



const gamePlay = {
    player: function Player (name, marker) {
        this.name = name;
        this.marker = marker;
    },

    player1: new player(display.player1Name, 'X'),
    player2: new player(display.player2Name, 'O'),
    
    turnCount: 0,
    winStatus: false,

    //Limits running win check until someone can possibly win
    checkTurn: function (marker) {
        if (turnCount < 5) {
            nextTurn();
        } else if (turnCount >= 5 && turnCount < 9) {
            winStatus = gameBoard.checkForWin(marker);

            if (winStatus == false) {
                nextTurn();
            } else if (winStatus == true) {
                endGame(true);
            }
        } else if (turnCount == 9) {
            if (winStatus == true) {
                endGame(true);
            } else if (winStatus == false) {
                endGame(false);
            }
        };
    },

    lastTurn: '',

    //turn logic
    activePlayer: '',

    nextTurn: function () {
        if (lastTurn == '' || lastTurn == this.player2.name) {
            this.activePlayer = this.player1;
            this.turnMessage(this.activePlayer);
        } else if (lastTurn == this.player1.name) {
            this.activePlayer = this.player2;
            this.turnMessage(this.activePlayer);
        };
    },

    turnMessage: function(player) {
        console.log(`${player.name}'s turn.`);
        display.messageLine = `${player.name}'s turn.`;
    },
    
    takeTurn: function (player) {
        let coordinates = display.coordinates;
        display.fetchCell(coordinates);
        const turnCoordinates = coordinates.split(',');
        gameBoard.mark(turnCoordinates[0], turnCoordinates[1], player.marker);
        const status = gameBoard.getSuccess();
        if (status == true) {
            display.updateCell(player.marker);
            turnCount++;
            lastTurn = player.name;
            checkTurn(player.marker);
        } else if (status == false) {
            //takeTurn(player);
        }
    },

    endGame: function (value) {
        if (value == true) {
            console.log(`Game over. ${this.lastTurn} wins!`);
            display.messageLine = `Game over. ${this.lastTurn} wins!`;
        } else {
            console.log('Game over. Cat game! No winners!');
            display.messageLine = 'Game over. Cat game! No winners!';
        }
    },

    start: function () {
        gameBoard.createBoard();
        display.primeCells(display.allCells);
        this.nextTurn();
    }
}

// Display Logic
const display = {
    coordinates: '',
    cell: '',
    allCells: document.querySelectorAll('#cell'),
    messageLine: document.querySelector('text_display_text').textContent,
    player1Name: document.querySelector('#player1').value,
    player2Name: document.querySelector('#player2').value,
    clickStatus: false,

    bindCoordinates: function () {
        this.coordinates.bind(display) = this.id;
    },

    primeCells: function(cells) {
        cells.forEach((cell) => {
            cell.addEventListener('click', () => {
                
            })
        })
    },

    fetchCell: function (position) {
        this.cell = this.document.querySelector(`#${position}`)
    },

    markCell: function (cell, marker) {
        cell.textContent = marker;
    },

    updateCell: function (marker) {
        this.markCell(this.cell, marker)
    },
    
    executeClick: function () {
        this.bindCoordinates();
        this.clickStatus = true;
        gamePlay.takeTurn(gamePlay.activePlayer);
    }

    


}