class Canvas {
  init(canvas) {
    this._canvas = canvas;
    this._context = this._canvas.getContext('2d', { alpha: false });
    console.log('canvas loaded');
    console.log(this._canvas);

    this._cellDx = 0;
    this._cellDy = 0;
    this._canvasCellLength = GAME_CONFIG.CANVAS_CELL_LENGHT;
  }

  setSize(width, height) {
    this._canvas.width = width;
    this._canvas.height = height;
  }

  refresh(playerCircleParams, keyState) {
    const playerDx = playerCircleParams.dx;
    const playerDy = playerCircleParams.dy;

    const canvas = this._canvas;
    const ctx = this._context;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keyState.LEFT) {
      this._cellDx += playerDx;
    }
  
    if (keyState.RIGHT) {
      this._cellDx -= playerDx;
    }
  
    if (keyState.UP) {
      this._cellDy += playerDy;
    }

    if (keyState.DOWN) {
      this._cellDy -= playerDy;
    }

    this._cellDx = this._cellDx % this._canvasCellLength;
    this._cellDy = this._cellDy % this._canvasCellLength;

    for (var x = 0.5; x < canvas.width; x += this._canvasCellLength) {
      ctx.moveTo(x + this._cellDx, 0);
      ctx.lineTo(x + this._cellDx, canvas.height);
    }
    
    for (var y = 0.5; y < canvas.height; y += this._canvasCellLength) {
      ctx.moveTo(0, y + this._cellDy);
      ctx.lineTo(canvas.width, y + this._cellDy);
    }

    ctx.strokeStyle = "#ddd";
    ctx.stroke();
  }

  draw(playerCircleParams, keyState, allCircles) {
    this.refresh(playerCircleParams, keyState);
    this.drawCircles(allCircles);
  }

  drawCircles(allCircles) {
    allCircles.forEach((circle) => {
      this.drawCircle(circle);
    });
  }

  drawCircle(circle) {
    const {
      x, y, radius, strokeColor, fillColor
    } = circle.getCircleParams();

    const width = this._canvas.width;
    const height = this._canvas.height;
    const lenghtBuffer = 50;

    // do not draw invisible object
    if (x + radius + lenghtBuffer < 0 || x - radius - lenghtBuffer > width) {
      return;
    }

    if (y + radius + lenghtBuffer < 0 || y - radius - lenghtBuffer > height) {
      return;
    }

    const ctx = this._context;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.strokeStyle =strokeColor;
    ctx.stroke();

    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
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
};
