class BulletCirlce extends Circle {
  constructor(x, y, radius) {
    super(x, y, 0, 0, radius);

    this.setStrokeColor('#110952');
    this.setFillColor('orange');
  }

  refresh(playerParams) {
    if (this._x > playerParams.x + GAME_CONFIG.NPC_IVISIBLE_BORDER_LENGTH
      || this._x < playerParams.x - GAME_CONFIG.NPC_IVISIBLE_BORDER_LENGTH) {
      this._hidden = true;
    }

    if (this._y > playerParams.y + GAME_CONFIG.NPC_IVISIBLE_BORDER_LENGTH
      || this._y < playerParams.y - GAME_CONFIG.NPC_IVISIBLE_BORDER_LENGTH) {
      this._hidden = true;
    }

    this._x += this._dx;
    this._y += this._dy;
  }

  isHidden() {
    return this._hidden;
  }
}
