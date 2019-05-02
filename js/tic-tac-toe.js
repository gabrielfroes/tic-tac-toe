/*jshint esversion: 6 */
const container = document.querySelector('.game');
const xx = document.querySelector('#x_campo');
const oo = document.querySelector('#o_campo');
const game_narration = document.querySelector('.game-narration');
const play = document.getElementById("play");
var x_campo = document.querySelector('#x_campo');
const o_campo = document.querySelector('#o_campo');

const banner = document.querySelector(".banner");
const winning_symbol = document.getElementById("s");
const winning_text = document.getElementById("w");

const score_x = document.getElementById("score_x");
const score_o = document.getElementById("score_o");

const tic_tac_toe = {
    // ATTRIBUTES
    board: ['','','','','','','','',''],
    symbols: {
      //option: ['〇','✕'],
      options: ['<span class="oo">〇</span>','<span class="xx">✕</span>'],
      turn_index: 0,
      change: function() {
        this.turn_index = ( this.turn_index === 0 ? 1:0 );
      }
    },
    container_element: null,
    gameover: false,
    turn: false,
    game_narration: null,
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
    score: {
      score_x: 0,
      score_o: 0
    },
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
        
        let {
          winning_sequences_index, winner
        } = this.check_winning_sequences(this.symbols.options[this.symbols.turn_index]);
        
        if (winning_sequences_index >= 0) {
          this.game_is_over(this.symbols.turn_index);
          this.stylize_winner_sequence(this.symbols.turn_index);
          
        } else if (this.check_draw()) {
          this.gameover = true;
          this.game_narration.textContent = 'old!';
          winning_symbol.innerHTML = "<span class='xx'>✕</span><span class='oo'>〇</span>";
          winning_text.innerText = "OLD!";
          container.style.display = "none";
          banner.style.display = "flex";
        } else {
          this.who_plays_machine_or_player();
        }
        return true;
      } else {
        return false;
      }
    },
    
    who_plays_machine_or_player: function() {
      if (this.turn === true) {
        this.symbols.change();
        if (this.bot.index == 1 && this.symbols.turn_index == 1) {
          this.machine(this.symbols.options[this.symbols.turn_index]);
        }
      } else {
        this.symbols.change();
      }
    },
    
    check_draw: function() {
      for (let i in this.board) {
        if (this.board[i] == '')
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
    
    stylize_winner_sequence: function(i) {
      
      if (i == "0") {
        winning_symbol.innerHTML = "<span class='oo'>〇</span>";
        winning_text.innerText = "WIN!";
        this.score.score_o += 1;
        score_o.innerHTML = '〇 - ' + this.score.score_o;
      } else {
        winning_symbol.innerHTML = "<span class='xx'>✕</span>";
        winning_text.innerText = "WIN!";
        this.score.score_x += 1;
        score_x.innerHTML = '✕ - ' + this.score.score_x;
      }
      container.style.display = "none";
      banner.style.display = "flex";
    },
  
    game_is_over: function(i) {
      this.gameover = true;
      this.game_narration.textContent = i == "0" ? this.players.o + ' win!' : this.players.x + ' win!';
      play.innerText = "Jogar novamente?";
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
        if (this.board[this.sequences[i][0]] == symbol)
          score++;
        if (this.board[this.sequences[i][1]] == symbol)
          score++;
        if (this.board[this.sequences[i][2]] == symbol)
          score++;
          
        if (score == 2) {
          if (this.board[this.sequences[i][0]] == '') {
            return this.sequences[i][0];
          }
          if (this.board[this.sequences[i][1]] == '') {
            return this.sequences[i][1];
          }
          if (this.board[this.sequences[i][2]] == '') {
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
      container.style.display = "grid";
      x_campo.style.display = "none";
      o_campo.style.display = "none";
      banner.style.display = "none";
      
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
        if (this.symbols.turn_index === 1) {
          this.machine();
        }
      }
    },
    
    setNarrationText: function() {
      this.game_narration.textContent = (this.symbols.turn_index === 1) ? this.players.o + ' turn!' : this.players.x + ' turn!';
    },
  
    draw: function() {
      let content = '';
      
      for (let i = 0; i < this.board.length; i++) {
        content += '<div onclick="tic_tac_toe.make_play(' + i + ')">' + this.board[i] + '</div>';
      }
      this.container_element.innerHTML = content;
    },
  };
tic_tac_toe.init(container, xx, oo, game_narration);
