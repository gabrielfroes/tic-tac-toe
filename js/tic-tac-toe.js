// TIC TAC TOE
const tic_tac_toe = {

    // ATTRIBUTES
    board: ['','','','','','','','',''],
    symbols: {
                options: ['O','X'],
                turn_index: 0,
                change(){
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
        if (this.gameover || this.board[position] !== '') return false;

        const currentSymbol = this.symbols.options[this.symbols.turn_index];
        this.board[position] = currentSymbol;
        this.draw();

        const winning_sequences_index = this.check_winning_sequences(currentSymbol);
        if (this.is_game_over()){
            this.game_is_over();
        }
        if (winning_sequences_index >= 0) {
            scoreboard.win(); // SCOREBOARD
            this.game_is_over();
            this.stylize_winner_sequence(this.winning_sequences[winning_sequences_index]);
        } else {
            this.symbols.change();
        }
        scoreboard.draw(); // SCOREBOARD

        return true;
    },

    stylize_winner_sequence(winner_sequence) {
        winner_sequence.forEach((position) => {
          this
            .container_element
            .querySelector(`div:nth-child(${position + 1})`)
            .classList.add('winner');
        });
      },

    check_winning_sequences(symbol) {

        for ( i in this.winning_sequences ) {
            if (this.board[ this.winning_sequences[i][0] ] == symbol  &&
                this.board[ this.winning_sequences[i][1] ] == symbol &&
                this.board[ this.winning_sequences[i][2] ] == symbol) {
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

    is_game_over() {
        return !this.board.includes('');
    },

    start() {
        this.board.fill('');
        this.draw();
        this.gameover = false;
        scoreboard.draw(); // SCOREBOARD
    },

    restart() {
        if (this.is_game_over() || this.gameover) {
            this.start();
            console.log('this game has been restarted!')
        } else if (confirm('Are you sure you want to restart this game?')) {
            this.start();
            console.log('this game has been restarted!')
        }
    },

    draw() {
        this.container_element.innerHTML = this.board.map((element, index) => `<div onclick="tic_tac_toe.make_play('${index}')"> ${element} </div>`).reduce((content, current) => content + current);
    },
};

// SCOREBOARD
var scoreboard = {
    playerX: 0,
    playerO: 0,
    win(){
        var current_player = tic_tac_toe.symbols.turn_index
        if(current_player == 0){
            this.playerO++
        }
        else{
            this.playerX++
        }
    },
    reset(){
        this.playerO = 0
        this.playerX = 0
        this.draw()
        tic_tac_toe.restart()
    },
    winner(){
        if(this.playerX > this.playerO){
            return 'Player X winning !!!'
        }
        else if(this.playerX == this.playerO){
            return 'No winner !!!'
        }
        else{
            return 'Player O winning !!!'
        }
    },
    draw(){
        var scores = document.getElementById('scoreboard')
        scores.innerHTML = `<p>Player O &nbsp; : &nbsp; ${this.playerO}<br/>Player X &nbsp; : &nbsp; ${this.playerX}</p><p>${this.winner()}</p>`
    }
}