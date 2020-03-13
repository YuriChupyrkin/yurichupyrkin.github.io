const Game = require('./src/game/game');
const Server = require('./src/http-helpers/server');
const Rounting = require('./src/http-helpers/rounting');
const WebsocketServer = require('./src/http-helpers/websocket-server');

const NOTIFY_CLIENTS_ACTION_NAME = 'game-state-refresh'

const rounting = new Rounting();
const requestHandler = rounting.buildRequestHander.bind(rounting);

const server = new Server(requestHandler);

// run server
const httpServer = server.run();
const websocketServer = new WebsocketServer(httpServer, NOTIFY_CLIENTS_ACTION_NAME);

const game = new Game(websocketServer);

websocketServer.run();
game.startGame();
