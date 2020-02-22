const START_RADIUS = 30;
const START_HEALTH = 10;
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

    this._canvasWidth = this._canvas.getWidth();
    this._canvasHeight = this._canvas.getHeight();
    this._gun = {};
  }


  getBullets() {
    return this._gun.getBullets();
  }

  getPlayerConfig() {
    return {
      dx: this._dx,
      dy: this._dy,
      x: this._x,
      y: this._y,
      radius: this._radius,
    };
  }

  addBulletsCount(npcRadius) {
    this._gun.addBulletsCount(npcRadius);
    this.animatePlayer(BULLETS_UPDATED_COLORS);
  }

  getBulletsCount() {
    return this._gun.getBulletsCount();
  }

  update() {
    this._gun.update();
    this.draw();
  }

  increaseHelth(npcRadius) {
    let addHp = npcRadius > 28 ? 2 : 1;

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

  setGun() {
    const x = this._x + this._radius
    const gun = new GunCirlce(x, this._y, this._canvas);
    gun.setPlayerConfig(this.getPlayerConfig.bind(this));
    gun.setKeyState(this._keyState);
    this._gun = gun;
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

  shot() {
    this._gun.shoot();
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