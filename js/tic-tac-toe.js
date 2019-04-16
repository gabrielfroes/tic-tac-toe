const container = document.querySelector('.game');
const xx = document.querySelector('#x_campo');
const oo = document.querySelector('#o_campo');
const game_narration = document.querySelector('.game-narration');

const play = document.getElementById("play");
const replay = document.getElementById("replay");

var x_campo = document.querySelector('#x_campo'); 
var o_campo = document.querySelector('#o_campo');

const tic_tac_toe = {
    // ATTRIBUTES
    board: ['','','','','','','','',''],
    simbols: {
      options: ['〇','✕'],
      turn_index: 0,
      change: function() {
        this.turn_index = ( this.turn_index === 0 ? 1:0 );
      }
    },
    container_element: null,
    gameover: false,
    botwin: null,
    vez: false,
    game_narration: null,
    valor: "〇",
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
          this.board[position] = this.simbols.options[this.simbols.turn_index];
          this.setNarrationText();
          this.draw();
          
          let { winning_sequences_index, winner } = this.check_winning_sequences(this.simbols.options[this.simbols.turn_index]);
        
        if (winning_sequences_index >= 0) {
          this.game_is_over(winner);
          this.stylize_winner_sequence(this.sequences[winning_sequences_index]);
          this.valor = winner;
        } else {
          if (this.vez === true) {
            this.simbols.change();
            this.bot();
          } else {
            this.simbols.change();
          }
        }
        
        return true;
      } else {
        return false;
      }
    },
    
    check_winning_sequences: function(simbol) {
    
      for (var i in this.sequences ) {
        if (this.board[ this.sequences[i][0] ] == simbol && this.board[ this.sequences[i][1] ] == simbol && this.board[ this.sequences[i][2] ] == simbol) {
          
          return { winning_sequences_index: i, winner: simbol };
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
      this.game_narration.textContent = winner === '〇' ? `${this.players.o} win!` : `${this.players.x} win!`;
      //tempo = "a";
      play.innerText = "Jogar novamente?";
      this.botwin = winner;
      
    },
    
    bot: function() {
      let gera = Math.round(Math.random() * 9);
      let position = gera;
      
      gera = this.sequences;
      var x = this.simbols.options[this.simbols.turn_index];
      
      if (x === "✕") this.repeat(position);
    },
    
    repeat: function(position) {
      if(this.board[position] === '') {
        this.make_play(position);
      } else {
        this.bot();
      }
    },
  
    start: function() {
      x_campo.style.display = "none";
      o_campo.style.display = "none";
      
      this.players.o = !this.players.input_o.value ? '〇' : this.players.input_o.value;
      
      this.players.x = !this.players.input_x.value ? '✕' : this.players.input_x.value;
      
      this.board.fill('');
      
      if (this.simbols.turn_index === 1) {
        this.game_narration.textContent = `${this.players.x} turn! `;
      } else {
        this.game_narration.textContent = `${this.players.o} turn! `;
      }
      
      this.gameover = false;
      play.innerText = "REPLAY";
      this.draw();
      
      if (this.vez === true) {
        if (this.botwin === "✕" || this.simbols.turn_index === 1) {
          this.bot();
        }
      }
    },
    
    check_draw: function () {
      let played = 0;
      for (var i in this.board) {
        if (this.board[i] !== '') {
          played++;
        }
      }
      return played >= this.board.length;
    },
    
    setNarrationText: function() {
      // 0 - o | 1 - x
      //this.game_narration.textContent = (this.simbols.turn_index === 0) ? `${this.players.x} turn!` : `${this.players.o} turn!`;
      
      this.game_narration.textContent = (this.simbols.turn_index === 1) ? `${this.players.o} turn!` : `${this.players.x} turn!`;
    },
  
    draw: function() {
      let content = '';
        
        if (this.check_draw() === true) {
        this.gameover = true;
        this.game_narration.textContent = 'old!';
        }
      
      for (var i in this.board ) {
        content += '<div onclick="tic_tac_toe.make_play(' + i + ')">' + this.board[i] + '</div>';
      }
      
      this.container_element.innerHTML = content;
    },
    
  };
  
/*
// Tempo em segundos
var tempo = 150; //150
function startCountdown() {
  // Se o tempo não for zerado
  if ((tempo - 0) >= 0) {
    
    // Pega a parte inteira dos minutos
    var min = parseInt(tempo/60);
    // Calcula os segundos restantes
    var seg = tempo%60;
    
    // Formata o número menor que dez, ex: 08, 07, ...
    if (min < 10) {
      min = "0"+min;
      min = min.substr(0, 2);
    }
    if (seg <= 9) {
      seg = "0"+seg;
    }
    
    // Cria a variável para formatar no estilo hora/cronômetro
    horaImprimivel =  min + ':' + seg;
    document.getElementById("sessao").innerHTML = horaImprimivel;
    
    // Define que a função será executada novamente em 1000ms = 1 segundo
    setTimeout(`startCountdown()`,1000);
    
    // diminui o tempo
    tempo--;
    
    if (min == 01 && seg == 50) {
      document.getElementById("sessao").style.color = "red";
    }
    
    // Quando o contador chegar a zero faz esta ação
    if (min == "00" && seg == "00") {
      setTimeout(`restart()`,4000);
    }
    
  }
  
}
*/

  tic_tac_toe.init(container, xx, oo, game_narration);
  
  //startCountdown();

function restart() {
  window.location.reload(true);
}
