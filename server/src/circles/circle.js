class Circle {
  constructor(id, x, y, dx, dy, radius) {
    this._id = id;
    this._x = x || 0;
    this._y = y || 0;
    this._radius = radius || 50;
    this._dx = dx || 0;
    this._dy = dy || 0;

    this._birthCycleId = 0;
    this._lifeDuration = 0;
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

  setBirthCycleId(gameCycleId) {
    this._birthCycleId = gameCycleId;
  }

  isIntersectWith(circle_2) {
    let deltaX = Math.abs(this._x - circle_2._x);
    let deltaY = Math.abs(this._y - circle_2._y);

    let sqrtDistance = Math.pow(deltaX, 2) + Math.pow(deltaY, 2);
    let distance = Math.sqrt(sqrtDistance);

    return distance < this._radius + circle_2._radius;
  }
}

module.exports = Circle;
