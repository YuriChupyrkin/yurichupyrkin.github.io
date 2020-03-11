class SocketHelper {
  constructor(socket) {
    this._socket = socket;
  }

  onPlayerConnected(callback) {
    this._socket.on('player-connected', callback);
  }

  onDisconnected(callback) {
    this._socket.on('disconnect', () => {
      callback();
      this._socket.open();
    });
  }

  triggerPlayerRefresh(playerId, moveState, playerScreenParams) {
    this._socket.emit('refresh-player', {
      playerId,
      moveState,
      playerScreenParams,
    });
  };

  onPlaeyerRefreshed(callback) {
    this._socket.on('player-refreshed', callback);
  }

  triggerPlayershoot(playerId) {
    this._socket.emit('player-shoot', {
      playerId,
    })
  }
}