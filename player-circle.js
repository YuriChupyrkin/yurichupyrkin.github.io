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

const move = (circle) => {
  if (keyState[37]) {
    circle._x -= circle._dx;
  }

  if (keyState[39]) {
    circle._x += circle._dx;
  }

  if (keyState[38]) {
    circle._y -= circle._dy;
  }

  if (keyState[40]) {
    circle._y += circle._dy;
  }
};

class PlayerCirlce extends Circle {
  constructor(x, y, canvas) {
    super(x, y, 4, 4, 30);

    this.setStrokeColor('#110952');
    this.setFillColor('red');
    this.setCanvas(canvas);
    this._score = 0;
    this._health = 10;
    this._bullets = {};
    this._lastBulletId = 0;
    this._bulletRadius = 6;
    this._bulletCount = 15;

    keyState = {};
    listenKeys(this);
  }

  getBulletId() {
    return this._lastBulletId++;
  }

  getBullets() {
    return this._bullets;
  }

  addBulletsCount(bulletsCount) {
    this._bulletCount += bulletsCount;
  }

  getBulletsCount() {
    return this._bulletCount;
  }

  update() {
    move(this);
    this.draw();
  }

  setupBullet(withBullet) {
    this._withBullet = withBullet;
  }

  increaseHelth() {
    this._radius++;
    this._health++;
  }

  decreaseHelth() {
    this._radius--;
    this._health--;
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

  buildBullet() {
    return new BulletCirlce(
      this._x,
      this._y,
      this._bulletRadius,
      this._canvas
    );
  }

  shot() {
    let bulletsCount = this.getBulletsCount();
    if (!this._withBullet || !bulletsCount) {
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
    this.addBulletsCount(-1);
  }
}