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
    init: function(container) {
        this.container_element = container;
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
                this.on_make_play();
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
                this.on_win();
                this.point_to_player(this.symbols.turn_index);
                return i;
            }
        };
        return -1;
    },

    point_to_player: function(player)
    {
        var player_id = this.symbols.options[player];
        var player_dom = document.getElementById(player_id);
        var current_player_point = parseFloat(player_dom.getElementsByTagName('span')[1].innerHTML) + 1;
        var player_point = player_dom.getElementsByTagName('span')[1];

        player_point.innerHTML = current_player_point;
    },

    on_make_play: function()
    {
        var win_sound = new Audio('mp3/on_make_play.mp3');
        win_sound.play();
    },

    on_win: function(){

        var win_sound = new Audio('mp3/on_win.mp3');
        win_sound.play();

    },

    game_is_over: function() {
        this.gameover = true;
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
            content += '<div onclick="tic_tac_toe.make_play(' + i + ')">' + this.board[i] + '</div>';
        };

        this.container_element.innerHTML = (content);
    },
};