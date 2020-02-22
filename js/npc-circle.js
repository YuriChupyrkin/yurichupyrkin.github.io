class NPCCircle extends Circle {
  constructor(x, y, dx, dy, radius) {
    super(x, y, dx, dy, radius);
    this._playerConfig = {};
  }

  setPlayerConfig(playerConfig) {
    this._playerConfig = playerConfig;
  }

  setRole(role) {
    if (role === GAME_CONFIG.NPC_HEALTH) {
      this.setFillColor(GAME_CONFIG.NPC_HEALTH_COLOR);
      this.setStrokeColor(GAME_CONFIG.NPC_DEFAULT_STROKE);

    } else if (role === GAME_CONFIG.NPC_ENEMY) {
      this.setFillColor(GAME_CONFIG.NPC_ENEMY_COLOR);
      this.setStrokeColor(GAME_CONFIG.NPC_ENEMY_STROKE);

    } else {
      this.setFillColor(GAME_CONFIG.NPC_AMMO_COLOR);
      this.setStrokeColor(GAME_CONFIG.NPC_DEFAULT_STROKE);
    }

    this._role = role;
  }

  getRole() {
    return this._role;
  }

  update() {
    const width = this._canvas.getWidth();
    const height = this._canvas.getHeight();

    if (this._y - GAME_CONFIG.NPC_IVISIBLE_BORDER_LENGTH > height
      || this._y < - GAME_CONFIG.NPC_IVISIBLE_BORDER_LENGTH) {
      this._hidden = true;
    }

    if (this._x - GAME_CONFIG.NPC_IVISIBLE_BORDER_LENGTH > width
      || this._x < - GAME_CONFIG.NPC_IVISIBLE_BORDER_LENGTH) {
      this._hidden = true;
    }

    this.move();
    this.draw();
  }

  move() {
    this._x += this._dx;
    this._y += this._dy;

    if (this._keyState.LEFT) {
      this._x += this._playerConfig().dx;
    }
  
    if (this._keyState.RIGHT) {
      this._x -= this._playerConfig().dx;
    }
  
    if (this._keyState.UP) {
      this._y += this._playerConfig().dy;
    }

    if (this._keyState.DOWN) {
      this._y -= this._playerConfig().dy;
    }
  }

  isHidden() {
    return this._hidden;
  }
}
