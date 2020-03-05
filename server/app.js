const Game = require('./src/game/game');
const Server = require('./src/http-helpers/server');
const Rounting = require('./src/http-helpers/rounting');
const WebsocketServer = require('./src/http-helpers/websocket-server');

const NOTIFY_CLIENTS_ACTION_NAME = 'game-state-refresh'

const rounting = new Rounting();
const requestHandler = rounting.buildRequestHander.bind(rounting);

const game = new Game(5);
const server = new Server(requestHandler);

// run server
const httpServer = server.run();
const websocketServer = new WebsocketServer(httpServer, NOTIFY_CLIENTS_ACTION_NAME);

// set connection between websocket server and game
connectGameServer(game, websocketServer);

websocketServer.run();
game.startGame();

function connectGameServer(game, websocketServer) {
  const onRefreshPlayer = game.onRefreshPlayer.bind(game);
  const onPlayerShoot = game.onPlayerShoot.bind(game);
  const onPlayerConnected = game.onPlayerConnected.bind(game);
  const notifyPlayers = websocketServer.notify.bind(websocketServer);

  websocketServer.setonRefreshPlayerCallback(onRefreshPlayer);
  websocketServer.setOnPlayerConnectedCallback(onPlayerConnected);
  websocketServer.setonPlayerShootCallback(onPlayerShoot);
  game.setNotifyPlayerCallback(notifyPlayers);
}