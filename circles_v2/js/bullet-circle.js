class BulletCirlce extends Circle {
  constructor(x, y, radius, canvas) {
    super(x, y, 0, 0, radius);

    this.setStrokeColor('#110952');
    this.setFillColor('orange');
    this.setCanvas(canvas);
  }

  refresh(playerState, keyState) {
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

    this.move(playerState, keyState);
    this.draw();
  }

  move(playerState, keyState) {
    if (keyState.LEFT) {
      this._x += playerState.dx;
    }
  
    if (keyState.RIGHT) {
      this._x -= playerState.dx;
    }
  
    if (keyState.UP) {
      this._y += playerState.dy;
    }

    if (keyState.DOWN) {
      this._y -= playerState.dy;
    }
  }

  isHidden() {
    return this._hidden;
  }
}
