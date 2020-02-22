const MAX_RADIUS = 46;
const MIN_RADIUS = 14;
const START_Y = -100;
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
    const middleX = this._canvas.getWidth() / 2;
    const middleY = this._canvas.getHeight() / 2;
    const startBorderCoordinat = 50;
    let dx;
    let dy;
    let x;
    let y;

    // 0 - 3
    const randomPostionCoef = Math.round(Math.random() * 1000) % 4;

    // vertical = 0 or 1 AND horizontal = 2 or 3
    const isVertical = randomPostionCoef < 2;

    let radius = Math.random() * MAX_RADIUS;
    if (radius < MIN_RADIUS) {
      radius = MIN_RADIUS;
    }

    if (isVertical) {
      x = Math.random() * this._canvas.getWidth();
      y = -startBorderCoordinat;
      dy = (radius / SPEED_RADIUS_RATE) + this.getSpeedDifficultyRate(this._difficultLevel);

      // move from bottom to bottom
      if (randomPostionCoef == 1) {
        dy *= -1;
        y = this._canvas.getHeight() + startBorderCoordinat;
      }

      dx = Math.round(Math.random() * 8);

      // move from right to left
      if (x > middleX) {
        dx *= -1;
      }
    } else {
      y = Math.random() * this._canvas.getHeight();
      x = -startBorderCoordinat;

      dx = (radius / SPEED_RADIUS_RATE) + this.getSpeedDifficultyRate(this._difficultLevel);

      // move from right to left
      if (randomPostionCoef == 3) {
        dx *= -1;
        x = this._canvas.getWidth() + startBorderCoordinat;
      }

      dy = Math.round(Math.random() * 8);

      // move from bottom to top
      if (y > middleY) {
        dy *= -1;
      }
    }

    const circle = new FallingCircle(x, y, dx, dy, radius);
    circle.setCanvas(this._canvas);
    circle.setRole(this.getFallingRole());
    return circle;
  }

  getSpeedDifficultyRate(difficultLevel) {
    let rate = difficultLevel / 10;
    return rate;
  }
}