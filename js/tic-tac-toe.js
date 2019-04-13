// TIC TAC TOE
const tic_tac_toe = {

    // ATTRIBUTES
    board: {
        positions: ['','','','','','','','',''],
        boardElement: document.querySelector('.game'),

        setPosition: function(position, player){
            this.positions[position] = player;
            this.draw();
        },
        init: function() {
            this.positions.fill('');
            this.draw();
        },
        draw: function() {
            let content = '';
    
            for ( i in this.positions ) {
                content += `<div onclick="tic_tac_toe.make_play(${i})">${this.positions[i]}</div>`;
            };
    
            this.boardElement.innerHTML = content;
        }
    },
    players: {
                player_sign: ['O','X'],
                turn_index: 0,
                change: function(){
                    this.turn_index = ( this.turn_index === 0 ? 1:0 );
                },
                getCurrentPlayer: function(){
                    return this.player_sign[this.turn_index];
                }
            },
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
    make_play: function(position) {
        if (this.gameover) return false;
        if (this.board.positions[position] !== '') return false;
        
        this.board.setPosition(position, this.players.getCurrentPlayer())
        
        let winner = this.check_winning_sequences_for( this.players.getCurrentPlayer() );
        if (winner){
            this.game_is_over();
        } else{
            this.players.change();
        }
        return true;
    },

    check_winning_sequences_for: function(currentPlayer) {

        for ( i in this.winning_sequences ) {
            if (this.board.positions[ this.winning_sequences[i][0] ] == currentPlayer  &&
                this.board.positions[ this.winning_sequences[i][1] ] == currentPlayer &&
                this.board.positions[ this.winning_sequences[i][2] ] == currentPlayer) {
                console.log('winning sequences INDEX:' + i);
                return true;
            }
        };
        return false;
    },

    game_is_over: function() {
        this.gameover = true;
        console.log('GAME OVER');
    },

    start: function() {
        this.board.init();
        this.gameover = false;       
    }
};