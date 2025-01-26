
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
        }}

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



function playGame(player1Name, player2Name) {
    const player = function Player (name, marker) {
        this.name = name;
        this.marker = marker;
    };

    const player1 = new player(player1Name, 'X');
    const player2 = new player(player2Name, 'O');

    let turnCount = 0;
    let winStatus = false;

    //Limits running win check until someone can possibly win
    function checkTurn (marker) {
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
    };

    let lastTurn = '';

    //turn logic
    function nextTurn () {
        if (lastTurn == '' || lastTurn == player2.name) {
            takeTurn(player1);
        } else if (lastTurn == player1.name) {
            takeTurn(player2);
        };
    };

    function endGame (value) {
        if (value == true) {
            console.log(`Game over. ${lastTurn} wins!`)
        } else console.log('Game over. Cat game! No winners!');
    }

    function takeTurn (player) {
        console.log(`${player.name}'s turn.`);
        let coordinates = prompt("Input position separated by comma (1-3,1-3): ");
        const turnCoordinates = coordinates.split(',');

        gameBoard.mark(turnCoordinates[0], turnCoordinates[1], player.marker);
        const status = gameBoard.getSuccess();
        if (status == true) {
            turnCount++;
            lastTurn = player.name;
            checkTurn(player.marker);
        } else if (status == false) {
            takeTurn(player);
        }
    };

    gameBoard.createBoard()
    nextTurn();
}
