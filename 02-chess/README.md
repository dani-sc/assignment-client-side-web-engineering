# 04-chess

> When you see a good move, look for a better one

## Assignment

* Implement a multiplayer chess board.
* Use [chessboardjs](https://www.npmjs.com/package/chessboardjs) and [chess.js](https://www.npmjs.com/package/chess.js)
* Read server docs.

### Notes by me
* When creating a game, you automatically join it as well.
* As soon as another player joins the game, the game started event is emitted.

## Setup

```bash
npm install
```

## Dev

```bash
grunt start
```

## Build

```bash
grunt
```

## Server

The client receives commands from and send commands to the chess server.
Consume events or emit commands to create a game.

### Commands

* `socket.emit('join game', data)`

  ```
  data = {
    game: <name of game>
  }
  ```

* `socket.emit('new game')`
* `socket.emit('move', data)`

  ```
  data = {
    move: <move in SAN notation>
  }
  ```

* `socket.emit('restart')`
* `socket.emit('undo')`

### Events

* `.on('game created', data)`

  ```
  data = {
    game: {
      id: <name of game>
    }
  }
  ```

* `.on('game started')`
* `.on('game joined', data)`

  ```
  data = {
    game: {
      pgn: <position in pgn notation>,
      fen: <position in fen notation>
    },
    player: {
      color: <color of player>
    }
  }
  ```

* `.on('undo')`
* `.on('restart')`
* `.on('move', data)`

  ```
  data = {
    move: {
      from: <start position>,
      to: <target position>
    }
  }
  ```
