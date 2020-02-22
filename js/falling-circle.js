const FALLING_ENEMY_COLOR = 'black';
const FALLING_ENEMY_STROKE = '#110952';
const FALLING_DEFAULT_STROKE = '#110952';
const FALLING_AMMO_COLOR = '#ebef00';
const FALLING_HEALTH_COLOR = '#10b910';

class FallingCircle extends Circle {
  constructor(x, y, dx, dy, radius) {
    super(x, y, dx, dy, radius);
    this._keyState = {};
    this._playerConfig = {};
  }

  setKeyState(keyState) {
    this._keyState = keyState;
  }

  setPlayerConfig(playerConfig) {
    this._playerConfig = playerConfig;
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
    // can be hidden after that coef
    const invisibleBorderCoord = 200;

    const width = this._canvas.getWidth();
    const height = this._canvas.getHeight();

    if (this._y - invisibleBorderCoord > height || this._y < - invisibleBorderCoord) {
      this._hidden = true;
    }

    if (this._x - invisibleBorderCoord > width || this._x < - invisibleBorderCoord) {
      this._hidden = true;
    }

    this.move();
    this.draw();
  }

  move() {
    this._x += this._dx;
    this._y += this._dy;

    if (this._keyState[37] || this._keyState[65]) {
      this._x += this._playerConfig().dx;
    }
  
    if (this._keyState[39] || this._keyState[68]) {
      this._x -= this._playerConfig().dx;
    }
  
    if (this._keyState[38] || this._keyState[87]) {
      this._y += this._playerConfig().dy;
    }

    if (this._keyState[40] || this._keyState[83]) {
      this._y -= this._playerConfig().dy;
    }
  }

  isHidden() {
    return this._hidden;
  }
}
