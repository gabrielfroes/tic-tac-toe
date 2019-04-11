// TIC TAC TOE
const tic_tac_toe = {

    // ATTRIBUTES
    board: ['','','','','','','','',''],
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
    init(container) {
        this.container_element = container;
    },

    make_play(position) {
        if (this.gameover) return false;
        if (this.board[position] === ''){
            this.board[position] = this.symbols.options[this.symbols.turn_index];
            this.draw();
            let winning_sequences_index = this.check_winning_sequences( this.symbols.options[this.symbols.turn_index] );
            if (winning_sequences_index >= 0  || !this.board.includes('')){
                this.game_is_over();
                this.start();
            } else{
                this.symbols.change();
            }
            return true;
        }
        else {
            return false;
        }
    },

    check_winning_sequences(simbol) {

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

    game_is_over() {
        this.gameover = true;
        console.log('GAME OVER');
    },

    start() {
        this.board.fill('');
        this.draw();
        this.gameover = false;       
    },

    draw() {
        this.container_element.innerHTML = this.board.map((elemento, indice) => `<div onclick="tic_tac_toe.make_play('${indice}')"> ${elemento} </div>`).reduce((content, current) => content + current);
    },
};