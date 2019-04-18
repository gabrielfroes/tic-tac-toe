// TIC TAC TOE
const tic_tac_toe = {

    // ATTRIBUTES
    board: ['', '', '', '', '', '', '', '', ''],
    symbols: {
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
    Opponent: {
        options: ['Friend', 'Machine'],
        index: 1,
    },

    // FUNCTIONS
    init: function (container) {
        this.container_element = container;
    },

    make_play: function (position) {
        if (this.gameover) return false;
        if (this.board[position] === '') {
            this.board[position] = this.symbols.options[this.symbols.turn_index];
            this.draw();
            let winning_sequences_index = this.check_winning_sequences(this.symbols.options[this.symbols.turn_index]);
            if (winning_sequences_index >= 0) {
                this.game_is_over();
            } else if (this.check_game_tied()) {
                this.game_is_over();
            } else {
                this.symbols.change();
                if (this.Opponent.index == 1  && this.symbols.turn_index == 1){
                    this.machine_play(this.symbols.options[this.symbols.turn_index])
                }
            }
            return true;
        }
        else {
            return false;
        }
    },

    check_winning_sequences: function (simbol) {

        for (i in this.winning_sequences) {
            if (this.board[this.winning_sequences[i][0]] == simbol &&
                this.board[this.winning_sequences[i][1]] == simbol &&
                this.board[this.winning_sequences[i][2]] == simbol) {
                    console.log('winning sequences INDEX:' + i);
                    return i;
            }
        };
        return -1;
    },

    check_game_tied: function () {
        for (i in this.board) {
            if (this.board[i] == '')
                return false;
        }
        return true;
    },

    game_is_over: function () {
        this.gameover = true;
        console.log('GAME OVER');
    },

    start: function () {
        this.board.fill('');
        this.draw();
        this.gameover = false;
    },

    draw: function () {
        let content = '';

        for (i in this.board) {
            content += '<div onclick="tic_tac_toe.make_play(' + i + ')">' + this.board[i] + '</div>';
        };

        this.container_element.innerHTML = content;
    },

    machine_play: function () {
        //Play to win
        if (this.machine_play_strategic_move(this.symbols.options[this.symbols.turn_index]) > -1) {
            this.make_play(this.machine_play_strategic_move(this.symbols.options[this.symbols.turn_index]));    
        }
        //Play to defence
        else if (this.machine_play_strategic_move(this.symbols.options[this.turn_index === 0 ? 1 : 0]) > -1) {
            this.make_play(this.machine_play_strategic_move(this.symbols.options[this.turn_index === 0 ? 1 : 0]));    
        }
        else {
            this.make_play(this.machine_play_random_move());
        }
    },
    
    machine_play_strategic_move: function (symbol) {
        let score;
        for (i in this.winning_sequences) {
            score = 0;
            if (this.board[this.winning_sequences[i][0]] == symbol)
                score++;
            if (this.board[this.winning_sequences[i][1]] == symbol)
                score++;
            if (this.board[this.winning_sequences[i][2]] == symbol)
                score++;
            if (score == 2) {
                if (this.board[this.winning_sequences[i][0]] == '') {
                    return this.winning_sequences[i][0];
                }
                if (this.board[this.winning_sequences[i][1]] == '') {
                    return this.winning_sequences[i][1];
                }
                if (this.board[this.winning_sequences[i][2]] == '') {
                    return this.winning_sequences[i][2];
                }
            }
        }
        return -1;
    },
    
    machine_play_random_move: function () {
        let position;
        do {
            position = Math.floor(Math.random() * 10 )
        }
        while (this.board[position] != '')
        return position;    
    }

};