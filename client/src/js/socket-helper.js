class SocketHelper {
  constructor(socket) {
    this._socket = socket;
  }

  onPlayerConnected(callback) {
    this._socket.on('player-connected', callback);
  }

  onDisconnected(callback) {
    const onDisconnectd = () => {
      callback();
      this._socket.open();
    }

    this._socket.on('disconnect', () => {
      onDisconnectd();
    });

    this._socket.on('player-disconnected', () => {
      onDisconnectd();
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

  disconnect(playerId) {
    this._socket.emit('player-disconnect', {
      playerId,
    })
  }
}