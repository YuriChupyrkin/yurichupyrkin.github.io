const START_RADIUS = 30;
const START_HEALTH = 10;
const START_BULLETS_COUNT = 100;
const BULLET_RADIUS = 8;
const BULLET_SPEED = 24;
const START_SPEED = 4;
const PLAYER_COLOR = '#FF7F66';
const HEALTH_REDUCE_COLORS =  [
  '#8e1a03',
  PLAYER_COLOR,
  '#8e1a03',
  PLAYER_COLOR,
  '#8e1a03'
];

const HEALTH_INCREASE_COLORS =  [
  '#e2a194',
  PLAYER_COLOR,
  '#e2a194',
  PLAYER_COLOR,
  '#e2a194'
];

const BULLETS_UPDATED_COLORS =  [
  '#e0c504',
  PLAYER_COLOR,
  '#e0c504',
  PLAYER_COLOR,
  '#e0c504'
];

class PlayerCirlce extends Circle {
  constructor(x, y, canvas) {
    super(x, y, START_SPEED, START_SPEED, START_RADIUS);

    this.setStrokeColor('#110952');
    this.setFillColor(PLAYER_COLOR);
    this.setCanvas(canvas);
    this._animating = false;
    this._score = 0;
    this._health = START_HEALTH;
    this._bullets = {};
    this._lastBulletId = 0;
    this._bulletRadius = BULLET_RADIUS;
    this._bulletCount = START_BULLETS_COUNT;

    this._canvasWidth = this._canvas.getWidth();
    this._canvasHeight = this._canvas.getHeight();

    this._keyState = {};
  }

  setKeyState(keyState) {
    this._keyState = keyState;
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
    this.animatePlayer(BULLETS_UPDATED_COLORS);
  }

  getBulletsCount() {
    return this._bulletCount;
  }

  update() {
    this.move();
    this.draw();
  }

  increaseHelth(fallingRadius) {
    let addHp = fallingRadius > 28 ? 2 : 1;

    this._radius += addHp;
    this._health += addHp;

    this.updateSpeed();
    this.animatePlayer(HEALTH_INCREASE_COLORS);
  }

  decreaseHelth() {
    this._radius--;
    this._health--;

    this.updateSpeed();
    this.animatePlayer(HEALTH_REDUCE_COLORS);
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
    if (this._keyState[37] || this._keyState[65]) {
      if (this._x - this._radius > 0) {
        this._x -= this._dx;
      }
    }
  
    if (this._keyState[39] || this._keyState[68]) {
      if (this._x + this._radius < this._canvasWidth) {
        this._x += this._dx;
      }
    }
  
    if (this._keyState[38] || this._keyState[87]) {
      if (this._y - this._radius > 0) {
        this._y -= this._dy;
      }
    }

    if (this._keyState[40] || this._keyState[83]) {
      if (this._y + this._radius < this._canvasHeight) {
        this._y += this._dy;
      }
    }
  };

  shot() {
    let bulletsCount = this.getBulletsCount();
    if (!bulletsCount) {
      return;
    }

    let bullet = this.buildBullet();

    bullet._dy = -BULLET_SPEED;
    if (this._keyState[37]  | this._keyState[65]) {
      bullet._dx = -BULLET_SPEED;
    }
  
    if (this._keyState[39] || this._keyState[68]) {
      bullet._dx = +BULLET_SPEED;
    }

    this._bullets[this.getBulletId()] = bullet;
    this._bulletCount--;
  }

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
        this.setFillColor(PLAYER_COLOR);
        this._animating = false;
      }
    }, 50);
  }
}