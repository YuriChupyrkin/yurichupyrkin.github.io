const Circle = require('./circle');
const settings = require('../settings/settings');

class PlayerCirlce extends Circle {
  constructor(id, x, y) {
    super(id, x, y, settings.START_SPEED, settings.START_SPEED, settings.START_RADIUS);

    this.setStrokeColor('#110952');
    this.setFillColor(settings.PLAYER_COLOR);
    this._score = 0;
    this._health = settings.START_HEALTH;

    this._gun = {};
    this._role = settings.PLAYER_ROLE
  }

  setPlayerSocket(playerSocket) {
    this._playerSocket = playerSocket;
  }

  getPlayerSocket() {
    return this._playerSocket;
  }

  refresh(moveState) {
    this.move(moveState);
    this._gun.refresh(moveState);
  }

  move(moveState) {
    if (moveState.LEFT) {
      this._x -= this._dx;
    }
  
    if (moveState.RIGHT) {
      this._x += this._dx;
    }
  
    if (moveState.UP) {
      this._y -= this._dy;
    }

    if (moveState.DOWN) {
      this._y += this._dy;
    }
  }

  shoot() {
    this._gun.shoot();
  }

  addBulletsCount(npcRadius) {
    this._gun.addBulletsCount(npcRadius);
    this.animatePlayer(settings.BULLETS_UPDATED_COLORS);
  }

  getBulletsCount() {
    return this._gun.getBulletsCount();
  }

  increaseHelth(npcRadius) {
    let addHp = npcRadius > 28 ? 2 : 1;

    this._radius += addHp;
    this._health += addHp;

    this.updateSpeed();
    //this.animatePlayer(settings.HEALTH_INCREASE_COLORS);
  }

  decreaseHelth() {
    this._radius--;
    this._health--;

    this.updateSpeed();
    //this.animatePlayer(settings.HEALTH_REDUCE_COLORS);
  }

  addScore() {
    this._score++;
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
    const speedRate = Math.round((settings.START_HEALTH - this._health) / 2); // 10 - 16 = -6 / 2  = -3

    // check negative rate
    if (settings.START_SPEED + speedRate < 1) {
      return;
    }

    const speed = settings.START_SPEED + speedRate;

    this._dx = speed;
    this._dy = speed;
  }

  /*
  animatePlayer(colors) {
    if (this._animating) {
      return;
    }

    this._animating = true;

    let index = 0;
    let interval = setInterval(() => {
      if (index < colors.length) {
        this.setFillColor(colors[index]);
        index++;
      } else {
        clearInterval(interval);
        this.setFillColor(settings.PLAYER_COLOR);
        this._animating = false;
      }
    }, 50);
  }
  */
}

module.exports = PlayerCirlce;