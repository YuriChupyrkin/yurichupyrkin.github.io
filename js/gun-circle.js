const GUN_COLOR = '#ffd714';
const GUN_RADIUS = 10;
const BULLET_RADIUS = 8;
const START_BULLETS_COUNT = 120;

class GunCirlce extends Circle {
  constructor(x, y, canvas) {
    super(x, y, 0, 0, GUN_RADIUS);

    this.setStrokeColor('#110952');
    this.setFillColor(GUN_COLOR);
    this.setCanvas(canvas);

    this._bulletCount = START_BULLETS_COUNT;
    this._lastBulletId = 0;
    this._bullets = {};

    this._angle = 0;
    this._playerConfig = {};
  }

  setPlayerConfig(playerConfig) {
    this._playerConfig = playerConfig;
  }

  shoot() {
    if (!this._bulletCount) {
      return;
    }

    const bullet = new BulletCirlce(
      this._x,
      this._y,
      BULLET_RADIUS,
      this._canvas
    );

    bullet.setKeyState(this._keyState);
    bullet.setPlayerConfig(this._playerConfig);

    const dx = (this._playerConfig().x - this._x) * -1;
    const dy = (this._playerConfig().y - this._y) * -1;

    bullet._dy = dy / 3;
    bullet._dx = dx / 3;

    this._bullets[this.getBulletId()] = bullet;
    this._bulletCount--;
  }

  addBulletsCount(npcRadius) {
    const addBullets = Math.round(npcRadius / 2);
    this._bulletCount += addBullets;
  }

  getBulletId() {
    return this._lastBulletId++;
  }

  getBulletsCount() {
    return this._bulletCount;
  }

  getBullets() {
    return this._bullets;
  }


  update() {
    this.draw();
    this.move();
  }

  move() {
    const coef = 4;

    if (this._keyState.ARROW_DOWN || this._keyState.ARROW_RIGHT) {
      this._angle += coef;
      if (this._angle > 359) {
        this._angle = 0;
      }
    }

    if (this._keyState.ARROW_UP || this._keyState.ARROW_LEFT) {
      this._angle -= coef;
      if (this._angle < 0) {
        this._angle = 359;
      }
    }

    const playerX = this._playerConfig().x;
    const playerY = this._playerConfig().y;
    const playerRadius =  this._playerConfig().radius;
    const alfa = this._angle * Math.PI / 180;

    this._x = playerX + playerRadius * Math.cos(alfa);
    this._y = playerY + playerRadius * Math.sin(alfa);
  }
}