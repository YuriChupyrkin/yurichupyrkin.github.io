const PlayerCircle = require('../circles/player-circle');
const GunCirlce = require('../circles/gun-cirlce');
const NpcBuilder = require('./npc-builder');
const gameState = require('./game-state');
const gameLoop = require('./gameloop');

class Game {
  constructor(id) {
    this._notifyPlayerCallback = null;
    this._gameLoopId = null;
    this._refreshNumber = 0;

    this._npcBuilder = new NpcBuilder;
  }

  startGame() {
    const id = gameLoop.startGameLoop(60, this.refresh.bind(this));
    this._gameLoopId = id;

    console.log('start game: ' + id);

    this._npcBuilder.initNpcsSet(500);
  }

  stopGame() {
    gameLoop.stopGameLoop(this._gameLoopId);
    console.log('stop game: ' + this._gameLoopId);
    this._gameLoopId = null;

    this._npcBuilder.destroyAllNpcs();
  }

  setNotifyPlayerCallback(notifyPlayerCallback) {
    this._notifyPlayerCallback = notifyPlayerCallback;
  }

  refresh() {
    //console.time('FooTimer');

    this._refreshNumber++;

    const npcAndBulletsCicles = gameState.getNpcAndBulletInstances();
    npcAndBulletsCicles.forEach((circle) => {
      circle.refresh();
    });

    this.notifyPlayers2();

    //console.timeEnd('FooTimer');
  }

  notifyPlayers() {
    const allCircles = gameState.getAllCircles();
    this._notifyPlayerCallback({
      circles: allCircles,
    });
  }

  notifyPlayers2() {
    const serializedCircles = gameState.getAllCircles2();
    this._notifyPlayerCallback({
      circles: serializedCircles,
    });
  }

  onRefreshPlayer(message) {
    const player = gameState.getPlayerById(message.playerId);
    player.refresh(message.moveState);
  }

  onPlayerShoot(message) {
    const player = gameState.getPlayerById(message.playerId);
    player.shoot();
  }

  onPlayerConnected(playerSocket) {
    const plaeyerId = gameState.getNewCircleId();
    console.log(`player #${plaeyerId} is connected`);

    // first player is connected
    if (!this._gameLoopId) {
      this.startGame();
    }

    const player = new PlayerCircle(plaeyerId, 0, 0);
    player.setPlayerSocket(playerSocket);
    const playerParams = player.getCircleParams();

    const gunId = gameState.getNewCircleId();
    const gun = new GunCirlce(gunId, playerParams.x + playerParams.radius, player._y);
    player.setGun(gun);
    gun.setPlayer(player);

    gameState.addPlayer(player);
    gameState.addGun(gun);

    playerSocket.emit('player-connected', {
      status: 'connected',
      playerId: plaeyerId,
    });

    playerSocket.on('disconnect', () => {
      gameState.removePlayer(plaeyerId);
      gameState.removeGun(gunId)
      console.log(`player #${plaeyerId} is disconnectd`);

      const playersCount = gameState.getPlayersCount();
      if (!playersCount) {
        this.stopGame();
      }
    });
  }
}

module.exports = Game;