class Circle {
  constructor(id, x, y, dx, dy, radius) {
    this._id = id;
    this._x = x || 0;
    this._y = y || 0;
    this._radius = radius || 50;
    this._dx = dx || 0;
    this._dy = dy || 0;

    this._isDead = false;
  }

  setRole(roleName) {
    this._role = roleName;
  }

  getRole() {
    return this._role;
  }

  getCircleParams() {
    return {
      id: this._id,
      x: this._x,
      y: this._y,
      dx: this._dx,
      dy: this._dy,
      radius: this._radius,
      role: this._role,
    }
  }

  isDead() {
    return this._isDead;
  }

  kill() {
    this._isDead = true;
  }

}

module.exports = Circle;
