class Canvas {
  init(canvas) {
    this._canvas = canvas;
    this._context = this._canvas.getContext('2d');
    console.log('canvas loaded');
    console.log(this._canvas);

    this._canvasCellLength = SERVER_SETTIGS.CANVAS_CELL_LENGHT;
  }

  setSize(width, height) {
    this._canvas.width = width;
    this._canvas.height = height;
  }

  refresh(playerCircleParams) {
    const canvas = this._canvas;
    const ctx = this._context;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const playerX = playerCircleParams.x % this._canvasCellLength;
    const playerY = playerCircleParams.y % this._canvasCellLength;
    const cavnasGridShift = (this._canvasCellLength / 2) + 0.5;

    for (var x = -cavnasGridShift; x < canvas.width + cavnasGridShift; x += this._canvasCellLength) {
      ctx.moveTo(x - playerX, 0);
      ctx.lineTo(x - playerX, canvas.height);
    }
    
    for (var y = -cavnasGridShift; y < canvas.height + cavnasGridShift; y += this._canvasCellLength) {
      ctx.moveTo(0, y - playerY);
      ctx.lineTo(canvas.width, y - playerY);
    }

    ctx.strokeStyle = "#ddd";
    ctx.stroke();
  }

  draw(playerCircleParams, allCircles) {
    this.refresh(playerCircleParams);

    const playerCenterShift =
      this.getPlayerCenterShift(playerCircleParams.x, playerCircleParams.y);

    this.drawCircles(allCircles, playerCenterShift);
  }

  drawCircles(allCircles, playerCenterShift) {
    allCircles.forEach((circle) => {
      this.drawCircle(circle, playerCenterShift);
    });
  }

  drawCircle(circle, playerCenterShift) {
    const x = circle.x;
    const y = circle.y;
    const radius = circle.radius;

    const colors = this.getCicleColors(circle.role);

    const width = this._canvas.width;
    const height = this._canvas.height;
    const lenghtBuffer = 50;

    const canvasX = x - playerCenterShift.x;
    const canvasY = y - playerCenterShift.y;

    // do not draw invisible object
    if (canvasX + radius + lenghtBuffer < 0 || canvasX - radius - lenghtBuffer > width) {
      return;
    }

    if (canvasY + radius + lenghtBuffer < 0 || canvasY - radius - lenghtBuffer > height) {
      return;
    }

    const ctx = this._context;
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = 2;

    if (circle.role === SERVER_SETTIGS.ROLE_GAME_ZONE) {
      ctx.lineWidth = 10;
    }

    ctx.stroke();

    if (colors.fill) {
      ctx.fillStyle = colors.fill;
      ctx.fill();
    }
  }

  getCicleColors(roleName) {
    let strokeColor;
    let fillColor;

    switch (roleName) {
      case SERVER_SETTIGS.ROLE_PLAYER:
        strokeColor = SERVER_SETTIGS.PLAYER_STROKE_COLOR;
        fillColor = SERVER_SETTIGS.PLAYER_FILL_COLOR;
        break;
      case SERVER_SETTIGS.ROLE_BULLET: {
        strokeColor = SERVER_SETTIGS.BULLET_STROKE_COLOR;
        fillColor = SERVER_SETTIGS.BULLET_FILL_COLOR;
        break;
      }
      case SERVER_SETTIGS.ROLE_GUN: {
        strokeColor = SERVER_SETTIGS.GUN_STROKE_COLOR;
        fillColor = SERVER_SETTIGS.GUN_FILL_COLOR;
        break;
      }
      case SERVER_SETTIGS.ROLE_NPC_AMMO: {
        strokeColor = SERVER_SETTIGS.NPC_DEFAULT_STROKE_COLOR;
        fillColor = SERVER_SETTIGS.NPC_AMMO_FILL_COLOR;
        break;
      }
      case SERVER_SETTIGS.ROLE_NPC_HEALTH: {
        strokeColor = SERVER_SETTIGS.NPC_DEFAULT_STROKE_COLOR;
        fillColor = SERVER_SETTIGS.NPC_HEALTH_FILL_COLOR;
        break;
      }
      case SERVER_SETTIGS.ROLE_NPC_ENEMY: {
        strokeColor = SERVER_SETTIGS.NPC_ENEMY_STROKE_COLOR;
        fillColor = SERVER_SETTIGS.NPC_ENEMY_FILL_COLOR;
        break;
      }
      case SERVER_SETTIGS.ROLE_GAME_ZONE: {
        fillColor = SERVER_SETTIGS.GAZE_ZONE_FILL_COLOR;
        strokeColor = SERVER_SETTIGS.GAZE_ZONE_STROKE_COLOR;
        break;
      }
    }

    return {
      stroke: strokeColor,
      fill: fillColor,
    }
  }

  getPlayerCenterShift(x, y) {
    const middleX = this.getWidth() / 2;
    const middleY = this.getHeight() / 2;

    return {
      x: x - middleX,
      y: y - middleY,
    };
  }

  getContext() {
    return this._context;
  }

  getSourceCanvas() {
    return this._canvas;
  }

  getWidth() {
    return this._canvas.width;
  }

  getHeight() {
    return this._canvas.height;
  }
}
