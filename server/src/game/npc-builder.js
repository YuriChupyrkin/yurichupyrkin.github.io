const gameState = require('./game-state');
const settings = require('../settings/settings');
const {randomRange} = require('../utils/math-utils');
const NpcCicle = require('../circles/npc-circle');

class NpcBuilder {
  constructor() {
  }

  destroyAllNpcs() {
    gameState.removeAllNpcs();
  }

  tryToAddNpcs(npcCountPerPlayer, gameCycleId) {
    const playersCount = gameState.getPlayersCount();
    const npcsCount = gameState.getNpcsCount();

    const expectedNpcCount = npcCountPerPlayer * playersCount;
    const needToAddCount = expectedNpcCount - npcsCount;

    if (needToAddCount > 0) {
      this.buildNPCs(needToAddCount, gameCycleId);
    }
  }

  buildNPCs(count, gameCycleId) {
    const playersArea = this.getPlayersArea();

    for(let i = 0; i < count; i++) {
      this.buildNPC(playersArea, gameCycleId);
    }
  }

  buildNPC(playersArea, gameCycleId) {
    const randomX = randomRange(playersArea.minX, playersArea.maxX);
    const randomY = randomRange(playersArea.minY, playersArea.maxY);

    const dx = randomRange(-7, 7);
    const dy = randomRange(-7, 7);

    const id = gameState.getNewCircleId();
    const npc = new NpcCicle(id, randomX, randomY, dx, dy, 24);
    npc.setRole(this.getRandomRole());
    npc.setBirthCycleId(gameCycleId);

    gameState.addNpc(npc);
  }

  getPlayersArea() {
    const distanceToPlayers = settings.NPC_DISTANCE_TO_PLAYERS_AREA;

    let minX = -distanceToPlayers;
    let maxX = distanceToPlayers;
    let minY = -distanceToPlayers;
    let maxY = distanceToPlayers;

    const players = gameState.getPlayers();

    if (!players.length) {
      return {
        minX,
        maxX,
        minY,
        maxY,
      };
    }

    const xs = players.map((player) => player.x).sort();
    const ys = players.map((player) => player.y).sort();

    minX = xs[0] - distanceToPlayers;
    maxX = xs[xs.length - 1] + distanceToPlayers;
    minY = ys[0] - distanceToPlayers;
    maxY = ys[ys.length - 1] + distanceToPlayers;

    return {
      minX,
      maxX,
      minY,
      maxY,
    };
  }

  getRandomRole() {
    const enemyProbability = settings.NPC_ENEMY_PROBABILITY * 100;
    const randomPercent = randomRange(0, 100);
    if (randomPercent < enemyProbability) {
      return settings.ROLE_NPC_ENEMY;
    }

    // 50% HP or AMMO
    const isHeath = randomPercent % 2 == 0;
    return isHeath ? settings.ROLE_NPC_HEALTH : settings.ROLE_NPC_AMMO;
  }
}

module.exports = NpcBuilder;
