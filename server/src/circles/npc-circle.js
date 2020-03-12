const Circle = require('./circle');
const settings = require('../settings/settings');

class NPCCircle extends Circle {
  constructor(id, x, y, dx, dy, radius) {
    super(id, x, y, dx, dy, radius);
    this.setRole(settings.ROLE_NPC_HEALTH);
  }

  refresh() {
    // if (this._x > playerParams.x + GAME_CONFIG.NPC_IVISIBLE_BORDER_LENGTH
    //   || this._x < playerParams.x - GAME_CONFIG.NPC_IVISIBLE_BORDER_LENGTH) {
    //   this._hidden = true;
    // }

    // if (this._y > playerParams.y + GAME_CONFIG.NPC_IVISIBLE_BORDER_LENGTH
    //   || this._y < playerParams.y - GAME_CONFIG.NPC_IVISIBLE_BORDER_LENGTH) {
    //   this._hidden = true;
    // }

    this.move();
  }

  move() {
    this._x += this._dx;
    this._y += this._dy;
  }

  isHidden() {
    return this._hidden;
  }
}

module.exports = NPCCircle;
