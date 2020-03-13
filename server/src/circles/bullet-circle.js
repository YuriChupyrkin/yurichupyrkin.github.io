const Circle = require('./circle');
const settings = require('../settings/settings');

class BulletCirlce extends Circle {
  constructor(id, x, y, dx, dy, radius) {
    super(id, x, y, dx, dy, radius);
    this._player = null;
    this._lifeDuration = settings.NPC_LIFE_DURATION;

    this.setRole(settings.ROLE_BULLET);
  }

  refresh(gameCycleId) {
    if (this.isReadyForDie(gameCycleId)) {
      return;
    }

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

  setPlayer(player) {
    this._player = player;
  }

  getPlayerId() {
    return this._player._id;
  }
}

module.exports = BulletCirlce;
