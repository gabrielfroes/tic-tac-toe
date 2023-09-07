// TIC TAC TOE
const tic_tac_toe = {
    // ATTRIBUTES
    board: ['','','','','','','','',''],
    
    /**
     * 'playing' | 'O' | 'X' | 'tied'
     */ 
    status: "playing",
    score_x: 0,
    score_o: 0,
    ai_playing: true,
    ai_default_option: 'O',
    symbols: {
        options: ['O','X'],
        turn_index: 0,
        get_current_symbol() {
            return this.options[this.turn_index];
        },
        show_current_turn() {
            document.getElementById("turn")
            .innerHTML = "TURN: " + this.get_current_symbol();
        },
        change() {
            this.turn_index = (this.turn_index === 0? 1: 0);
            this.show_current_turn();
        },
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

    board_is_full() {
        return !this.board.includes('')
    },

    is_game_over() {
        return this.board_is_full() || this.gameover;
    },

    // FUNCTIONS
    init(container) {
        this.container_element = container;
    },
    
    is_ai_turn() {
        return (this.symbols.get_current_symbol() == this.ai_default_option &&
        this.ai_playing)
    },

    position_filled(position) {
        return this.board[position] != ""
    },

    update_scoreboard() {
        document.getElementById("x").innerHTML = "X SCORE: " + this.score_x;
        document.getElementById("o").innerHTML = "O SCORE: " + this.score_o;
    },

    set_symbol_in_board(position) {

    },

    make_play(position, who) {
        if (
            this.is_game_over() ||
            this.position_filled(position) ||
            (
                this.is_ai_turn() &&
                who == 'player'
            ) ||
            (
                !this.is_ai_turn() &&
                who == 'ai'
            )
        ) return false;

        this.board[position] = this.symbols.get_current_symbol();
        this.draw_board();
        
        if (this.board_is_full()) {
            this.status = 'tied';
            this.set_game_over();
        }

        const winning_sequences_index = this.check_winning_sequences(this.symbols.get_current_symbol());

        if (winning_sequences_index >= 0) {
            this.set_game_over();
            this.stylize_winner_sequence(this.winning_sequences[winning_sequences_index]);
        } else {
            this.symbols.change();
            this.send_ai_current_player_move(position);
        }

        return true;
    },

    send_ai_current_player_move(position) {
        if (this.ai_playing) {
            AI.register_player_move(position, this.symbols.get_current_symbol());
        }
    },
    
    stylize_winner_sequence(winner_sequence) {
        winner_sequence.forEach((position) => {
          this.container_element
                .querySelector(`div:nth-child(${position + 1})`)
                .classList.add('winner');
        });
    },

    increment_score(winner) {
        winner == "X"? this.score_x++: this.score_o++;
    },

    check_winning_sequences(symbol) {
        for ( i in this.winning_sequences ) {
            if (
                this.board[ this.winning_sequences[i][0] ] == symbol &&
                this.board[ this.winning_sequences[i][1] ] == symbol &&
                this.board[ this.winning_sequences[i][2] ] == symbol
            ) {
                console.log('winning sequences INDEX:' + i);
                this.status = symbol;
                this.increment_score(symbol);
                this.update_scoreboard();
                return i;
            }
        };
        return -1;
    },

    set_game_over() {
        this.gameover = true;
        console.log('GAME OVER');
    },

    random_number(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    },
    
    set_random_index() {
        return this.symbols.turn_index = this.random_number(0, 2);
    },

    reset_score() {
        this.score_o = 0;
        this.score_x = 0;
        this.update_scoreboard();
    },

    start() {
        this.set_random_index();
        this.symbols.show_current_turn();
        this.board.fill('');
        this.draw_board();
        this.gameover = false;
        if (this.ai_playing) {
            AI.start();
        }
    },
    
    select_position(position, who) {
        this.make_play(position, who);
    },

    restart() {
        if (this.is_game_over()) {
            this.start();
            console.log('this game has been restarted!')
        } else if (confirm('Are you sure you want to restart this game?')) {
            this.start();
            console.log('this game has been restarted!')
        }
    },

    player_action() {
        this.make_play('${index}')
    },

    get_board_tag(symbol, index) {
        return `<div onclick="tic_tac_toe.select_position('${index}', 'player')"> ${symbol} </div>`;
    },

    get_board_tag_list() {
        return this.board.map(
            (symbol, index) => {
                return this.get_board_tag(symbol, index)
            }
        );
    },

    join_board_tags(board_lines) {
        return board_lines.reduce(
            (content, current) => content + current
        )
    },

    draw_board() {
        const board_tags = this.get_board_tag_list();
        const joined_tags = this.join_board_tags(board_tags);
        this.container_element.innerHTML = joined_tags;
    },

    select_game_mode(game_mode) {
        game_mode == "bot"?
            this.ai_playing = true:
            this.ai_playing = false
        this.start();
    }
};


const AI = {
    symbol: "O",

    /**
     *   
        [
            {
                position: 0,
                symbol: 'X'
            }
        ]
     */
    current_play_order: [],

    /**
     *  {
            status: "X" | "O",
            [
                {
                    position: 0,
                    symbol: 'X'
                }
            ]
        }
     */
    inferred_plays_remaining: [],

    /**
     * [
     *  {
            status: "tied",
            play_order: [
                {
                    position: 0,
                    symbol: 'X'
                }
            ]
        }
     * ]
     */
    history: [],

    set_ai_current_symbol(current_symbol) {
        symbol = current_symbol;
    },

    get_random_number(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    },

    random_play() {
        const selected_index = this.get_random_number(0, 9);
        tic_tac_toe.select_position(selected_index.toString(), 'ai');
    },

    get_infered_win_plays(match_list) {
        const infered_plays = [];
        for (let k = 0; k < match_list.length; k++) {
            for (let i = 0; i < this.current_play_order.length; i++) {
                if (
                    match_list[k].play_order[i] &&
                    match_list[k].play_order[i].symbol == this.current_play_order[i].symbol &&
                    match_list[k].play_order[i].position == this.current_play_order[i].position &&
                    match_list[k].status == this.symbol &&
                    (
                        (
                            match_list[k].play_order[0].symbol == match_list[k].status &&
                            match_list[k].play_order[0].symbol == this.current_play_order[0].symbol &&
                            match_list[k].play_order[0].position == this.current_play_order[0].position
                        ) || (
                            match_list[k].play_order[1].symbol == match_list[k].status&&
                            match_list[k].play_order[1].symbol == this.current_play_order[1].symbol &&
                            match_list[k].play_order[1].position == this.current_play_order[1].position
                        )
                    ) 
                ) { 
                    infered_plays.push(match_list[k]);
                }
            }
        }
        return infered_plays;
    },

    get_infered_tied_plays(match_list) {
        const infered_plays = [];
        for (let k = 0; k < match_list.length; k++) {
            for (let i = 0; i < this.current_play_order.length; i++) {
                if (
                    match_list[k].play_order[i] &&
                    match_list[k].play_order[i].symbol == this.current_play_order[i].position &&
                    match_list[k].play_order[i].position == this.current_play_order[i].position &&
                    match_list[k].status == 'tied' && (
                        (
                            match_list[k].play_order[0].symbol == this.current_play_order[0].symbol &&
                            match_list[k].play_order[0].position == this.current_play_order[0].position
                        ) || (
                            match_list[k].play_order[1].symbol == this.current_play_order[1].symbol &&
                            match_list[k].play_order[1].position == this.current_play_order[1].position
                        )
                    )
                ) {
                    infered_plays.push(match_list[k]);
                }    
            }
        }
        return infered_plays;
    },

    get_infered_plays(match_list) {
        const infered_win_plays = this.get_infered_win_plays(match_list);
        const infered_tied_plays = this.get_infered_tied_plays(match_list);
        const infered_plays = infered_win_plays.concat(infered_tied_plays);
        return infered_plays;
    },

    qt_plays() {
        return tic_tac_toe.board.reduce(
            (acc, num) => num != ''? acc + 1: acc, 0
        );
    },

    get_next_play(inferred_plays_remaining) {
        return inferred_plays_remaining[0]
            .play_order[this.qt_plays() + 1];
    },

    get_play() {
        this.inferred_plays_remaining = this.get_infered_plays(this.inferred_plays_remaining);
        if (this.inferred_plays_remaining.length > 0) {
            const next_play = this.get_next_play(this.inferred_plays_remaining);
            if (next_play) {
                tic_tac_toe.select_position(next_play.position.toString(), 'ai');
            }
        }
        this.random_play();
    },

    maped_execution() {
        if (
            this.inferred_plays_remaining.length > 0 &&
            this.qt_plays() > 0
        ) {
            return this.get_play();
        }
        this.random_play();
    },

    save_if_new_match() {
        const found = this.history.findIndex((match) => {
            return (
                JSON.stringify(this.current_play_order) == JSON.stringify(match.play_order) &&
                this.current_play_order != []
            )
        });
        if (found == -1) {
            this.history.push({
                status: tic_tac_toe.status,
                play_order: this.current_play_order
            })
            localStorage.setItem('history', JSON.stringify(this.history));
        }
    },

    register_player_move(position, symbol) {
        this.current_play_order.push({
            symbol,
            position
        })
    },

    load_history() {
        if (localStorage.getItem('history')) {
            this.history = JSON.parse(localStorage.getItem('history'));
        } else {
            this.history = [];
        }
    },

    make_play() {
        if (tic_tac_toe.is_ai_turn()) {
            this.maped_execution();
        }
        if (tic_tac_toe.is_game_over()) {
            this.save_if_new_match();
            return;
        }
        setTimeout(() => this.make_play(), 250);
    },

    start() {
        this.load_history();
        this.inferred_plays_remaining = this.history;
        this.current_play_order = [];
        this.make_play();
    }
}
