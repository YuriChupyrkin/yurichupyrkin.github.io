class NPCsBuilder {
  constructor(difficultLevel, canvas) {
    this._difficultLevel = difficultLevel;
    this._canvas = canvas;
  }

  increaseDifficulty() {
    this._difficultLevel++;
  }

  getNPCRole() {
    let diffLevel = this._difficultLevel;
    let randomRole = Math.round(Math.random() * diffLevel);
    let role = GAME_CONFIG.NPC_ENEMY;
    if (randomRole < diffLevel - 2) {
      return role;
    }

    if (randomRole === diffLevel - 2) {
      role = GAME_CONFIG.NPC_AMMO;
    } else {
      role = GAME_CONFIG.NPC_HEALTH;
    }

    return role;
  }
  
  buildNPC() {
    const middleX = this._canvas.getWidth() / 2;
    const middleY = this._canvas.getHeight() / 2;
    let dx;
    let dy;
    let x;
    let y;

    // 0 - 3
    const randomPostionCoef = Math.round(Math.random() * 1000) % 4;

    // vertical = 0 or 1 AND horizontal = 2 or 3
    const isVertical = randomPostionCoef < 2;

    let radius = Math.random() * GAME_CONFIG.NPC_MAX_RADIUS;
    if (radius < GAME_CONFIG.NPC_MIN_RADIUS) {
      radius = GAME_CONFIG.NPC_MIN_RADIUS;
    }

    if (isVertical) {
      x = Math.random() * this._canvas.getWidth();
      y = -GAME_CONFIG.NPC_START_BORDER_COORDINAT;
      dy = (radius / GAME_CONFIG.NPC_SPEED_RADIUS_RATE)
        + this.getSpeedDifficultyRate(this._difficultLevel);

      // move from bottom to bottom
      if (randomPostionCoef == 1) {
        dy *= -1;
        y = this._canvas.getHeight() + GAME_CONFIG.NPC_START_BORDER_COORDINAT;
      }

      dx = Math.round(Math.random() * 8);

      // move from right to left
      if (x > middleX) {
        dx *= -1;
      }
    } else {
      y = Math.random() * this._canvas.getHeight();
      x = -GAME_CONFIG.NPC_START_BORDER_COORDINAT;

      dx = (radius / GAME_CONFIG.NPC_SPEED_RADIUS_RATE) + this.getSpeedDifficultyRate(this._difficultLevel);

      // move from right to left
      if (randomPostionCoef == 3) {
        dx *= -1;
        x = this._canvas.getWidth() + GAME_CONFIG.NPC_START_BORDER_COORDINAT;
      }

      dy = Math.round(Math.random() * 8);

      // move from bottom to top
      if (y > middleY) {
        dy *= -1;
      }
    }

    const circle = new NPCCircle(x, y, dx, dy, radius);
    circle.setCanvas(this._canvas);
    circle.setRole(this.getNPCRole());
    return circle;
  }

  getSpeedDifficultyRate(difficultLevel) {
    let rate = difficultLevel / GAME_CONFIG.NPC_SPEED_LEVEL_DIFICULT_RATE;
    return rate;
  }
}