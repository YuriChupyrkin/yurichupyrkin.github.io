class GunCirlce extends Circle {
  constructor(x, y, canvas) {
    super(x, y, 0, 0, GAME_CONFIG.GUN_RADIUS);

    this.setStrokeColor('#110952');
    this.setFillColor(GAME_CONFIG.GUN_COLOR);
    this.setCanvas(canvas);

    this._bulletCount = GAME_CONFIG.START_BULLETS_COUNT;
    this._lastBulletId = 0;
    this._bullets = {};

    this._angle = 0;
  }

  refresh(playerState, keyState) {
    this.draw();
    this.move(playerState, keyState);
  }

  move(playerState, keyState) {
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

    const playerX = playerState.x;
    const playerY = playerState.y;
    const playerRadius =  playerState.radius;
    const alfa = this._angle * Math.PI / 180;

    this._x = playerX + playerRadius * Math.cos(alfa);
    this._y = playerY + playerRadius * Math.sin(alfa);
  }

  shoot(playerState) {
    if (!this._bulletCount) {
      return;
    }

    const bullet = new BulletCirlce(
      this._x,
      this._y,
      GAME_CONFIG.BULLET_RADIUS,
      this._canvas
    );

    const dx = (playerState.x - this._x) * -1;
    const dy = (playerState.y - this._y) * -1;

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
    return this._lastBulletId++;
  }

  getBulletsCount() {
    return this._bulletCount;
  }

  getBullets() {
    return this._bullets;
  }
}