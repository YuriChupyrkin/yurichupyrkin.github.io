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

  tryToAddNpcs() {
    const npcsCount = gameState.getNpcsCount();

    const densityRate = settings.GAME_ZONE_NPC_DENCITY_RATE;
    const gameZoneRadius = gameState.getGameZoneCircle().radius;
    const expectedNpcCount = Math.ceil(
      Math.PI * Math.pow(gameZoneRadius / densityRate, 2)
    );

    const needToAddCount = expectedNpcCount - npcsCount;

    if (needToAddCount > 0) {
      this.buildNPCs(needToAddCount);
    }
  }

  buildNPCs(count) {
    for(let i = 0; i < count; i++) {
      this.buildNPC();
    }
  }

  buildNPC() {
    const respPoint = this.getNPCRespPoint();
    const dx = randomRange(-7, 7);
    const dy = randomRange(-7, 7);

    const id = gameState.getNewCircleId();
    const npc = new NpcCicle(id, respPoint.x, respPoint.y, dx, dy, 24);
    npc.setRole(this.getRandomRole());

    gameState.addNpc(npc);
  }

  getNPCRespPoint() {
    const inGameZoneCoord = gameState.getGameZoneCircle().radius * 0.7;
    const randomX = randomRange(-inGameZoneCoord, inGameZoneCoord);
    const randomY = randomRange(-inGameZoneCoord, inGameZoneCoord);

    return {
      x: randomX,
      y: randomY,
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
