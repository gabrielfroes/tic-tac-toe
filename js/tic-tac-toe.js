/*jshint esversion: 6 */
const container = document.querySelector('.game');
const xx = document.querySelector('#x_campo');
const oo = document.querySelector('#o_campo');
const game_narration = document.querySelector('.game-narration');
const play = document.getElementById("play");
var x_campo = document.querySelector('#x_campo');
const o_campo = document.querySelector('#o_campo');

const tic_tac_toe = {
    // ATTRIBUTES
    board: ['','','','','','','','',''],
    symbols: {
      options: ['〇','✕'],
      turn_index: 0,
      change: function() {
        this.turn_index = ( this.turn_index === 0 ? 1:0 );
      }
    },
    container_element: null,
    gameover: false,
    botwin: null,
    turn: false,
    game_narration: null,
    victory_value: "〇",
    sequences: [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ],
    players: {
      x: '✕',
      o: '〇',
      input_x: null,
      input_o: null
    },
    bot: {
      index: 1,
    },
    
    // FUNCTIONS
    init: function(container, xx, oo, game_narration) {
      
      this.container_element = container;
      this.players.input_x = xx;
      this.players.input_o = oo;
      this.game_narration = game_narration;
      this.gameover = true;
    },

    make_play: function(position) {
      if (this.gameover) return false;
      
      if (this.board[position] === '') {
          this.board[position] = this.symbols.options[this.symbols.turn_index];
          this.setNarrationText();
          this.draw();
          
          let { winning_sequences_index, winner } = this.check_winning_sequences(this.symbols.options[this.symbols.turn_index]);
        
        if (winning_sequences_index >= 0) {
          this.game_is_over(winner);
          this.stylize_winner_sequence(this.sequences[winning_sequences_index]);
          this.victory_value = winner;
        } else if (this.check_draw()) {
          this.gameover = true;
          this.game_narration.textContent = 'old!';
        } else {
          if (this.turn === true) {
            this.symbols.change();
            if (this.bot.index == 1 && this.symbols.turn_index == 1) {
              this.machine(this.symbols.options[this.symbols.turn_index]);
            }
          } else {
            this.symbols.change();
          }
        }
        return true;
      } else {
        return false;
      }
    },
    
    check_draw: function() {
      for (let i in this.board) {
        if (this.board[i] === '')
          return false;
      }
      return true;
    },
    
    check_winning_sequences: function(symbol) {
    
      for (let i in this.sequences ) {
        if (this.board[ this.sequences[i][0] ] == symbol && this.board[ this.sequences[i][1] ] == symbol && this.board[ this.sequences[i][2] ] == symbol) {
          
          return { winning_sequences_index: i, winner: symbol };
        }
      }
      return -1;
    },
    
    stylize_winner_sequence: function(winner_sequence) {
      winner_sequence.forEach((position) => {
        this.container_element
          .querySelector(`div:nth-child(${position + 1})`)
          .classList.add('winner');
      });
    },
  
    game_is_over: function(winner) {
      this.gameover = true;
      this.game_narration.textContent = winner === '〇' ? this.players.o + ' win!' : this.players.x + ' win!';
      play.innerText = "Jogar novamente?";
      this.botwin = winner;
    },
    
    machine: function() {
      //Jogar para ganhar | Jogar para defesa
      if (this.machine_strategic_move(this.symbols.options[this.symbols.turn_index]) > -1) {
        this.make_play(this.machine_strategic_move(this.symbols.options[this.symbols.turn_index]));
        
      } else if (this.machine_strategic_move(this.symbols.options[this.turn_index === 0 ? 1 : 0]) > -1) {
        
        this.make_play(this.machine_strategic_move(this.symbols.options[this.turn_index === 0 ? 1 : 0]));
        
      } else {
        this.make_play(this.machine_random_move());
        
      }
    },
    
    machine_strategic_move: function (symbol) {
      
      let score;
      for (let i = 0; i < this.sequences.length; i++) {
        score = 0;
        if (this.board[this.sequences[i][0]] === symbol)
          score++;
        if (this.board[this.sequences[i][1]] === symbol)
          score++;
        if (this.board[this.sequences[i][2]] === symbol)
          score++;
          
        if (score == 2) {
          if (this.board[this.sequences[i][0]] === '') {
            return this.sequences[i][0];
          }
          if (this.board[this.sequences[i][1]] === '') {
            return this.sequences[i][1];
          }
          if (this.board[this.sequences[i][2]] === '') {
            return this.sequences[i][2];
          }
        }
      }
      return -1;
    },
    
    machine_random_move: function() {
      let position;
      do {
        position = Math.floor(Math.random() * 8 );
      } while (this.board[position] !== '');
      return position;
    },
  
    start: function() {
      x_campo.style.display = "none";
      o_campo.style.display = "none";
      
      this.players.o = !this.players.input_o.value ? '〇' : this.players.input_o.value;
      
      this.players.x = !this.players.input_x.value ? '✕' : this.players.input_x.value;
      
      this.board.fill('');
      
      if (this.symbols.turn_index === 1) {
        this.game_narration.textContent = this.players.x + ' turn!';
      } else {
        this.game_narration.textContent = this.players.o + ' turn!';
      }
      
      this.gameover = false;
      play.innerText = "REPLAY";
      this.draw();
      
      if (this.turn === true) {
        if (this.botwin === "✕" && this.symbols.turn_index === 1) {
          this.machine();
        }
      }
    },
    
    setNarrationText: function() {
      this.game_narration.textContent = (this.symbols.turn_index === 1) ? this.players.o + ' turn!' : this.players.x + ' turn!';
    },
  
    draw: function() {
      let content = '';
      
      for (let i=0; i < this.board.length; i++) {
        content += '<div onclick="tic_tac_toe.make_play(' + i + ')">' + this.board[i] + '</div>';
      }
      
      this.container_element.innerHTML = content;
    },
  };

tic_tac_toe.init(container, xx, oo, game_narration);
