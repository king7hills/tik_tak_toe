// const test =  (function() {
//     let testString = 'Here is a test for you';

//     function sayString() {
//         alert(testString);
//     }

//     return {
//         sayString: sayString
//     }
// })()

const gameboard = (function() {
    const board = [];
    const rows = 3;
    const columns = 3;

    function createArray () {
    for (let i = 0; i<rows; i++) {
        board[i] = [];
        for (let j = 0; j<columns; j++) {
            board[i][j] = '';
        }}
    _render();
    }
    
    function _render() {
        console.log(board);
    }

    function selectPosition (row, column) {
        const position = board[row][column]
    }
    
    return createArray;
})


const playerModule = (function() {
    const player = function Player (name, token) {
        this.name = name;
        this.token = token;
    }

    const player1 = new player('Player 1', 'X')
    const player2 = new player('Player 2', 'O')
})