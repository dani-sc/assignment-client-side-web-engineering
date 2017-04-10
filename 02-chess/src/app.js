import { Chess } from 'chess.js';
import ChessBoard from 'chessboardjs';
import _ from 'lodash';
import $ from 'jquery';
import io from 'socket.io-client';
import config from './config';

// Add jquery to window, because chessboardjs and bootstrap need that
window.jQuery = window.$ = $;
require('bootstrap');

/* -------------------------------------------------------------------- */
/* Create game which contains the Chess logic, and initialize the board */
/* -------------------------------------------------------------------- */
const game = new Chess();
let player = {};

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

  const status = updateStatus(game);
  socket.emit('move', {
    move: move.san,
  });
  update();
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

  return status;
}

function update() {
  updateHistory();
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

function showNotification(title, text) {
  $('#dialog_notification__header').text(title);
  $('#dialog_notification__content').text(text);
  $('#modal_notification').modal();
}

function hideNotification() {
  $('#modal_notification').modal('hide');
}

/* -------------------------- */
/* Sockets with Event Handler */
/* -------------------------- */
const socket = io(config.SERVER_URL);
socket.on('connect', () => {
  console.log('connected');
});

socket.on('game created', (data) => {
  const gameId = data.game.id;
  console.log(`Game created, game id: ${gameId}`);
  showNotification('Game created', `A game with following Identifier has been created: ${gameId} The game starts as soon as someone else joins.`);
});

socket.on('game joined', (data) => {
  const gameId = data.game.id;
  console.log(`Game joined, game id: ${gameId}`);

  const playerColor = data.player.color;
  console.log(`Youre player color is ${playerColor}`);
  // player = data.player;
  player.color = data.player.color;
  // setupBoard();
  game.load_pgn(data.game.pgn);
  board.position(data.game.fen, false);
  board.orientation(playerColor);


  console.log(player);
});

socket.on('game started', () => {
  hideNotification();
  console.log(`Game started`);
});

socket.on('undo', () => {
  console.log(`Received: Undo`);
});

socket.on('restart', () => {
  console.log(`Received: Restart`);
});

socket.on('move', (data) => {
  console.log(`Received: move`);
  const move = game.move(data.move);
  board.move(`${move.from}-${move.to}`);
  board.position(game.fen());
  update();
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
