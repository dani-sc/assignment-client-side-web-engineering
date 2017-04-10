import { Chess } from 'chess.js';
import ChessBoard from 'chessboardjs';
import _ from 'lodash';
import $ from 'jquery';
import io from 'socket.io-client';
import config from './config';
import chessGame from './chessGame';

// Add jquery to window, because chessboardjs and bootstrap need that
window.jQuery = window.$ = $;
require('bootstrap');

/* -------------------------------------------------------------------- */
/* Create game which contains the Chess logic, and initialize the board */
/* -------------------------------------------------------------------- */
const game = new Chess();
let player = {};

const onSnapEnd = () => {
  board.position(game.fen());
};

const onMove = (status, move) => {
  console.log("new status: " + status);
  socket.emit('move', {
    move: move.san,
  });
  update();
};

// let board = ChessBoard('board');
// $(window).resize(board.resize);
let board = ChessBoard('board', {
  draggable: true,
  onDragStart: chessGame.onDragStartFactory(game, player),
  onDrop: chessGame.onDropFactory(game, onMove),
  onSnapEnd,
});
// Resize board based on window size
$(window).resize(board.resize);

// function setupBoard() {
//   board = ChessBoard('board', {
//     draggable: true,
//     onDragStart: chessGame.onDragStartFactory(game, player),
//     onDrop: chessGame.onDropFactory(game, onMove),
//     onSnapEnd,
//   });
//   // Resize board based on window size
//   $(window).resize(board.resize);
// }

function update()  {
  console.log(`updating...`);
  updateHistory();
  console.log('after update history');
}

function updateHistory() {
  console.log(`Updating History`);
  const listOfMoves = game.pgn().split(/ ?[0-9]+\. /);
  listOfMoves.shift();
  console.log(game.pgn());
  // console.log(`pgn split: ${game.pgn().split(/ ?[0-9]+\. /)`);
  let html = '';
  listOfMoves.forEach((move) => {
    html += `<li>${move}</li>`;
  });
  $('#history').html(html);
}

/* SOCKETS */
const socket = io(config.SERVER_URL);
socket.on('connect', () => {
  console.log('connected');
});




// Dialogs
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

// Events
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
