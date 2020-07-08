const PlayerCircle = require('../circles/player-circle');
const GunCirlce = require('../circles/gun-cirlce');
const NpcBuilder = require('./npc-builder');
const InteractionResolver = require('./interaction-resolver');
const GameZoneCircle = require('../circles/game-zone-circle');
const gameState = require('./game-state');
const gameLoop = require('./gameloop');
const settings = require('../settings/settings');
const {logInfo, logError} = require('../utils/logger');
const {randomRange} = require('../utils/math-utils');
const gameSettings = require('../settings/settings');

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
    const id = gameLoop.startGameLoop(gameSettings.FPS, this.refresh.bind(this));
    this._gameLoopId = id;

    logInfo('GAME STARTED! ID:' + id);

    gameState.setGameZoneCircle(this.buildGameZone());

    this._npcBuilder.tryToAddNpcs();
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
      //console.time('tryToAddNpcs');
      this._npcBuilder.tryToAddNpcs();
      //console.timeEnd('tryToAddNpcs');
    }

    const npcs = gameState.getNpcInstances();
    const bullets = gameState.getBulletInstances();

    const npcAndBulletsCircles = npcs.concat(bullets);
    const players = gameState.getPlayersInstances();

    const gameZone = gameState.getGameZoneInstance();

    //console.time('_insteractionResolver');
    this._insteractionResolver.resolve(players, bullets, npcs, gameZone);
    //console.timeEnd('_insteractionResolver');

    npcAndBulletsCircles.forEach((circle) => {
      if (circle.isDead()) {
        if (circle.getRole() === settings.ROLE_BULLET) {
          gameState.removeBullet(circle._id);
        } else {
          gameState.removeNpc(circle._id);
        }
      }

      circle.refresh();
    });

    if (gameZone) {
      if (gameZone.isDead()) {
        this.stopGame();
        return;
      }
      gameZone.refresh(this._gameCycleId);
    }

    this.notifyPlayers(players);


    //console.timeEnd('refreshTime');
  }

  onPlayerShoot(message) {
    const player = gameState.getPlayerById(message.playerId);
    if (!player || player.isDead()) {
      return;
    }

    player.shoot();
  }

  onRefreshPlayer(message) {
    const player = gameState.getPlayerById(message.playerId);
    if (!player) {
      return;
    }

    player._playerScreenParams = message.playerScreenParams;
    player.refresh(message.moveState);

    if (player.isDead() && !gameState.isKilledPlayer(message.playerId)) {
      gameState.killPlayer(message.playerId);
    }
  }

  notifyPlayers(players) {
    players.forEach((player) => {
      const playerScreenParams = player._playerScreenParams;

      // no need to refresh player
      if (!playerScreenParams) {
        return;
      }

      const playerParams = player.getCircleParams();

      const visibleForPlayerCircles =
        gameState.getAllVisibleCycles(playerParams, playerScreenParams);
  
      this._websocketServer.onPlayerNotify(
        {
          circles: visibleForPlayerCircles,
          playerParams: player.getPlayerParams(),
          gameCycleId: this._gameCycleId,
        },
        player.getPlayerSocket()
      );
    });
  }

  buildGameZone() {
    const gameZoneId = gameState.getNewCircleId();
    const gameZoneCircle = new GameZoneCircle(
      gameZoneId,
      gameSettings.GAME_ZONE_RADIUS
    );

    return gameZoneCircle;
  }

  buildPlayer(plaeyerId) {
    const inGameZoneCoord = gameState.getGameZoneCircle().radius * 0.7;

    const randomX = randomRange(-inGameZoneCoord, inGameZoneCoord);
    const randomY = randomRange(-inGameZoneCoord, inGameZoneCoord);

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
