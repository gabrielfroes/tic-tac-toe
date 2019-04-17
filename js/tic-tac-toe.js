// TIC TAC TOE
const tic_tac_toe = {

    // ATTRIBUTES
    board: ['','','','','','','','',''],
    player_o_wins: 0,
    player_x_wins: 0,
    player_o_element: null,
    player_x_element: null,
    won_message_element: null,
    symbols: {
                options: ['O','X'],
                turn_index: 0,
                change: function(){
                    this.turn_index = ( this.turn_index === 0 ? 1:0 );
                }
            },
    container_element: null,
    gameover: false,
    winning_sequences: [
                        [0,1,2],
                        [3,4,5],
                        [6,7,8],
                        [0,3,6],
                        [1,4,7],
                        [2,5,8],
                        [0,4,8],
                        [2,4,6]
                    ],

    // FUNCTIONS
    init: function(container, player_o_text, player_x_text, won_message_text) {
        this.container_element = container;
        this.player_o_element = player_o_text;
        this.player_x_element = player_x_text;
        this.won_message_element = won_message_text;
    },

    make_play: function(position) {
        if (this.gameover) return false;
        if (this.board[position] === ''){
            this.board[position] = this.symbols.options[this.symbols.turn_index];
            this.draw();
            let winning_sequences_index = this.check_winning_sequences( this.symbols.options[this.symbols.turn_index] );
            if (winning_sequences_index >= 0){
                this.game_is_over();
            } else{
                this.symbols.change();
            }
            return true;
        }
        else {
            return false;
        }
    },

    check_winning_sequences: function(simbol) {

        for ( i in this.winning_sequences ) {
            if (this.board[ this.winning_sequences[i][0] ] == simbol &&
                this.board[ this.winning_sequences[i][1] ] == simbol &&
                this.board[ this.winning_sequences[i][2] ] == simbol) {
                console.log('winning sequences INDEX:' + i);
                return i;
            }
        };
        return -1;
    },

    game_is_over: function() {
        this.gameover = true;
        this.symbols.turn_index === 0 ? this.player_o_wins++ : this.player_x_wins++;
        this.won_message_element.innerHTML = 'The Player '+this.symbols.options[this.symbols.turn_index]+' Won';
        console.log('GAME END '+this.symbols.options[this.symbols.turn_index]);
    },

    start: function() {
        this.won_message_element.innerHTML = ''; 
        this.board.fill('');
        this.draw();
        this.gameover = false;       
    },

    draw: function() {
        let content = '';

        for ( i in this.board ) {
            content += '<div onclick="tic_tac_toe.make_play(' + i + ')">' + this.board[i] + '</div>';
        };

        this.container_element.innerHTML = content;
        this.player_o_element.innerHTML = "Player O Victorys: "+this.player_o_wins;
        this.player_x_element.innerHTML = "Player X Victorys: "+this.player_x_wins;
    },
};