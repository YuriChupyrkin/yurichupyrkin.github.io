const FALLING_ENEMY_COLOR = 'black';
const FALLING_ENEMY_STROKE = '#110952';
const FALLING_DEFAULT_STROKE = '#110952';
const FALLING_AMMO_COLOR = '#ebef00';
const FALLING_HEALTH_COLOR = '#10b910';

class FallingCircle extends Circle {
  constructor(x, y, dx, dy, radius) {
    super(x, y, 0, dy, radius);
  }

  setRole(role) {
    if (role === CONSTANTS.FALLING_HEALTH) {
      this.setFillColor(FALLING_HEALTH_COLOR);
      this.setStrokeColor(FALLING_DEFAULT_STROKE);

    } else if (role === CONSTANTS.FALLING_ENEMY) {
      this.setFillColor(FALLING_ENEMY_COLOR);
      this.setStrokeColor(FALLING_ENEMY_STROKE);

    } else {
      this.setFillColor(FALLING_AMMO_COLOR);
      this.setStrokeColor(FALLING_DEFAULT_STROKE);
    }

    this._role = role;
  }

  getRole() {
    return this._role;
  }

  update() {
    const width = this._canvas.getWidth();
    const height = this._canvas.getHeight();

    if (this._y > height || this._y < -50) {
      this._hidden = true;
    }

    this._y += this._dy;

    this.draw();
  }

  isHidden() {
    return this._hidden;
  }
}
