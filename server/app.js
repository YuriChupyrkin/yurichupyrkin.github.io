const gameLoop = require('./src/gameloop');
const Game = require('./src/game');


const game = new Game(5);
game.startGame();

const id = gameLoop.startGameLoop(30, game.refresh.bind(game));
setTimeout(() => {
  gameLoop.stopGameLoop(id);
}, 6000)