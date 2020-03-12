const Circle = require('./circle');
const settings = require('../settings/settings');

class NPCCircle extends Circle {
  constructor(id, x, y, dx, dy, radius) {
    super(id, x, y, dx, dy, radius);

    this._lifeDuration = settings.NPC_LIFE_DURATION;
  }

  refresh(gameCycleId) {
    if (gameCycleId - this._birthCycleId > this._lifeDuration) {
      this._isDead = true;
      return;
    }

    this.move();
  }

  move() {
    this._x += this._dx;
    this._y += this._dy;
  }
}

module.exports = NPCCircle;
