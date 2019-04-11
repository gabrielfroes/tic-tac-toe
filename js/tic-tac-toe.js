// TIC TAC TOE
const tic_tac_toe = {
    // ATTRIBUTES
    board: ['', '', '', '', '', '', '', '', ''],
    simbols: {
        options: ['O', 'X'],
        turn_index: 0,
        change: function () {
            this.turn_index = (this.turn_index === 0 ? 1 : 0);
        }
    },
    container_element: null,
    gameover: false,
    winning_sequences: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ],

    // FUNCTIONS
    init: function (container) {
        this.container_element = container;
    },

    make_play: function (position) {
        if (this.gameover) return false;
        if (this.board[position] === '') {
            this.board[position] = this.simbols.options[this.simbols.turn_index];
            this.draw();
            let winning_sequences_index = this.check_winning_sequences(this.simbols.options[this.simbols.turn_index]);
            if (winning_sequences_index >= 0) {
                this.game_is_over();
            } else {
                this.simbols.change();
            }
            return true;
        } else {
            return false;
        }
    },

    check_winning_sequences: function (simbol) {
        for (let i in this.winning_sequences) {
            if (this.board[this.winning_sequences[i][0]] == simbol &&
                this.board[this.winning_sequences[i][1]] == simbol &&
                this.board[this.winning_sequences[i][2]] == simbol) {
                console.log('winning sequences INDEX:' + i);
                return i;
            }
        };
        return -1;
    },

    game_is_over: function () {
        this.gameover = true;
        console.log('GAME OVER');
    },

    is_game_over: function () {
        for (let i of this.board) {
            if (i === '') {
                return false;
            }
        }

        return true;
    },

    start: function () {
        this.board.fill('');
        this.draw();
        this.gameover = false;
    },

    restart: function () {
        if (this.is_game_over() || this.gameover) {
            this.start();
            console.log('this game has been restarted!')
        } else if (confirm('Are you sure you want to restart this game?')) {
            this.start();
            console.log('this game has been restarted!')
        }
    },

    draw: function () {
        let content = '';

        for (i in this.board) {
            content += `<div onclick="tic_tac_toe.make_play(${i})">${this.board[i]}</div>`;
        };

        this.container_element.innerHTML = content;
    }
};