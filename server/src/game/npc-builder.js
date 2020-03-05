const gameState = require('./game-state');
const NpcCicle = require('../circles/npc-circle');

class NpcBuilder {
  constructor() {

  }

  initNpcsSet(count) {
    for (var i = 1; i < count; i++) {
      const id = gameState.getNewCircleId();
      const dx = Math.floor(Math.random() * (7 - 1 + 1)) + 1;
      const dy = Math.floor(Math.random() * (7 - 1 + 1)) + 1;
      const npc = new NpcCicle(id, 0, 0, dx, dy, 24);

      gameState.addNpc(npc);
    }
  }

  destroyAllNpcs() {
    gameState.removeAllNpcs();
  }
}

module.exports = NpcBuilder;