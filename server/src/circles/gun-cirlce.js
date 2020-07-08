const Circle = require('./circle');
const BulletCirlce = require('./bullet-circle');
const settings = require('../settings/settings');
const gameState = require('../game/game-state');

class GunCircle extends Circle {
  constructor(id, x, y) {
    super(id, x, y, 0, 0, settings.GUN_RADIUS);

    this._bulletCount = settings.START_BULLETS_COUNT;
    this._lastBulletId = 0;

    this._angle = 0;
    this._player = null;

    this.setRole(settings.ROLE_GUN);
  }

  refresh(playerCircleParams, moveState) {
    this.move(playerCircleParams, moveState);
  }

  move(moveState) {
    const playerCircleParams = this._player.getCircleParams();

    if (moveState.ARROW_DOWN || moveState.ARROW_RIGHT) {
      this._angle += settings.GUN_ANGLE_MOVE_RATE;
      if (this._angle > 359) {
        this._angle = 0;
      }
    }

    if (moveState.ARROW_UP || moveState.ARROW_LEFT) {
      this._angle -= settings.GUN_ANGLE_MOVE_RATE;
      if (this._angle < 0) {
        this._angle = 359;
      }
    }

    const playerX = playerCircleParams.x;
    const playerY = playerCircleParams.y;
    const playerRadius =  playerCircleParams.radius;
    const alfa = this._angle * Math.PI / 180;

    this._x = playerX + playerRadius * Math.cos(alfa);
    this._y = playerY + playerRadius * Math.sin(alfa);
  }

  shoot() {
    if (!this._bulletCount) {
      return;
    }

    const playerCircleParams = this._player.getCircleParams();

    const dx = ((playerCircleParams.x - this._x) * -1) * settings.BULLET_SPEED_RATE;
    const dy = ((playerCircleParams.y - this._y) * -1) * settings.BULLET_SPEED_RATE;

    const bulletId = gameState.getNewCircleId();

    const bullet = new BulletCirlce(
      bulletId,
      this._x,
      this._y,
      dx,
      dy,
      settings.BULLET_RADIUS,
    );

    bullet.setPlayer(this._player);
    gameState.addBullet(bullet);

    this._bulletCount--;
  }

  addBulletsCount(npcRadius) {
    const addBullets = Math.round(npcRadius / settings.ADD_BULLETS_RATE);
    this._bulletCount += addBullets;
  }

  getBulletId() {
    return this._lastBulletId++;
  }

  getBulletsCount() {
    return this._bulletCount;
  }

  setPlayer(player) {
    this._player = player;
  }
}

module.exports = GunCircle;
