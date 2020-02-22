function InteractionResolver() {
  const npcsHaveIntersection = (circle_1, circle_2) => {
    // exchange of direction
    let dx = circle_1._dx;
    let dy = circle_1._dy;

    circle_1._dx = circle_2._dx;
    circle_1._dy = circle_2._dy;

    circle_2._dx = dx;
    circle_2._dy = dy;

    // FIX intersection
    circle_1._x +=  circle_1._dx * 1.5;
    circle_1._y +=  circle_1._dy * 1.5;
  };

  const checkNPCsIntersection = (npcs) => {
    const npcKeys = Object.keys(npcs);
    npcKeys.forEach((key, index) => {
      let circle_1 = npcs[key];

      for (let i = index + 1; i < npcKeys.length; i++) {
        let circle_2 = npcs[npcKeys[i]];
        let isIntersect = circle_1.isIntersectWith(circle_2);
          
        if (isIntersect) {
          npcsHaveIntersection(circle_1, circle_2);
        }
      }
    });
  };

  const playerHasIntersection = (player, npcs, npcId) => {
    let npcRole = npcs[npcId].getRole();
    let npcRadius = npcs[npcId]._radius;

    // delete this npc
    delete npcs[npcId];

    switch(npcRole) {
      case CONSTANTS.FALLING_AMMO: {
        player.addBulletsCount(npcRadius);
        break;
      }
      case CONSTANTS.FALLING_HEALTH: {
        player.increaseHelth(npcRadius);
        break;
      }
      case CONSTANTS.FALLING_ENEMY: {
        player.decreaseHelth();
        break;
      }
    }
  };

  const checkPlayerIntersection = (player, npcs) => {
    const npcIds = Object.keys(npcs);
    npcIds.forEach((npcId) => {
      let npc = npcs[npcId];
      let isIntersect = player.isIntersectWith(npc);

      if (isIntersect) {
        playerHasIntersection(player, npcs, npcId);
      }
    });
  };

  const checkBulletIntersection = (bullets, npcs, player) => {
    const bulletsIds = Object.keys(bullets);
    const npcsIds = Object.keys(npcs);

    bulletsIds.forEach((bulletId) => {
      npcsIds.forEach((npcId) => {
        let bullet = bullets[bulletId];
        let npc = npcs[npcId];

        if (!npc || !bullet) {
          return;
        }

        if (bullet.isIntersectWith(npc)) {
          if (npc.getRole() === CONSTANTS.FALLING_ENEMY) {
            player.addScore();
          }

          // delete npc
          delete npcs[npcId];

          // delete bullet
          delete bullets[bulletId];
        }
      });
    });
  };

  /**
   * 
   * @param {Object} player
   * @param {Object} npcs
   * @param {Object} bullets
   */
  const resolve = (player, npcs, bullets) => {
    // resolve interaction between npcs
    checkNPCsIntersection(npcs);

    // resolve interaction between npcs and player
    checkPlayerIntersection(player, npcs);

    // resolve interaction between npcs and bullets
    checkBulletIntersection(bullets, npcs, player);
  };

  return {
    resolve
  };
}