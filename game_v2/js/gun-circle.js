class GunCirlce extends Circle {
  constructor(x, y, b) {
    super(x, y, 0, 0, GAME_CONFIG.GUN_RADIUS);

    this.setStrokeColor('#110952');
    this.setFillColor(GAME_CONFIG.GUN_COLOR);

    this._bulletCount = GAME_CONFIG.START_BULLETS_COUNT;
    this._lastBulletId = 0;
    this._bullets = {};

    this._angle = 0;
    this._bonus = b;
  }

  refresh(playerCircleParams, keyState) {
    this.move(playerCircleParams, keyState);
  }

  move(playerCircleParams, keyState) {
    if (keyState.ARROW_DOWN || keyState.ARROW_RIGHT) {
      this._angle += GAME_CONFIG.GUN_ANGLE_MOVE_RATE;
      if (this._angle > 359) {
        this._angle = 0;
      }
    }

    if (keyState.ARROW_UP || keyState.ARROW_LEFT) {
      this._angle -= GAME_CONFIG.GUN_ANGLE_MOVE_RATE;
      if (this._angle < 0) {
        this._angle = 359;
      }
    }

    const playerX = playerCircleParams.x;
    const playerY = playerCircleParams.y;
    const playerRadius =  playerCircleParams.radius;
    const alfa = this._angle * Math.PI / 180;

    if (this._bonus) {
      this._x = playerX - playerRadius * Math.cos(alfa);
    } 
    else {
      this._x = playerX + playerRadius * Math.cos(alfa);
    }
    this._y = playerY + playerRadius * Math.sin(alfa);
  }

  shoot(playerCircleParams) {
    if (!this._bulletCount) {
      return;
    }

    const bullet = new BulletCirlce(
      this._x,
      this._y,
      GAME_CONFIG.BULLET_RADIUS,
    );

    const dx = (playerCircleParams.x - this._x) * -1;
    const dy = (playerCircleParams.y - this._y) * -1;

    bullet._dy = dy * GAME_CONFIG.BULLET_SPEED_RATE;
    bullet._dx = dx * GAME_CONFIG.BULLET_SPEED_RATE;

    this._bullets[this.getBulletId()] = bullet;
    this._bulletCount--;
  }

  addBulletsCount(npcRadius) {
    const addBullets = Math.round(npcRadius / GAME_CONFIG.ADD_BULLETS_RATE);
    this._bulletCount += addBullets;
  }

  getBulletId() {
    return Math.floor(Math.random() * 100) * Math.floor(Math.random() * 100) * Math.floor(Math.random() * 100);
    return this._lastBulletId++;
  }

  getBulletsCount() {
    return this._bulletCount;
  }

  getBullets() {
    return this._bullets;
  }
}