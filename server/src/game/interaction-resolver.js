const settings = require('../settings/settings');
const gameState = require('./game-state');

class InteractionResolver {

  resolve(players, bullets, npcs, gameZone) {
    this.resolveForAll(players, bullets, npcs, gameZone);
  }

  resolveForAll(players, bullets, npcs, gameZone) {
    const allCircles = players.concat(bullets, npcs);

    this.resolveGameZoneIntersection(players, bullets, npcs, gameZone);

    for (let index = 0; index < allCircles.length; index++) {
      const circle_1 = allCircles[index];

      if (circle_1.isDead()) {
        continue;
      }

      for (let i = index + 1; i < allCircles.length; i++) {
        let circle_2 = allCircles[i];

        if (circle_2.isDead()) {
          continue;
        }

        let isIntersect = this.isIntersect(circle_1, circle_2);

        if (isIntersect) {
          this.resolveIntersection(circle_1, circle_2);
        }
      }
    }
  }

  resolveGameZoneIntersection(players, bullets, npcs, gameZone) {
    const resolve = (circles, outGameZoneRosolver) => {
      circles.forEach((circle) => {
        if (this.isOutOfGameZone(gameZone, circle)) {
          outGameZoneRosolver(circle);
        }
      });
    }

    const bulletOutGameZoneResolver = (bullet) => {
      bullet.kill();
    };

    const npcOutGameZoneResolver = (npc) => {
      npc._dx *= -1;
      npc._dy *= -1;

      npc._x = npc._x + npc._dx * 3;
      npc._y = npc._y + npc._dy * 3;
    }

    const playerOutGameZoneResolver = (player) => {
      player.decreaseHealth();

      player._dx *= -1;
      player._dy *= -1;

      player._x = player._x + player._dx * 4;
      player._y = player._y + player._dy * 4;
    }


    resolve(bullets, bulletOutGameZoneResolver);
    resolve(npcs, npcOutGameZoneResolver);
    resolve(players, playerOutGameZoneResolver);
  };

  resolveIntersection(circle_1, circle_2) {
    const intersectionInfo = this.getIntersectionInfo(circle_1, circle_2);
    const intersectionType = intersectionInfo.intersectionType;
    
    switch(intersectionType) {
      case 'player_player':
        this.player_player_intersection(circle_1, circle_2);
        break;
      case 'player_bullet':
        this.player_bullet_intersection(
          intersectionInfo.player,
          intersectionInfo.bullet
        );
        break;
      case 'player_enemy':
        this.player_enemy_intersection(
          intersectionInfo.player,
          intersectionInfo.enemy
        );
        break;
      case 'player_health':
        this.player_health_intersection(
          intersectionInfo.player,
          intersectionInfo.health
        );
        break;
      case 'player_ammo':
        this.player_ammo_intersection(
          intersectionInfo.player,
          intersectionInfo.ammo
        );
        break;
      case 'bullet_bullet':
        this.bullet_bullet_intersection(circle_1, circle_2);
        break;
      case 'bullet_npc':
        this.bullet_npc_intersection(circle_1, circle_2);
        break;
      case 'npc_npc':
        this.npc_npc_intersection(circle_1, circle_2);
        break;
    }
  }

  player_bullet_intersection(player, bullet) {
    if (player._id === bullet.getPlayerId()) {
      return;
    }

    player._x += bullet._dy * 3;
    player._y += bullet._dx * 3;

    // player #1 decrease hp
    player.decreaseHealth();

    const player_2 = this.getBulletOwner(bullet);

    if (player_2) {
      // plater #2 add score
      if (player._health < 1) {
        player_2.addPlayerKilledScore();
      } else {
        player_2.addPlayerHitScore();
      }
    }

    bullet.kill();
  }

  bullet_bullet_intersection(bullet_1, bullet_2) {
    if (bullet_1.getPlayerId() === bullet_2.getPlayerId()) {
      return;
    }

    this.double_kill_intersection(bullet_1, bullet_2);
  }

  bullet_npc_intersection(bullet, npc) {
    if (npc.getRole() === settings.ROLE_NPC_ENEMY) {
      const player = this.getBulletOwner(bullet);
      if (player) {
        player.addNpcKillScore();
      }
    }

    this.double_kill_intersection(bullet, npc);
  }

  player_enemy_intersection(player, enemy) {
    player.decreaseHealth();
    enemy.kill();
  }

  player_health_intersection(player, health) {
    player.increaseHealth(health._radius);
    health.kill();
  }

  player_ammo_intersection(player, ammo) {
    player.addBulletsCount(ammo._radius);
    ammo.kill();
  }

  double_kill_intersection(circle_1, circle_2) {
    circle_1.kill();
    circle_2.kill();
  }

  npc_npc_intersection(npc_1, npc_2) {
    this.exchangeDirection(npc_1, npc_2);
  }

  player_player_intersection(player_1, player_2) {
    player_1._x += player_2._dx * 2;
    player_2._x += player_1._dx * 2;

    player_1._y += player_2._dy * 2;
    player_2._y += player_1._dy * 2;

    if (player_1.getHealth() > 1) {
      player_1.decreaseHealth();
    }

    if (player_2.getHealth() > 1) {
      player_2.decreaseHealth();
    }
  }

  exchangeDirection(circle_1, circle_2) {
    let dx = circle_1._dx;
    let dy = circle_1._dy;

    circle_1._dx = circle_2._dx;
    circle_1._dy = circle_2._dy;

    circle_2._dx = dx;
    circle_2._dy = dy;

    // FIX ME intersection
    circle_1._x += circle_1._dx * 1.5;
    circle_1._y += circle_1._dy * 1.5;
  }

  getIntersectionInfo(circle_1, circle_2) {
    const role_1 = circle_1._role;
    const role_2 = circle_2._role;

    // player intersection
    if (role_1 === settings.ROLE_PLAYER || role_2 === settings.ROLE_PLAYER) {
      if (role_1 === settings.ROLE_PLAYER && role_2 === settings.ROLE_PLAYER) {
        return {
          player_1: circle_1,
          player_2: circle_2,
          intersectionType: 'player_player',
        };
      }

      let player = circle_1;
      let notPlayer = circle_2;

      if ( circle_1._role !== settings.ROLE_PLAYER) {
        player = circle_2;
        notPlayer = circle_1;
      }

      switch (notPlayer._role) {
        case settings.ROLE_BULLET:
          return {
            player: player,
            bullet: notPlayer,
            intersectionType: 'player_bullet',
          }
        case settings.ROLE_NPC_ENEMY:
          return {
            player: player,
            enemy: notPlayer,
            intersectionType: 'player_enemy',
          }
        case settings.ROLE_NPC_HEALTH:
          return {
            player: player,
            health: notPlayer,
            intersectionType: 'player_health',
          }
        case settings.ROLE_NPC_AMMO:
          return {
            player: player,
            ammo: notPlayer,
            intersectionType: 'player_ammo',
          }
      }
    }

    if (role_1 === settings.ROLE_BULLET || role_2 === settings.ROLE_BULLET) {
      if (role_1 === settings.ROLE_BULLET && role_2 === settings.ROLE_BULLET) {
        return {
          bullet_1: circle_1,
          bullet_2: circle_2,
          intersectionType: 'bullet_bullet',
        }
      }

      let bullet = circle_1;
      let npc = circle_2;

      if (circle_1._role !== settings.ROLE_BULLET) {
        bullet = circle_2;
        npc = circle_1;
      }

      switch (npc._role) {
        case settings.ROLE_NPC_ENEMY:
        case settings.ROLE_NPC_HEALTH:
        case settings.ROLE_NPC_AMMO:
          return {
            bullet,
            npc,
            intersectionType: 'bullet_npc',
          }
      }
    }

    return {
      npc_1: circle_1,
      npc_2: circle_2,
      intersectionType: 'npc_npc',
    }
  }

  getBulletOwner(bullet) {
    const player = gameState.getPlayerById(bullet.getPlayerId());
    return player;
  }

  isIntersect(circle_1, circle_2) {
    let deltaX = Math.abs(circle_1._x - circle_2._x);
    let deltaY = Math.abs(circle_1._y - circle_2._y);

    // possible intersection
    if (deltaX < circle_1._radius + circle_2._radius
      && deltaY < circle_1._radius + circle_2._radius) {

      let sqrtDistance = Math.pow(deltaX, 2) + Math.pow(deltaY, 2);
      let distance = Math.sqrt(sqrtDistance);

      return distance < circle_1._radius + circle_2._radius;
    }

    return false;
  }

  isOutOfGameZone(gameZone, circle) {
    let deltaX = Math.abs(gameZone._x - circle._x);
    let deltaY = Math.abs(gameZone._y - circle._y);

    let sqrtDistance = Math.pow(deltaX, 2) + Math.pow(deltaY, 2);
    let distance = Math.sqrt(sqrtDistance);

    return distance + circle._radius > gameZone._radius;
  }
}

module.exports = InteractionResolver;
