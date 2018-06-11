class FallingCircle extends Circle {
  constructor(x, y, dx, dy, radius) {
    super(x, y, 0, dy, radius);
  }

  setRole(role) {
    if (role === 'HEALTH') {
      this.setFillColor('green');
    }

    if (role === 'POISON') {
      this.setFillColor('black');
    }

    if (role === 'AMMO') {
      this.setFillColor('yellow');
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
