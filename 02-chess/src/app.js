import ChessBoard from 'chessboardjs';
import $ from 'jquery';
import io from 'socket.io-client';
import config from './config';


// Add jquery to window, because chessboardjs needs that
window.$ = $;

const socket = io(config.SERVER_URL);
socket.on('connect', () => {
  console.log("connected");
});
// const socket = io.connect(`${config.SERVER_URL}/socket.io/socket.io.js`);
// socket.connect('connect', () => {
//   console.log('connected');
// });

const board = ChessBoard('board', 'start');
// Resize board based on window size
$(window).resize(board.resize);