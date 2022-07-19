
const GameBoard = (function() {
  const _newGameBoard = new Array(9);
  const _casesFilled = 0;

  const initGameBoard = () => {
    for(let i = 0; i < _newGameBoard.length; i++){
      _newGameBoard[i] = '';
      DomEl.createSquare(i);
    }
    return 'Gameboard initialisée';
  }
  
  const fillCell = (index) => {
    if (Player.getCurrentPlayer() === undefined || Game.asWinner() === true) {
      alert('Partie terminée');
    } else if (_newGameBoard[index] === ''|| Game.asWinner() === false){
      _newGameBoard[index] = Player.getCurrentPlayer();
      this._casesFilled = _newGameBoard.filter(x => x !== '').length;
      Player.casePlay(index);
      DomEl.findSquare(index).innerHTML = Player.getCurrentPlayer();
      Game.checkWin(Player.getCurrentPlayer());
      Game.playerTurn();
      
      if(this._casesFilled === 9){
        DomEl.winner();
      }
    } 
  }

  const gameCanStart = () => {
    return Player.getPlayers().length === 2 ? DomEl.letStartGame() : false;
  }

  return {
    gameCanStart: gameCanStart,
    initGameBoard: initGameBoard,
    fillCell: fillCell
  }
})();

const Player = (function() {
  //Player init
  const _player = {
    name: '',
    marker: '',
    cases: []
  }
  const _players = [];
  const _currentPlayer = 'X';

  //Create player
  const createPlayer = (name, marker) => {
    if(_players.length !== 2){ // verify the numbers of players
      _player.name = name;
      _player.marker = marker;
      
      _players.push({ 'name': name, 'marker': marker, 'cases': []});
      DomEl.renderPlayer(_player);
    }else if(_players.length === 2){
      // Do something when the amount of player is ok
      alert('Pas de nouveau joueur possible');
    }
  };

  const getPlayer = (marker) => {
    let player = _players.find(el => el.marker === marker);
    return player ? player : false;
  }

  const casePlay = (index) => {
    const player = getCurrentPlayer();
    getPlayer(player).cases.push(index);
  }

  const getCurrentPlayer = () => {
    return this._currentPlayer;
  } 

  const setCurrentPlayer = (player) => {
    this._currentPlayer = player;
  }
  
  const getPlayers = () => _players;
  
  return { 
    createPlayer: createPlayer,
    getPlayers: getPlayers,
    getPlayer: getPlayer,
    casePlay: casePlay,
    getCurrentPlayer: getCurrentPlayer,
    setCurrentPlayer: setCurrentPlayer
  };
})();

const Game = (function(){
  const _winner = false; 
  const _winningFormulas = new Array(
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  );

  const checkWin = (currentPlayer) => {
    const playerCases = Player.getPlayer(currentPlayer).cases;
    for(let value of _winningFormulas){
      const v0 = value[0];
      const v1 = value[1];
      const v2 = value[2];
      if(playerCases.find(el => el === v0) !== undefined && playerCases.find(el => el === v1) !== undefined && playerCases.find(el => el === v2) !== undefined){
        this._winner = true;
        DomEl.winner(currentPlayer);
      }
    }
  }

  const gameReady = () => {
    return Player.getPlayers().length === 2 ? DomEl.letStartGame() : false;
  }

  const startGame = () => {
    GameBoard.initGameBoard();
    Player.setCurrentPlayer('X');
  }

  const playerTurn = () => {
    const currentPlayer = Player.getCurrentPlayer();
    currentPlayer === 'X' ? Player.setCurrentPlayer('0') : Player.setCurrentPlayer('X');
  }

  const asWinner = () =>  this._winner;

  return{
    gameReady: gameReady,
    startGame: startGame,
    playerTurn: playerTurn,
    checkWin: checkWin,
    asWinner: asWinner
  }
})();

const DomEl = (function() {
  const _forms = document.querySelectorAll('form');
  const _player1 = document.getElementById('player-1');
  const _player1Input = document.getElementById('player1Input');
  const _player2 = document.getElementById('player-2');
  const _player2Input = document.getElementById('player2Input');
  const _playersInformations = document.querySelector('#playersInformations');
  const _startGame = document.querySelector('#startGame');
  const _gameBoard = document.getElementById('gameBoard');
  const _square = document.querySelectorAll('.case');
  const _winnerBoard = document.querySelector('#winnerBoard');

  const formsListener = (player) => {
    switch (player) {
      case 1:
        return _player1;
        break;
      case 2:
        return _player2;
        break;
    }
  }

  const createSquare = (index) => {
    const square = document.createElement('div');
    square.setAttribute('data-index', index);
    square.classList.add('case');
    square.innerHTML = '';
    square.addEventListener('click', () => GameBoard.fillCell(index));
    _gameBoard.appendChild(square);
  }

  const findSquare = (index) => {
    const square = document.querySelectorAll('.case');
    return square[index];
  }

  const letStartGame = () => {
    _startGame.addEventListener('click', () => {
      Game.startGame();
    })
    _startGame.innerHTML = `<button>Start Game</button>`;
    
  }

  const startGame = () => {
    return _startGame.childNodes[0];
  }

  const playerBoard = (data) => {
    _playersInformations.innerHTML += `<p class="player">${data.name} - (${data.marker}) </p>`;
  };

  const winner = (marker) => {
    let player = Player.getPlayer(marker);
    if(player != false){
      let restartBtn = document.createElement('button');
      restartBtn.innerHTML = "Restart";
      _winnerBoard.innerHTML = `<p>${Player.getPlayer(marker).name} a gagné la partie</p>`;
      _winnerBoard.style.display = 'flex';
      _winnerBoard.appendChild(restartBtn);
    }else{
      _winnerBoard.innerHTML = `<p>Ex aequo</p>`;
      _winnerBoard.style.display = 'flex';
    }
  }

  return{
    formsListener: formsListener,
    renderPlayer: playerBoard,
    namePlayer1: _player1Input,
    namePlayer2: _player2Input,
    letStartGame: letStartGame,
    createSquare: createSquare,
    findSquare: findSquare,
    startGame: startGame,
    winner: winner
  };
})();

const DomEvent = (function() {
  DomEl.formsListener(1).addEventListener('submit', (e) => {
    e.preventDefault;
    e.stopImmediatePropagation;
    let playerName = DomEl.namePlayer1;
    Player.createPlayer(playerName.value, 'X');
    Game.gameReady();
    playerName.disabled = true;
  });
  DomEl.formsListener(2).addEventListener('submit', (e) => {
    e.preventDefault;
    e.stopImmediatePropagation;
    let playerName = DomEl.namePlayer2;
    Player.createPlayer(playerName.value, '0');
    Game.gameReady();
    playerName.disabled = true;
  });
  DomEl.startGame().addEventListener('click', () => {
    Game.startGame();
  })
})();