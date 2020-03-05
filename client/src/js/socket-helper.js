class SocketHelper {
  constructor(socket) {
    this._socket = socket;
  }

  onPlayerConnected(callback) {
    this._socket.on('player-connected', callback);

    // this._socket.on('player-connected', (message) => {
    //   callback(message);
    // });
  }

  onGameStateRefresh(callback) {
    this._socket.on('game-state-refresh', callback);
  }

  onDisconnected(callback) {
    this._socket.on('disconnect', () => {
      callback();
      this._socket.open();
    });
  }

  triggerPlayerRefresh(playerId, moveState) {
    this._socket.emit('refresh-player', {
      playerId,
      moveState,
    });
  };

  triggerPlayershoot(playerId) {
    this._socket.emit('player-shoot', {
      playerId,
    })
  }
}