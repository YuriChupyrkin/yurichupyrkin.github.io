const Circle = require('./circle');
const settings = require('../settings/settings');

class GameZoneCircle extends Circle {
  constructor(id, radius) {
    super(id, 0, 0, 0, 0, radius);

    this.setRole(settings.ROLE_GAME_ZONE);
  }

  refresh(gameCycleId) {
    if (gameCycleId % settings.REDUCE_GAME_ZONE_RATE == 0) {
      this._radius--;
    }

    if (this._radius < 1) {
      this.kill();
    }
  }
}

module.exports = GameZoneCircle;
