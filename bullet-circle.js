class BulletCirlce extends Circle {
  constructor(x, y, canvas) {
    super(x, y, 0, 0, 6);

    this.setStrokeColor('#110952');
    this.setFillColor('orange');
    this.setCanvas(canvas);
  }

  update() {
    const width = this._canvas.getWidth();
    const height = this._canvas.getHeight();

    if (this._x + this._radius > width || this._x - this._radius < 0) {
      this._hidden = true;
    }

    if (this._y + this._radius > height || this._y - this._radius < 0) {
      this._hidden = true;
    }

    this._x += this._dx;
    this._y += this._dy;

    this.draw();
  }

  isHidden() {
    return this._hidden;
  }
}
