var telaInicial = document.querySelector(".telaInicial");
var displayGame = document.querySelector(".game");
var displayOver = document.querySelector(".gameOver");
var textoVencedor = document.querySelector("#nomeWinner");
var btnRestart = document.querySelector(".btn");

var consultaSimbolos = [];
var valorUm = 0;
var valorDois = 0;

const jogoVelha = {
    board: ['','','','','','','','',''],
    simbols: { 
        options: ['X', 'O'],
        turnIndex : 0,
        change: function(){
            this.turnIndex = (this.turnIndex === 0 ? 1 : 0);
        }
    },
    containerElement: null,
    gameOver: false,
    winnerSequences: [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ],

    init: function(container){
        this.containerElement = container;
        //container vai ser a tela do jogo
    },

    makePlay: function(position){
        if(this.gameOver) return false;

        if(this.board[position] === ''){
            this.board[position] = this.simbols.options [ this.simbols.turnIndex];
            consultaSimbolos.push(this.simbols.turnIndex);
            this.draw();

            let winnerSequenceIndex = this.checkWinner( this.simbols.options [this.simbols.turnIndex]);

                if(this.isgameOver()){
                    this.gameisOver();
                    textoVencedor.innerHTML = "VELHA!";
                }

                if(winnerSequenceIndex >= 0){
                    this.gameisOver();
                    this.efeitoWinner(this.winnerSequences[winnerSequenceIndex]);
                }

                 else{
                    this.simbols.change();
                }

                return true;
            }

    },

    isgameOver() {
        return !this.board.includes(''); 
        // vai adicionar os simbolos de acordo com a posição do quadro ao array board
    },

    efeitoWinner(winnerSequences){
        winnerSequences.forEach((position) => {
            this
            .containerElement
            .querySelector(`div:nth-child(${position + 1})`)
            .classList.add('winner');

        });

    },

    gameisOver(){
        setTimeout(function(){
        displayOver.style.display = 'grid';
        displayGame.style.display = 'none';
        btnRestart.style.display = 'none';

        this.gameOver = true;
        console.log("Game over!");
        },2000);

        for (y in consultaSimbolos){

            if(consultaSimbolos[y] == 0){
                valorUm++;
            }

            if(consultaSimbolos[y] == 1){
                valorDois++;
            }
        }

        if(consultaSimbolos[y] == 0 || valorUm - 1 > valorDois){
            textoVencedor.innerHTML = "O vencedor foi o " +  '<br>' + " X " ;
        }

        if(consultaSimbolos[y] == 1 || valorDois - 1 > valorUm){
            textoVencedor.innerHTML = "O vencedor foi o " +  '<br>' + " O " ;
        } 

        btnRestart.style.display = 'none';
    },

    jogarNovamente(){
        displayOver.style.display = 'none';
        displayGame.style.display = 'grid';
        btnRestart.style.display = 'flex';

        this.board.fill('');
        this.draw();
        this.gameOver = false;
        valorUm = [];
        valorDois = [];
        consultaSimbolos = [];
    },

    start(){
        this.board.fill('');
        this.draw();
        this.gameOver = false;

        telaInicial.style.display = 'none';
        displayGame.style.display = 'grid';
        btnRestart.style.display = 'grid';

    },

    restart(){
        this.board.fill('');
        this.draw();
        this.gameOver = false;

        valorUm = [];
        valorDois = [];
        consultaSimbolos = [];  
    },

    checkWinner(simbol){
        for ( i in this.winnerSequences){
            if(this.board [this.winnerSequences[i][0]] == simbol && 
                this.board [this.winnerSequences[i][1]] == simbol && 
                this.board [this.winnerSequences[i][2]] == simbol){
                    return i;
            }
        };
        
        return -1;
    },

    draw(){
        let content = '';
        for ( i in this.board){
            content += '<div onclick="jogoVelha.makePlay(' + i + ')">' + this.board[i] + '</div>';
            // i vai ser os números, do board
            // content vai ser as divs que serão criadas
        }
        this.containerElement.innerHTML = content;

    }
};



