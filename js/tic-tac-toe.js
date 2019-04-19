// TIC TAC TOE
const tic_tac_toe = {

    // ATTRIBUTES
    board: [
        '','','',
        '','','',
        '','',''
    ],
    symbols: {
        options: ['O','X'],
        turn_index: 0,
        change: function(){
            this.turn_index = ( this.turn_index === 0 ? 1:0 );
        }
    },
    container_element: null,
    start_element: null,
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
    init: function(container, start) {
        this.container_element = container;
        this.start_element = start;
        console.log("Tic Tac Toe - Init");
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
            if (this.board[ this.winning_sequences[i][0] ] == simbol  &&
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
        console.log(this.container_element);
        console.log('GAME OVER');
    },

    start: function() {
        this.board.fill('');
        this.draw();
        this.gameover = false;       
    },

    draw: function() {
        let content = '';

        for ( i in this.board ) {
            content += '<div id="div' + i + '" onclick="tic_tac_toe.make_play(' + i + ')">' + this.board[i] + '</div>';
        };

        this.container_element.innerHTML = content;
        this.start_element.style.display = "none";
        this.container_element.style.display = "grid";
        console.log("Tic Tac Toe - Draw");
    },
};