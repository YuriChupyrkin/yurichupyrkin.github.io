class PlayerCirlce extends Circle {
  constructor(x, y, canvas) {
    super(x, y, GAME_CONFIG.START_SPEED, GAME_CONFIG.START_SPEED, GAME_CONFIG.START_RADIUS);

    this.setStrokeColor('#110952');
    this.setFillColor(GAME_CONFIG.PLAYER_COLOR);
    this.setCanvas(canvas);
    this._animating = false;
    this._score = 0;
    this._health = GAME_CONFIG.START_HEALTH;

    this._canvasWidth = this._canvas.getWidth();
    this._canvasHeight = this._canvas.getHeight();
    this._gun = {};
  }

  refresh(keyState) {
    this._gun.refresh(this.getPlayerState(), keyState);
    this.draw();
  }

  shoot() {
    this._gun.shoot(this.getPlayerState());
  }

  getBullets() {
    return this._gun.getBullets();
  }

  getPlayerState() {
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
    this.animatePlayer(GAME_CONFIG.BULLETS_UPDATED_COLORS);
  }

  getBulletsCount() {
    return this._gun.getBulletsCount();
  }

  increaseHelth(npcRadius) {
    let addHp = npcRadius > 28 ? 2 : 1;

    this._radius += addHp;
    this._health += addHp;

    this.updateSpeed();
    this.animatePlayer(GAME_CONFIG.HEALTH_INCREASE_COLORS);
  }

  decreaseHelth() {
    this._radius--;
    this._health--;

    this.updateSpeed();
    this.animatePlayer(GAME_CONFIG.HEALTH_REDUCE_COLORS);
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
    this._gun = gun;
  }

  updateSpeed() {
    const speedRate = Math.round((GAME_CONFIG.START_HEALTH - this._health) / 2); // 10 - 16 = -6 / 2  = -3

    // check negative rate
    if (GAME_CONFIG.START_SPEED + speedRate < 1) {
      return;
    }

    const speed = GAME_CONFIG.START_SPEED + speedRate;

    this._dx = speed;
    this._dy = speed;
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
        this.setFillColor(GAME_CONFIG.PLAYER_COLOR);
        this._animating = false;
      }
    }, 50);
  }
}