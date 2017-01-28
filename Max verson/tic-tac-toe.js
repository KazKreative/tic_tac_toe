// TicTacToe is our main object. There is only one game at a time, so we're
// defining it right here and putting all of the relevant data inside it.
var TicTacToe = {
  // All of our element references will go in here.
  dom: {
    gameStatus: null,
    gameBoard: null,
    playButton: null
  },

  // Keep track of the current player separate from the DOM so we don't
  // have to look up the gameStatus message just to know whose turn it is.
  currentPlayer: null,

  // This is kind of weird, but it lets us work with familiar words like
  // PLAYER_ONE without running into pesky off-by-one errors all the time
  PLAYER_ONE: 0,
  PLAYER_TWO: 1,
  gamePieces: ["X", "O"],

  // initialize() is a conventional name for the function you call when your
  // program is "booting up". The game hasn't started yet; that doesn't happen
  // until playButton is clicked and beginGame() is called.
  initialize: function() {
    // Store some convenience variables
    this.dom.gameStatus = document.getElementById("gameStatus");
    this.dom.gameBoard = document.getElementById("gameBoard");
    this.dom.playButton = document.getElementById("playButton");

    // Initializers are a good place to attach event handlers.
    // When handlers are attached inside an object (this.*), we have to call
    // bind(this) on them or they'll forget where they came from, and all of
    // our "this.*" references will be undefined.
    this.dom.playButton.onclick = this.beginGame.bind(this);
    this.dom.gameBoard.onclick = this.playerBoardClick.bind(this);

    // Fill gameStatus with its pre-game message
    this.updateStatus("Press 'Play' to begin.");
  },

  // Convenience function so we don't have to type the whole thing
  updateStatus: function(message) {
    this.dom.gameStatus.textContent = message;
  },

  beginGame: function() {
    // hide the playButton
    this.dom.playButton.style.display = "none";
    // this is how the click handler will know whether the game is in progress
    this.dom.gameBoard.classList.add("active");
    // player one goes first.
    this.playerOneTurn();
  },

  playerBoardClick: function(event) {
    // we're not returning to anyone in particular; it's just less hassle than
    // wrapping the entire function in an indented if statement. think of this
    // usage of "return false;" as saying "stop everything!"
    if(!this.dom.gameBoard.classList.contains("active")) return false;
    if(!this.isValidMove(event.target)) return false;

    // get the letter that corresponds to the current player
    var piece = this.gamePieces[this.currentPlayer];
    event.target.textContent = piece;

    // move the game forward
    this.advanceGame();
  },

  isValidMove: function(element) {
    // Putting the conditions into functions makes compound conditionals like
    // this much easier to maintain.
    return (
      this.elementIsASpace(element) &&
      this.spaceIsEmpty(element)
    );
  },

  // Bundle our board logic in functions so we can write new tests without
  // having to remember exactly what the conditions are
  elementIsASpace: function(element) { return element.tagName === "TD"; },
  spaceIsEmpty: function(space) { return space.textContent === ""; },

  // We've already defined what it means for a space to be empty, and being
  // filled is just the opposite of that
  spaceIsFilled: function(space) { return !this.spaceIsEmpty(space); },

  // The playerBoardClick() function was getting pretty complex, so it made
  // sense to isolate the decisions for turn swapping & game over
  advanceGame: function() {
    // use our fancy BoardChecker to encapsulate all of the end condition logic
    var board = new BoardChecker();

    // the BoardChecker tells us about the board
    if(board.threeConsecutiveSpaces("X"))
      // and we decide what to say about it
      this.gameOver("Player 1 wins!");

    else if(board.threeConsecutiveSpaces("O"))
      this.gameOver("Player 2 wins!");

    else if(board.isFull())
      this.gameOver("Draw.");

    else
      // if no end conditions are met, just change the turn
      this.changeTurn();
  },

  changeTurn: function() {
    // This if statement has just one statement per condition, so we don't need
    // to use curly braces to separate them.
    if(this.currentPlayer === this.PLAYER_ONE)
      this.playerTwoTurn();
    else if(this.currentPlayer === this.PLAYER_TWO)
      this.playerOneTurn();
    else
      // theoretically, this condition should never be met, but it pays to be
      // a little bit paranoid. with an alert, it will never fail silently.
      // if you're feeling squirrely, you can test it out by starting the game
      // and then typing "TicTacToe.currentPlayer = 5" into Chrome console
      alert("Unknown player! CONTACT THE TIC-TAC-TOE POLICE!!");
  },

  playerOneTurn: function() {
    this.currentPlayer = this.PLAYER_ONE;
    this.updateStatus("Player 1's turn.");
  },

  playerTwoTurn: function() {
    this.currentPlayer = this.PLAYER_TWO;
    this.updateStatus("Player 2's turn.");
  },

  gameOver: function(message) {
    this.updateStatus(message);
    this.dom.gameBoard.classList.remove("active");
  }
};

// BoardChecker starts with an array of three empty arrays, then populates it
// with board data with a state-of-the-art DOUBLE FOR LOOP that reconstructs
// the ID of each cell on the board.
//
// Notice that TicTacToe was created using "var TicTacToe = {}", but here we
// use a constructor function and "new BoardChecker()". This is because there
// is only ever one TicTacToe, but we create another BoardChecker every time
// a player takes their turn.
function BoardChecker() {
  this.rows = [[],[],[]];

  for(var row=0; row <= 2; row++) {
    for(var col=0; col <= 2; col++) {
      // from row-0-column-0 to row-2-column-2
      var id = "row-" + row + "-column-" + col;
      // should be either null, "X", or "O"
      var contents = document.getElementById(id).textContent;
      if(contents === "") this.rows[row][col] = null;
      else this.rows[row][col] = contents;
    }
  }

  this.threeConsecutiveSpaces = function(piece) {
    return (
      this.checkRows(piece) ||
      this.checkColumns(piece) ||
      this.checkDiagonals(piece)
    );
  };

  // The following three functions are awfully similar.
  // I wonder if there's a way to condense them...

  this.checkRows = function(piece) {
    for(var i=0; i <= 2; i++) {
      if(
        this.rows[i][0] === piece &&
        this.rows[i][1] === piece &&
        this.rows[i][2] === piece
      ) return true;
    }
    return false;
  };

  this.checkColumns = function(piece) {
    for(var column=0; column <= 2; column++) {
      if(
        this.rows[0][column] === piece &&
        this.rows[1][column] === piece &&
        this.rows[2][column] === piece
      ) return true;
    }
    return false;
  };

  this.checkDiagonals = function(piece) {
    // top left (0, 0) to bottom right (2, 2)
    if(
      this.rows[0][0] === piece &&
      this.rows[1][1] === piece &&
      this.rows[2][2] === piece
    ) return true;
    // bottom left (2, 0) to top right (0, 2)
    if(
      this.rows[2][0] === piece &&
      this.rows[1][1] === piece &&
      this.rows[0][2] === piece
    ) return true;
    return false;
  };

  this.isFull = function(rows) {
    // assume the board is full...
    var boardIsFull = true;
    this.rows.forEach((spaces) => {
      spaces.forEach((space) => {
        if(space === null) {
          // ... unless we find an empty cell.
          boardIsFull = false;
        }
      });
    });
    // in the previous functions, we used the "early return" trick to close up
    // shop as soon as we found the condition we were looking for. but in this
    // function, we used a bunch of callbacks, so we have to wait for them to
    // finish and then return.
    return boardIsFull;
  };
}

TicTacToe.initialize();
// cheat so I don't have to click the button every time I refresh
//TicTacToe.beginGame();
