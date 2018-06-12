const MAX_RADIUS = 40;
const MIN_RADIUS = 8;
const START_Y = -30;
const SPEED_RADIUS_RATE = 10;

class FallingsBuilder {
  constructor(difficultLevel, canvas) {
    this._difficultLevel = difficultLevel;
    this._canvas = canvas;
  }

  increaseDifficulty() {
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
    let radius = Math.random() * MAX_RADIUS;

    if (radius < MIN_RADIUS) {
      radius = MIN_RADIUS;
    }

    const dy = (radius / SPEED_RADIUS_RATE) + this.getSpeedDifficultyRate(this._difficultLevel);

    //const strokeColor = '#110952';
    //const fillColor = this._circleHelpers.getRandomColor();

    const circle = new FallingCircle(x, START_Y, 0, dy, radius);

    // if (strokeColor) {
    //   circle.setStrokeColor(strokeColor);
    // }

    // if (fillColor) {
    //   circle.setFillColor(fillColor);
    // }

    circle.setCanvas(this._canvas);

    let role = this.getFallingRole();
    circle.setRole(role);
    return circle;
  }

  getSpeedDifficultyRate(difficultLevel) {
    let rate = difficultLevel / 10;
    return rate;
  }
}