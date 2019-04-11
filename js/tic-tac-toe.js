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
    game_narration: null,
    gameover: false,
    started_game: false,
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
    players: {
        x: 'X',
        o: 'O',
        input_x: null,
        input_o: null
    },

    // FUNCTIONS
    init: function (container, x_element, o_element, game_narration) {
        this.container_element = container;
        this.players.input_x = x_element;
        this.players.input_o = o_element;
        this.game_narration = game_narration;
        
        this.draw();
    },

    make_play: function (position) {
        if (this.gameover || !this.started_game) return false;

        if (this.board[position] === '') {
            this.board[position] = this.simbols.options[this.simbols.turn_index];
            this.setNarrationText();
            this.draw();
            let { winning_sequences_index, winner } = this.check_winning_sequences(this.simbols.options[this.simbols.turn_index]);
            if (winning_sequences_index >= 0) {
                this.game_is_over(winner);
            } else {
                this.simbols.change();
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
                return { winning_sequences_index: i, winner: simbol };
            }
        };
        return -1;
    },
    check_draw: function () {
        let played = 0;
        for (i in this.board) {
            if (this.board[i] !== '') {
                played++;
            }
        }
        return played >= this.board.length;
    },
    game_is_over: function (winner) {
        this.gameover = true;
        this.game_narration.textContent = (winner === 'O') ? `${this.players.o} win!` : `${this.players.x} win!`
    },

    start: function () {
        this.players.x = !(this.players.input_x.value) ? 'X' : this.players.input_x.value;
        this.players.o = !(this.players.input_o.value) ? 'O' : this.players.input_o.value;

        this.board.fill('');
      
        this.gameover = false;
        this.started_game=true;
        this.game_narration.textContent = `${this.players.o} turn!`;
    },

    draw: function () {
        let content = '';
        if (this.check_draw() === true) {
            this.gameover = true;
            this.game_narration.textContent = 'Draw!';
        }
        for (i in this.board) {
            content += '<div onclick="tic_tac_toe.make_play(' + i + ')">' + this.board[i] + '</div>';
        };

        this.container_element.innerHTML = content;
    },
    setNarrationText() {
        this.game_narration.textContent = (this.simbols.turn_index === 0) ? `${this.players.x} turn!` : `${this.players.o} turn!`;
    }
};