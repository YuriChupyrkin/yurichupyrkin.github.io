const START_RADIUS = 30;
const START_HEALTH = 10;
const START_BULLETS_COUNT = 15;
const BULLET_RADIUS = 6;
const START_SPEED = 4;
const PLAYER_COLOR = '#FF7F66';

let keyState = {};

const listenKeys = (circle) => {
  window.addEventListener('keyup', (e) => {
    keyState[e.keyCode] = false;
  }, true);

  window.addEventListener('keydown', (e) => {
    keyState[e.keyCode] = true;

    if (e.keyCode === 32) {
      circle.shot();
    }
  }, true);
};

class PlayerCirlce extends Circle {
  constructor(x, y, canvas) {
    super(x, y, START_SPEED, START_SPEED, START_RADIUS);

    this.setStrokeColor('#110952');
    this.setFillColor(PLAYER_COLOR);
    this.setCanvas(canvas);
    this._score = 0;
    this._health = START_HEALTH;
    this._bullets = {};
    this._lastBulletId = 0;
    this._bulletRadius = BULLET_RADIUS;
    this._bulletCount = START_BULLETS_COUNT;

    keyState = {};
    listenKeys(this);
  }

  getBulletId() {
    return this._lastBulletId++;
  }

  getBullets() {
    return this._bullets;
  }

  addBulletsCount(fallingRadius) {
    const addBullets = Math.round(fallingRadius / 2);
    this._bulletCount += addBullets;
  }

  getBulletsCount() {
    return this._bulletCount;
  }

  update() {
    this.move();
    this.draw();
  }

  increaseHelth(fallingRadius) {
    let addHp = fallingRadius > 24 ? 2 : 1;

    this._radius += addHp;
    this._health += addHp;

    this.updateSpeed();
  }

  decreaseHelth() {
    this._radius--;
    this._health--;

    this.updateSpeed();
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

  updateSpeed() {
    const speedRate = Math.round((START_HEALTH - this._health) / 2); // 10 - 16 = -6 / 2  = -3

    // check negative rate
    if (START_SPEED + speedRate < 1) {
      return;
    }

    const speed = START_SPEED + speedRate;

    this._dx = speed;
    this._dy = speed;
  }

  buildBullet() {
    return new BulletCirlce(
      this._x,
      this._y,
      this._bulletRadius,
      this._canvas
    );
  }

  move() {
    if (keyState[37]) {
      this._x -= this._dx;
    }
  
    if (keyState[39]) {
      this._x += this._dx;
    }
  
    if (keyState[38]) {
      this._y -= this._dy;
    }

    if (keyState[40]) {
      this._y += this._dy;
    }
  };

  shot() {
    let bulletsCount = this.getBulletsCount();
    if (!bulletsCount) {
      return;
    }

    let bullet = this.buildBullet();
    let bulletSpeed = 30;

    bullet._dy = -bulletSpeed;
    if (keyState[37]) {
      bullet._dx = -bulletSpeed;
    }
  
    if (keyState[39]) {
      bullet._dx = +bulletSpeed;
    }

    this._bullets[this.getBulletId()] = bullet;
    this._bulletCount--;
  }
}