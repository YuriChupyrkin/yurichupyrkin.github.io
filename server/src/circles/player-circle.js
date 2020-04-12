const Circle = require('./circle');
const settings = require('../settings/settings');

class PlayerCirlce extends Circle {
  constructor(id, x, y) {
    super(id, x, y, 0, 0, settings.PLAYER_START_RADIUS);

    this._score = {
      playerHit: 0,
      playerKilled: 0,
      npcKilled: 0,
    };

    this._health = settings.PLAYER_START_HEALTH;
    this._gun = {};
    this._playerSpeed = settings.PLAYER_START_SPEED;
    this._playerSocket = null;
    this._playerScreenParams = null;

    this.setRole(settings.ROLE_PLAYER);
  }

  getPlayerParams() {
    const params = this.getCircleParams();

    return {
      ...params,
      health: this._health,
      score: this._score,
      bulletsCount: this._gun.getBulletsCount(),
      score: this._score,
      isDead: this.isDead(),
    }
  }

  setPlayerSocket(playerSocket) {
    this._playerSocket = playerSocket;
  }

  getPlayerSocket() {
    return this._playerSocket;
  }

  refresh(moveState) {
    if (this.isDead()) {
      return;
    }

    this.move(moveState);
    this._gun.refresh(moveState);
  }

  move(moveState) {
    this._dx = 0;
    this._dy = 0;

    if (moveState.LEFT) {
      this._dx -= this._playerSpeed;
    }
  
    if (moveState.RIGHT) {
      this._dx += this._playerSpeed;
    }
  
    if (moveState.UP) {
      this._dy -= this._playerSpeed;
    }

    if (moveState.DOWN) {
      this._dy += this._playerSpeed;
    }

    this._x += this._dx;
    this._y += this._dy;
  }

  shoot(gameCycleId) {
    this._gun.shoot(gameCycleId);
  }

  addBulletsCount(npcRadius) {
    this._gun.addBulletsCount(npcRadius);
  }

  getBulletsCount() {
    return this._gun.getBulletsCount();
  }

  increaseHealth(npcRadius) {
    let addHp = npcRadius > 28 ? 2 : 1;

    this._radius += addHp;
    this._health += addHp;

    this.updateSpeed();
  }

  decreaseHealth() {
    this._radius--;
    this._health--;

    if (this._health < 1) {
      this.kill();
      this._gun.kill();
    }

    this.updateSpeed();
  }

  addPlayerHitScore() {
    this._score.playerHit++;
  }

  addPlayerKilledScore() {
    this._score.playerKilled++;
  }

  addNpcKillScore() {
    this._score.npcKilled++;
  }

  getScore() {
    return this._score;
  }

  getHealth() {
    return this._health;
  }

  setGun(gun) {
    this._gun = gun;
  }

  getGunParams() {
    return this._gun.getCircleParams();
  }

  updateSpeed() {
    const speedRate = Math.round((settings.PLAYER_START_HEALTH - this._health) / 2); // 10 - 16 = -6 / 2  = -3

    // check negative rate
    if (settings.PLAYER_START_SPEED + speedRate < 1) {
      return;
    }

    this._playerSpeed = settings.PLAYER_START_SPEED + speedRate;
  }
}

module.exports = PlayerCirlce;
