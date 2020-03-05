const Circle = require('./circle');
const settings = require('../settings/settings');

class BulletCirlce extends Circle {
  constructor(id, x, y, dx, dy, radius) {
    super(id, x, y, dx, dy, radius);

    this.setStrokeColor('#110952');
    this.setFillColor('orange');

    this._player = null;
  }

  refresh() {
    const playerParams = this._player.getCircleParams();

    if (this._x > playerParams.x + settings.NPC_IVISIBLE_BORDER_LENGTH
      || this._x < playerParams.x - settings.NPC_IVISIBLE_BORDER_LENGTH) {
      this._hidden = true;
    }

    if (this._y > playerParams.y + settings.NPC_IVISIBLE_BORDER_LENGTH
      || this._y < playerParams.y - settings.NPC_IVISIBLE_BORDER_LENGTH) {
      this._hidden = true;
    }

    this._x += this._dx;
    this._y += this._dy;
  }

  isHidden() {
    return this._hidden;
  }

  setPlayer(player) {
    this._player = player;
  }
}

module.exports = BulletCirlce;