class Canvas {
  init(canvas) {
    this._canvas = canvas;
    this._context = this._canvas.getContext('2d');
    console.log('canvas loaded');
    console.log(this._canvas);
  }

  setSize(width, height) {
    this._canvas.width = width;
    this._canvas.height = height;
  }

  clearCanvas() {
    const canvas = this._canvas;
    const ctx = this._context;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
