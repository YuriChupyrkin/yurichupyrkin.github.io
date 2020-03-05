class Canvas {
  init(canvas) {
    this._canvas = canvas;
    this._context = this._canvas.getContext('2d', { alpha: false });
    console.log('canvas loaded');
    console.log(this._canvas);

    this._canvasCellLength = GAME_CONFIG.CANVAS_CELL_LENGHT;
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
    const strokeColor = circle.strokeColor;
    const fillColor = circle.fillColor;

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
    ctx.strokeStyle =strokeColor;
    ctx.stroke();

    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
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
