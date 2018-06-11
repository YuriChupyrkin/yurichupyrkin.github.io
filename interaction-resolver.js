function InteractionResolver() {
  const enemiesHaveIntersection = (circle_1, circle_2) => {
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

  const checkEnemiesIntersection = (enemies) => {
    const enemyKeys = Object.keys(enemies);
    enemyKeys.forEach((key, index) => {
      let circle_1 = enemies[key];

      for (let i = index + 1; i < enemyKeys.length; i++) {
        let circle_2 = enemies[enemyKeys[i]];
        let isIntersect = circle_1.isIntersectWith(circle_2);
          
        if (isIntersect) {
          enemiesHaveIntersection(circle_1, circle_2);
        }
      }
    });
  };

  const playerHasIntersection = (player, enemies, enemyId) => {
    let enemyRole = enemies[enemyId].getRole();

    // delete this enemy
    delete enemies[enemyId];

    switch(enemyRole) {
      case 'AMMO': {
        player.addBulletsCount(10);
        break;
      }
      case 'HEALTH': {
        player.increaseHelth();
        break;
      }
      case 'POISON': {
        player.decreaseHelth();
        break;
      }
    }
  };

  const checkPlayerIntersection = (player, enemies) => {
    const enemyIds = Object.keys(enemies);
    enemyIds.forEach((enemyId) => {
      let enemy = enemies[enemyId];
      let isIntersect = player.isIntersectWith(enemy);

      if (isIntersect) {
        playerHasIntersection(player, enemies, enemyId);
      }
    });
  };

  const checkBulletIntersection = (bullets, enemies, player) => {
    const bulletsIds = Object.keys(bullets);
    const enemiesIds = Object.keys(enemies);

    bulletsIds.forEach((bulletId) => {
      enemiesIds.forEach((enemyId) => {
        let bullet = bullets[bulletId];
        let enemy = enemies[enemyId];

        if (!enemy || !bullet) {
          return;
        }

        if (bullet.isIntersectWith(enemy)) {
          if (enemy.getRole() === 'POISON') {
            player.addScore();
          }

          // delete enemy
          delete enemies[enemyId];

          // delete bullet
          delete bullets[bulletId];
        }
      });
    });
  };

  /**
   * 
   * @param {Object} player
   * @param {Object} enemies
   * @param {Object} bullets
   */
  const resolve = (player, enemies, bullets) => {
    // resolve interaction between enemies
    checkEnemiesIntersection(enemies);

    // resolve interaction between enemies and player
    checkPlayerIntersection(player, enemies);

    // resolve interaction between enemies and bullets
    checkBulletIntersection(bullets, enemies, player);
  };

  return {
    resolve
  };
}