const Game = require('./src/game/game');
const WebsocketServer = require('./src/http-helpers/websocket-server');
const ApiController = require('./src/http-helpers/api-controller');
const {logInfo} = require('./src/utils/logger');

const path = require('path');
const express = require('express');
const http = require('http');

module.exports = function runServer(port) {
  logInfo('SERVER IS STARTING...');

  const expressServer = express();
  const router = express.Router();
  const httpServer = http.Server(expressServer);
  const websocketServer = new WebsocketServer(httpServer);

  router.get('/', (req ,res) => {
    res.sendFile(path.join(__dirname + '/../client/main-menu.html'));
  });

  router.get('/circles-online', (req ,res) => {
    res.sendFile(path.join(__dirname + '/../client/circles-online.html'));
  });

  const apiController = new ApiController();
  apiController.registerRoutes(router);

  expressServer.use(express.static(__dirname + '/../client'));

  //add the router
  expressServer.use('/', router);
  httpServer.listen(port || 8888);

  const game = new Game(websocketServer);

  websocketServer.run();
  game.startGame();
}
