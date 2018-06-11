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

  update() {
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
}