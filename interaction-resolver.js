function InteractionResolver() {
  const fallingsHaveIntersection = (circle_1, circle_2) => {
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

  const checkFallingsIntersection = (fallings) => {
    const fallingKeys = Object.keys(fallings);
    fallingKeys.forEach((key, index) => {
      let circle_1 = fallings[key];

      for (let i = index + 1; i < fallingKeys.length; i++) {
        let circle_2 = fallings[fallingKeys[i]];
        let isIntersect = circle_1.isIntersectWith(circle_2);
          
        if (isIntersect) {
          fallingsHaveIntersection(circle_1, circle_2);
        }
      }
    });
  };

  const playerHasIntersection = (player, fallings, fallingId) => {
    let fallingRole = fallings[fallingId].getRole();

    // delete this falling
    delete fallings[fallingId];

    switch(fallingRole) {
      case CONSTANTS.FALLING_AMMO: {
        player.addBulletsCount(10);
        break;
      }
      case CONSTANTS.FALLING_HEALTH: {
        player.increaseHelth();
        break;
      }
      case CONSTANTS.FALLING_ENEMY: {
        player.decreaseHelth();
        break;
      }
    }
  };

  const checkPlayerIntersection = (player, fallings) => {
    const fallingIds = Object.keys(fallings);
    fallingIds.forEach((fallingId) => {
      let falling = fallings[fallingId];
      let isIntersect = player.isIntersectWith(falling);

      if (isIntersect) {
        playerHasIntersection(player, fallings, fallingId);
      }
    });
  };

  const checkBulletIntersection = (bullets, fallings, player) => {
    const bulletsIds = Object.keys(bullets);
    const fallingsIds = Object.keys(fallings);

    bulletsIds.forEach((bulletId) => {
      fallingsIds.forEach((fallingId) => {
        let bullet = bullets[bulletId];
        let falling = fallings[fallingId];

        if (!falling || !bullet) {
          return;
        }

        if (bullet.isIntersectWith(falling)) {
          if (falling.getRole() === CONSTANTS.FALLING_ENEMY) {
            player.addScore();
          }

          // delete falling
          delete fallings[fallingId];

          // delete bullet
          delete bullets[bulletId];
        }
      });
    });
  };

  /**
   * 
   * @param {Object} player
   * @param {Object} fallings
   * @param {Object} bullets
   */
  const resolve = (player, fallings, bullets) => {
    // resolve interaction between fallings
    checkFallingsIntersection(fallings);

    // resolve interaction between fallings and player
    checkPlayerIntersection(player, fallings);

    // resolve interaction between fallings and bullets
    checkBulletIntersection(bullets, fallings, player);
  };

  return {
    resolve
  };
}