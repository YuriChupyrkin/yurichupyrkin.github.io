const Circle = require('./circle');
const settings = require('../settings/settings');

class BulletCirlce extends Circle {
  constructor(id, x, y, dx, dy, radius) {
    super(id, x, y, dx, dy, radius);
    this._player = null;
    this.setRole(settings.ROLE_BULLET);
  }

  refresh() {
    this._x += this._dx;
    this._y += this._dy;
  }

  setPlayer(player) {
    this._player = player;
  }

  getPlayerId() {
    return this._player._id;
  }
}

module.exports = BulletCirlce;
