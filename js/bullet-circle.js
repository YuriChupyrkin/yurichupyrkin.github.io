class BulletCirlce extends Circle {
  constructor(x, y, radius, canvas) {
    super(x, y, 0, 0, radius);

    this.setStrokeColor('#110952');
    this.setFillColor('orange');
    this.setCanvas(canvas);
    this._keyState = {};
    this._playerConfig = {};
  }

  setKeyState(keyState) {
    this._keyState = keyState;
  }

  setPlayerConfig(playerConfig) {
    this._playerConfig = playerConfig;
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

    this.move();
    this.draw();
  }

  move() {
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
