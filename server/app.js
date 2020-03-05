const gameLoop = require('./src/gameloop');
const Game = require('./src/game');
const Server = require('./src/http-helpers/server');
const Rounting = require('./src/http-helpers/rounting');

const rounting = new Rounting();
const requestHandler = rounting.buildRequestHander.bind(rounting);
const server = new Server(requestHandler);
server.run();

// const game = new Game(5);
// game.startGame();

// const id = gameLoop.startGameLoop(30, game.refresh.bind(game));
// setTimeout(() => {
//   gameLoop.stopGameLoop(id);
// }, 6000)