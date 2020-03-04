class NPCsBuilder {
  constructor(difficultLevel, canvasSize) {
    this._difficultLevel = difficultLevel;
    this._canvasSize = canvasSize;
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
  
  buildNPC(playerParams) {
    const maxX = playerParams.x + GAME_CONFIG.NPC_START_BORDER_COORDINAT;
    const minX = playerParams.x - GAME_CONFIG.NPC_START_BORDER_COORDINAT;
    const maxY = playerParams.y + GAME_CONFIG.NPC_START_BORDER_COORDINAT;
    const minY = playerParams.y - GAME_CONFIG.NPC_START_BORDER_COORDINAT;
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
      x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      y = minY;
      dy = (radius / GAME_CONFIG.NPC_SPEED_RADIUS_RATE)
        + this.getSpeedDifficultyRate(this._difficultLevel);

      // move from bottom to top
      if (randomPostionCoef == 1) {
        dy *= -1;
        y = maxY;
      }

      dx = Math.round(Math.random() * 8);

      // move from right to left
      if (x > playerParams.x) {
        dx *= -1;
      }
    } else {
      y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
      x = minX;

      dx = (radius / GAME_CONFIG.NPC_SPEED_RADIUS_RATE) + this.getSpeedDifficultyRate(this._difficultLevel);

      // move from right to left
      if (randomPostionCoef == 3) {
        dx *= -1;
        x = maxX;
      }

      dy = Math.round(Math.random() * 8);

      // move from bottom to top
      if (y > playerParams.y) {
        dy *= -1;
      }
    }

    const circle = new NPCCircle(x, y, dx, dy, radius);
    circle.setRole(this.getNPCRole());
    return circle;
  }

  getSpeedDifficultyRate(difficultLevel) {
    let rate = difficultLevel / GAME_CONFIG.NPC_SPEED_LEVEL_DIFICULT_RATE;
    return rate;
  }
}