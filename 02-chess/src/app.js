import { Chess } from 'chess.js';
import ChessBoard from 'chessboardjs';
import $ from 'jquery';
import io from 'socket.io-client';
import config from './config';

// Add jquery to window, because chessboardjs and bootstrap need that
window.jQuery = window.$ = $; // eslint-disable-line no-multi-assign
require('bootstrap');

/* -------------------------------------------------------------------- */
/* Create game which contains the Chess logic, and initialize the board */
/* -------------------------------------------------------------------- */
const game = new Chess();
const player = {};

const onDragStart = (source, piece) => {
  if (game.game_over() === true
    || (game.turn() === 'w' && piece.search(/^b/) !== -1)
    || (game.turn() === 'b' && piece.search(/^w/) !== -1)
    || (game.turn() === 'w' && player.color === 'black')
    || (game.turn() === 'b' && player.color === 'white')) {
    return false;
  }
  return true;
};

const onDrop = (source, target) => {
  // see if the move is legal
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q',
  });

  // illegal move
  if (move === null) return 'snapback';

  removeHighlights(player.color);
  setHighlights(player.color, source, target);

  update();
  socket.emit('move', {
    move: move.san,
  });
};

const onSnapEnd = () => {
  board.position(game.fen());
};

const onMouseoverSquare = (square) => {
  const moves = game.moves({
    square,
    verbose: true,
  });

  if (moves.length === 0) {
    return;
  }

  highlightSquare(square);
  moves.forEach(move => highlightSquare(move.to));
};

const onMouseoutSquare = () => {
  removeHighlightedSquares();
};

let board = ChessBoard('board', {
  draggable: true,
  onDragStart,
  onDrop,
  onSnapEnd,
  onMouseoutSquare,
  onMouseoverSquare,
});
// Resize board based on window size
$(window).resize(board.resize);

function update() {
  updateStatus();
  updateHistory();
}

function updateStatus() {
  let status = '';

  let moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }

  if (game.in_checkmate() === true) { // checkmate?
    status = `Game over, ${moveColor} is in checkmate.`;
  } else if (game.in_draw() === true) { // draw?
    status = 'Game over, drawn position';
  } else { // game still on
    status = `${moveColor} to move`;

    // check?
    if (game.in_check() === true) {
      status += `, ${moveColor} is in check`;
    }
  }

  $('#game-status').text(status);
}

function updateHistory() {
  const listOfMoves = game.pgn().split(/ ?[0-9]+\. /);
  listOfMoves.shift();

  let html = '';
  listOfMoves.forEach((move) => {
    html += `<li>${move}</li>`;
  });
  $('#history').html(html);
}

/* ---------------------------------------- */
/* Past Moves Highlighting Helper Functions */
/* ---------------------------------------- */
function setHighlights(color, moveFrom, moveTo) {
  const $board = $('#board');
  $board.find(`.square-${moveFrom}`).addClass(`highlight-${color}`);
  $board.find(`.square-${moveTo}`).addClass(`highlight-${color}`);
}

function removeHighlights(color) {
  $('#board').find('.square-55d63')
    .removeClass(`highlight-${color}`);
}

/* ----------------------------------------- */
/* Legal Moves Highlighting Helper Functions */
/* ----------------------------------------- */
function removeHighlightedSquares() {
  $('#board .square-55d63').css('background', '');
}

function highlightSquare(square) {
  const $square = $(`#board .square-${square}`);

  let background = '#a9a9a9';
  if ($square.hasClass('black-3c85d')) {
    background = '#696969';
  }

  $square.css('background', background);
}

/* ------- */
/* Dialogs */
/* ------- */
$('#modal_joinOrCreateGame').modal({
  backdrop: 'static',
  keyboard: false,
  show: true,
});

function showGameCreatedModal(gameId) {
  $('#dialog_gameCreated__header').text('Game created');
  $('#dialog_gameCreated__content').text('A game with following identifier has been created. The game starts as soon as someone else joins.');
  $('#dialog_gameCreated__gameid').val(gameId);
  $('#modal_gameCreated').modal({
    backdrop: 'static',
    keyboard: false,
    show: true,
  });
}

function hideGameCreatedModal() {
  $('#modal_gameCreated').modal('hide');
}

function resetGameLocally() {
  game.reset();
  board.position(game.fen(), false);
  update();
  removeHighlights('white');
  removeHighlights('black');
}

/* -------------------------- */
/* Sockets with Event Handler */
/* -------------------------- */
const socket = io(config.SERVER_URL);
socket.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log('Connected to game server');
});

// Join game if game id in pathname
if (window.location.pathname.length > 1) {
  const gameId = window.location.pathname.substr(1);
  socket.emit('join game', { game: gameId });
  $('#modal_joinOrCreateGame').modal('hide');
}

socket.on('game created', (data) => {
  const gameId = data.game.id;
  showGameCreatedModal(gameId);
  window.history.pushState(null, `Chess - Game ${gameId}`, `/${gameId}`);
});

socket.on('game joined', (data) => {
  const gameId = data.game.id;
  window.history.pushState(null, `Chess - Game ${gameId}`, `/${gameId}`);

  player.color = data.player.color;

  game.load_pgn(data.game.pgn);
  board.position(data.game.fen, false);
  board.orientation(player.color);

  update();
});

socket.on('game started', () => {
  hideGameCreatedModal();
});

socket.on('move', (data) => {
  const move = game.move(data.move);
  board.move(`${move.from}-${move.to}`);
  board.position(game.fen());

  let otherPlayersColor = 'white';
  if (player.color === 'white') {
    otherPlayersColor = 'black';
  }
  removeHighlights(otherPlayersColor);
  setHighlights(otherPlayersColor, move.from, move.to);

  update();
});

socket.on('restart', () => {
  resetGameLocally();
});

/* ----------------------- */
/* Buttons onClick handler */
/* ----------------------- */
$('#btn_create-game').on('click', (event) => {
  event.preventDefault();
  socket.emit('new game');
  $('#modal_joinOrCreateGame').modal('hide');
});

$('#btn_join-game').on('click', (event) => {
  event.preventDefault();

  const gameId = $('#txt_game-id').val();
  socket.emit('join game', { game: gameId });

  $('#modal_joinOrCreateGame').modal('hide');
});

$('#btn_restart-game').on('click', (event) => {
  event.preventDefault();

  resetGameLocally();

  socket.emit('restart');
});
