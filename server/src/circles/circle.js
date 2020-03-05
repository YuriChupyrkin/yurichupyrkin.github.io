class Circle {
  constructor(id, x, y, dx, dy, radius) {
    this._id = id;
    this._x = x || 0;
    this._y = y || 0;
    this._radius = radius || 50;
    this._dx = dx || 0;
    this._dy = dy || 0;
  
    this._strokeColor = 'black';
    this._fillColor = null;
  }

  setStrokeColor(color) {
    this._strokeColor = color;
  };

  setFillColor(color) {
    this._fillColor = color;
  };

  getCircleParams() {
    return {
      id: this._id,
      x: this._x,
      y: this._y,
      dx: this._dx,
      dy: this._dy,
      radius: this._radius,
      strokeColor: this._strokeColor,
      fillColor: this._fillColor,
    }
  }

  /*
  setCanvasSize(width, height) {
    this._canvasWidth = width;
    this._canvasHeight = height;
  }
  */

  /*
  refresh() {
    const width = this._canvasWidth;
    const height = this._canvasHeight;

    if (this._x + this._radius > width || this._x - this._radius < 0) {
      this._dx = -this._dx;
    }

    if (this._y + this._radius > height || this._y - this._radius < 0) {
      this._dy = -this._dy;
    }

    this._x += this._dx;
    this._y += this._dy;
  }
  */

  isHidden() {
    return false;
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
