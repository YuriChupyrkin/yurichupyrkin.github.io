class FallingsBuilder {
  constructor(difficultLevel, canvas) {
    this._difficultLevel = difficultLevel;
    this._canvas = canvas;
  }

  increaseDifficult() {
    this._difficultLevel++;
  }

  getFallingRole() {
    let diffLevel = this._difficultLevel;
    let randomRole = Math.round(Math.random() * diffLevel);
    let role = CONSTANTS.FALLING_ENEMY;
    if (randomRole < diffLevel - 2) {
      return role;
    }

    if (randomRole === diffLevel - 2) {
      role = CONSTANTS.FALLING_AMMO;
    } else {
      role = CONSTANTS.FALLING_HEALTH;
    }

    return role;
  }

  buildFalling() {
    const x = Math.random() * this._canvas.getWidth();
    let radius = Math.random() * 40;

    if (radius < 6) {
      radius = 6;
    }

    const dy = (radius / 10) + 3;

    const strokeColor = '#110952';
    //const fillColor = this._circleHelpers.getRandomColor();

    const circle = new FallingCircle(x, -30, 0, dy, radius);

    if (strokeColor) {
      circle.setStrokeColor(strokeColor);
    }

    // if (fillColor) {
    //   circle.setFillColor(fillColor);
    // }

    circle.setCanvas(this._canvas);

    let role = this.getFallingRole();
    circle.setRole(role);
    return circle;
  }
}