class SocketHelper {
  constructor(socket) {
    this._socket = socket;
  }

  onPlayerConnected(callback) {
    this._socket.on('player-connected', callback);
  }

  // onGameStateRefresh(callback) {
  //   this._socket.on('game-state-refresh', callback);
  // }

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

  onPlaeyerRefreshed(callback) {
    this._socket.on('player-refreshed', callback);
  }

  triggerPlayershoot(playerId) {
    this._socket.emit('player-shoot', {
      playerId,
    })
  }
}