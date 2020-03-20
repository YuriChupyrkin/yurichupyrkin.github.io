const PlayerCircle = require('../circles/player-circle');
const GunCirlce = require('../circles/gun-cirlce');
const NpcBuilder = require('./npc-builder');
const InteractionResolver = require('./interaction-resolver');
const gameState = require('./game-state');
const gameLoop = require('./gameloop');
const settings = require('../settings/settings');
const {logInfo, logError} = require('../utils/logger');
const {randomRange} = require('../utils/math-utils');

const FPS = 5;

class Game {
  constructor(websocketServer) {
    this._gameLoopId = null;
    this._gameCycleId = 0;

    this._npcBuilder = new NpcBuilder;
    this._websocketServer = websocketServer;
    this._insteractionResolver = new InteractionResolver();

    this.initWebsocketHandlers(websocketServer);
  }

  initWebsocketHandlers(websocketServer) {
    websocketServer.setOnRefreshPlayerCallback(this.onRefreshPlayer.bind(this));
    websocketServer.setOnPlayerConnectedCallback(this.onPlayerConnected.bind(this));
    websocketServer.setOnPlayerShootCallback(this.onPlayerShoot.bind(this));
  }

  startGame() {
    const id = gameLoop.startGameLoop(FPS, this.refresh.bind(this));
    this._gameLoopId = id;

    logInfo('GAME STARTED! ID:' + id);
    this._npcBuilder.buildNPCs(
      settings.NPC_COUNT_PER_PLAYER,
      this._gameCycleId
    );
  }

  stopGame() {
    gameLoop.stopGameLoop(this._gameLoopId);
    logInfo('GAME STOPPED! ID:' + this._gameLoopId);
    this._gameLoopId = null;

    gameState.resetAll();
  }

  refresh() {
    //console.time('refreshTime');

    this._gameCycleId++;

    if (this._gameCycleId % 100 == 0) {
      this._npcBuilder.tryToAddNpcs(
        settings.NPC_COUNT_PER_PLAYER,
        this._gameCycleId
      );
    }

    const npcs = gameState.getNpcInstances();
    const bullets = gameState.getBulletInstances();

    const npcAndBulletsCicles = npcs.concat(bullets);
    const players = gameState.getPlayersInstances();

    console.time('_insteractionResolver');
    this._insteractionResolver.resolve(players, bullets, npcs);
    console.timeEnd('_insteractionResolver');

    npcAndBulletsCicles.forEach((circle) => {
      if (circle.isDead()) {
        if (circle.getRole() === settings.ROLE_BULLET) {
          gameState.removeBullet(circle._id);
        } else {
          gameState.removeNpc(circle._id);
        }
      }

      circle.refresh(this._gameCycleId);
    });

    //console.timeEnd('refreshTime');
  }

  onPlayerShoot(message) {
    const player = gameState.getPlayerById(message.playerId);
    if (!player || player.isDead()) {
      return;
    }

    player.shoot(this._gameCycleId);
  }

  onRefreshPlayer(message) {
    const player = gameState.getPlayerById(message.playerId);
    if (!player) {
      return;
    }

    player.refresh(message.moveState);

    if (player.isDead() && !gameState.isKilledPlayer(message.playerId)) {
      gameState.killPlayer(message.playerId);
    }

    this.playerRefreshed(player, message.playerScreenParams);
  }

  playerRefreshed(player, playerScreenParams) {
    //console.time('playerRefreshed');
    const playerParams = player.getCircleParams();

    const visibleForPlayerCicles =
      gameState.getAllVisibleCycles(playerParams, playerScreenParams);

    this._websocketServer.onPlayerRefreshed(
      {
        circles: visibleForPlayerCicles,
        playerParams: player.getPlayerParams(),
      },
      player.getPlayerSocket()
    );

    //console.timeEnd('playerRefreshed');
  }

  buildPlayer(plaeyerId) {
    const randomX = randomRange(-3000, 3000);
    const randomY = randomRange(-3000, 3000);

    const player = new PlayerCircle(plaeyerId, randomX, randomY);

    const playerParams = player.getCircleParams();
    const gunId = gameState.getNewCircleId();
    const gun = new GunCirlce(gunId, playerParams.x + playerParams.radius, player._y);
    player.setGun(gun);
    gun.setPlayer(player);

    gameState.addPlayer(player);
    gameState.addGun(gun);

    return player;
  }

  onPlayerConnected(playerSocket) {
    const plaeyerId = gameState.getNewCircleId();
    logInfo(`player #${plaeyerId} is connected`);

    // first player is connected
    if (this._gameLoopId == null) {
      this.startGame();
    }

    const player = this.buildPlayer(plaeyerId);
    const gunId = player.getGunParams().id;
    player.setPlayerSocket(playerSocket);


    playerSocket.emit('player-connected', {
      status: 'connected',
      playerId: plaeyerId,
    });

    playerSocket.on('player-disconnect', () => {
      this.onPlayerDisconnect(plaeyerId, gunId, playerSocket);
    });

    playerSocket.on('disconnect', () => {
      this.onPlayerDisconnect(plaeyerId, gunId, playerSocket);
    });
  }

  onPlayerDisconnect(plaeyerId, gunId, playerSocket) {
    gameState.removePlayer(plaeyerId);
    gameState.removeGun(gunId)
    logInfo(`player #${plaeyerId} is disconnected`);

    playerSocket.emit('player-disconnected');

    const playersCount = gameState.getPlayersCount();
    if (!playersCount) {
      this.stopGame();
    }
  }
}

module.exports = Game;
