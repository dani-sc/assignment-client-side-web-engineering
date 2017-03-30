function onDragStartFactory(game, player) {
  const onDragStart = (source, piece) => {
    console.log(`inside ondragstart`);
    console.log(player);
    if (game.game_over() === true
      || (game.turn() === 'w' && piece.search(/^b/) !== -1)
      || (game.turn() === 'b' && piece.search(/^w/) !== -1)
      || (game.turn() === 'w' && player.color === 'black')
      || (game.turn() === 'b' && player.color === 'white')) {
      return false;
    }
    return true;
  };
  return onDragStart;
}
/**
 * @param {function} callback(statusMessage, moveObject)
 */
function onDropFactory(game, callback) {
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
    callback(status, move);
  };
  return onDrop;
}

function updateStatus(game) {
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

export default {
  onDragStartFactory,
  onDropFactory,
};
