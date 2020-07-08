const socket = require('socket.io');

module.exports = class WebsocketServer {
  constructor (httpServer) {
    this._httpServer = httpServer;

    this._onPlayerShootCallback = null;
    this._onPlayerConnectedCallback = null;
    this._onRefreshPlayerCallback = null;
    this.onPlayerNotifiedCallback  = null;
  }

  setOnRefreshPlayerCallback(onRefreshPlayerCallback) {
    this._onRefreshPlayerCallback = onRefreshPlayerCallback;
  }

  setOnPlayerRefreshedCallback(onPlayerNotifiedCallback) {
    this.onPlayerNotifiedCallback = onPlayerNotifiedCallback;
  }

  setOnPlayerConnectedCallback(onPlayerConnectedCallback) {
    this._onPlayerConnectedCallback = onPlayerConnectedCallback;
  }

  setOnPlayerShootCallback(onPlayerShootCallback) {
    this._onPlayerShootCallback = onPlayerShootCallback;
  }

  run() {
    let io = new socket(this._httpServer);
    io.on('connection', this.onConnection.bind(this));
    this._ioServer = io;
  }

  onConnection(socket) {
    console.log('websocket server: onConnection');
    socket.on('refresh-player', this.onRefreshPlayer.bind(this));
    socket.on('player-shoot', this.onPlayerShoot.bind(this));

    this._onPlayerConnectedCallback(socket);
  }

  onRefreshPlayer(message) {
    this._onRefreshPlayerCallback(message);
  }

  onPlayerNotify(message, socket) {
    socket.emit('player-notified', message);
  }

  onPlayerShoot(message) {
    this._onPlayerShootCallback(message);
  }

  notify(message, socket) {
    if (socket) {
      // send only to one socket
      socket.emit(this._actionName, message);
    } else {
      // send to all
      this._ioServer.sockets.emit(this._actionName, message);
    }
  }
}
