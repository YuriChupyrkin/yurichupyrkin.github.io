class RefreshCirclesResolver {
  constructor() {
    this._circlesState = {
      last: null,
      current: null,
    };

    this._initGameCycleId = null;
  }

  resolve(serverGameState) {
    const syncPeriod = SERVER_SETTINGS.CLIENT_SYNC_COORDS_PERIOD;
    const circles = serverGameState.circles;
    const gameCycleId = serverGameState.gameCycleId;
    const player = serverGameState.playerParams;

    if (!this._initGameCycleId) {
      this._initGameCycleId = gameCycleId;
    }

    const npcs = Object.values(circles.npcs);
    const bullets = Object.values(circles.bullets);
    const guns = Object.values(circles.guns);
    const players = Object.values(circles.players);

    const allCircles = bullets
      .concat(npcs)
      .concat(players)
      .concat(guns);

    this._circlesState.last = this._circlesState.current;
    this._circlesState.current = {
      allCircles,
      gameCycleId,
    };

    const isNeedToSyncCoords = (gameCycleId - this._initGameCycleId)
      % syncPeriod === 0;

    if (!isNeedToSyncCoords) {
      return {
        circle: this.refreshCircles(allCircles),
        player: this.refreshPlayer(player),
      } 
    }

    return {
      circle: allCircles,
      player,
    }
  }

  refreshPlayer(player) {
    player.x += player.dx;
    player.y += player.dy;
    return player;
  }

  refreshCircles(allCircles) {
    allCircles.forEach((circle) => {
      circle.x += circle.dx;
      circle.y += circle.dy;
    });

    return allCircles;
  }
}