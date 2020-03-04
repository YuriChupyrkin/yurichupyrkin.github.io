class BulletCirlce extends Circle {
  constructor(x, y, radius) {
    super(x, y, 0, 0, radius);

    this.setStrokeColor('#110952');
    this.setFillColor('orange');
  }

  refresh(playerCircleParams, keyState) {
    if (this._x > GAME_CONFIG.NPC_IVISIBLE_BORDER_LENGTH
      || this._x < - GAME_CONFIG.NPC_IVISIBLE_BORDER_LENGTH) {
      this._hidden = true;
    }

    if (this._y > GAME_CONFIG.NPC_IVISIBLE_BORDER_LENGTH
      || this._y < - GAME_CONFIG.NPC_IVISIBLE_BORDER_LENGTH) {
      this._hidden = true;
    }

    this._x += this._dx;
    this._y += this._dy;

    this.move(playerCircleParams, keyState);
  }

  move(playerCircleParams, keyState) {
    if (keyState.LEFT) {
      this._x += playerCircleParams.dx;
    }
  
    if (keyState.RIGHT) {
      this._x -= playerCircleParams.dx;
    }
  
    if (keyState.UP) {
      this._y += playerCircleParams.dy;
    }

    if (keyState.DOWN) {
      this._y -= playerCircleParams.dy;
    }
  }

  isHidden() {
    return this._hidden;
  }
}
