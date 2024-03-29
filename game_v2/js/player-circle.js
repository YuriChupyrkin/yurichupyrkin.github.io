class PlayerCirlce extends Circle {
  constructor(x, y) {
    super(x, y, GAME_CONFIG.START_SPEED, GAME_CONFIG.START_SPEED, GAME_CONFIG.START_RADIUS);

    this.setStrokeColor('#110952');
    this.setFillColor(GAME_CONFIG.PLAYER_COLOR);
    this._animating = false;
    this._score = 0;
    this._health = GAME_CONFIG.START_HEALTH;

    //this._gun = {};
    this._guns = [];
    this._role = GAME_CONFIG.PLAYER_ROLE
  }

  refresh(keyState) {
    this.move(keyState);
    //this._gun.refresh(this.getCircleParams(), keyState);
    this._guns.forEach(g => {
      g.refresh(this.getCircleParams(), keyState);
    });
  }

  move(keyState) {
    if (keyState.LEFT) {
      this._x -= this._dx;
    }
  
    if (keyState.RIGHT) {
      this._x += this._dx;
    }
  
    if (keyState.UP) {
      this._y -= this._dy;
    }

    if (keyState.DOWN) {
      this._y += this._dy;
    }
  }

  shoot() {
    //this._gun.shoot(this.getCircleParams());
    this._guns.forEach(g => g.shoot(this.getCircleParams()));
  }

  getBullets() {
    return Object.assign(this._guns[0].getBullets(), this._guns[1].getBullets());
    //return this._gun.getBullets();
  }

  addBulletsCount(npcRadius) {
    this._guns[0].addBulletsCount(npcRadius);
    //this._gun.addBulletsCount(npcRadius);
    this.animatePlayer(GAME_CONFIG.BULLETS_UPDATED_COLORS);
  }

  getBulletsCount() {
    return 1000;
   // return this._gun.getBulletsCount();
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
    const gun = new GunCirlce(x, this._y);
    this._gun = gun;

    this._guns = [
      new GunCirlce(x, this._y, false),
      new GunCirlce(x - 300, this._y, true)
    ];
  }

  getGun() {
    return this._gun;
  }

  getGuns() {
    return this._guns;
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