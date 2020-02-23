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

  update(keyState) {
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

    this.move(keyState);
    this.draw();
  }

  move(keyState) {
    this._x += this._dx;
    this._y += this._dy;

    if (keyState.LEFT) {
      this._x += this._playerConfig().dx;
    }
  
    if (keyState.RIGHT) {
      this._x -= this._playerConfig().dx;
    }
  
    if (keyState.UP) {
      this._y += this._playerConfig().dy;
    }

    if (keyState.DOWN) {
      this._y -= this._playerConfig().dy;
    }
  }

  isHidden() {
    return this._hidden;
  }
}
