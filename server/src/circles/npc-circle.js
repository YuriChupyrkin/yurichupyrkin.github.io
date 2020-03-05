const Circle = require('./circle');
const settings = require('../settings/settings');

class NPCCircle extends Circle {
  constructor(id, x, y, dx, dy, radius) {
    super(id, x, y, dx, dy, radius);
    this.setRole(settings.NPC_AMMO);
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

  setRole(role) {
    if (role === settings.NPC_HEALTH) {
      this.setFillColor(settings.NPC_HEALTH_COLOR);
      this.setStrokeColor(settings.NPC_DEFAULT_STROKE);

    } else if (role === settings.NPC_ENEMY) {
      this.setFillColor(settings.NPC_ENEMY_COLOR);
      this.setStrokeColor(settings.NPC_ENEMY_STROKE);

    } else {
      this.setFillColor(settings.NPC_AMMO_COLOR);
      this.setStrokeColor(settings.NPC_DEFAULT_STROKE);
    }

    this._role = role;
  }

  getRole() {
    return this._role;
  }

  isHidden() {
    return this._hidden;
  }
}

module.exports = NPCCircle;
