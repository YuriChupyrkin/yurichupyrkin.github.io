class Circle {
  constructor(x, y, dx, dy, radius) {
    this._x = x || 0;
    this._y = y || 0;
    this._radius = radius || 50;
    this._dx = dx || 0;
    this._dy = dy || 0;
  
    this._canvas = null;
    this._strokeColor = 'black';
    this._fillColor = null;
  }

  setCanvas(canvas) {
    this._canvas = canvas;
  };

  setStrokeColor(color) {
    this._strokeColor = color;
  };

  setFillColor(color) {
    this._fillColor = color;
  };

  getCircleParams() {
    return {
      x: this._x,
      y: this._y,
      dx: this._dx,
      dy: this._dy,
      radius: this._radius,
      strokeColor: this._strokeColor,
      fillColor: this._fillColor,
    }
  }

  draw() {
    const ctx = this._canvas.getContext();
    ctx.beginPath();
    ctx.arc(this._x, this._y, this._radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = this._strokeColor;
    ctx.stroke();

    if (this._fillColor) {
      ctx.fillStyle = this._fillColor;
      ctx.fill();
    }
  };

  refresh() {
    const width = this._canvas.getWidth();
    const height = this._canvas.getHeight();

    if (this._x + this._radius > width || this._x - this._radius < 0) {
      this._dx = -this._dx;
    }

    if (this._y + this._radius > height || this._y - this._radius < 0) {
      this._dy = -this._dy;
    }

    this._x += this._dx;
    this._y += this._dy;

    this.draw();
  }

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