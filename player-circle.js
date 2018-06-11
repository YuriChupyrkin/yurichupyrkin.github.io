const keyState = {};

const listenKeys = (circle) => {
  window.addEventListener('keyup', (e) => {
    keyState[e.keyCode] = false;
  }, true);

  window.addEventListener('keydown', (e) => {
    keyState[e.keyCode] = true;
  }, true);
};

const move = (circle) => {
  if (keyState[37]) {
    circle._x -= circle._dx;
  }

  if (keyState[39]) {
    circle._x += circle._dx;
  }

  if (keyState[38]) {
    circle._y -= circle._dy;
  }

  if (keyState[40]) {
    circle._y += circle._dy;
  }
};

class PlayerCirlce extends Circle {
  constructor(x, y, canvas) {
    super(x, y, 4, 4, 30);

    this.setStrokeColor('#110952');
    this.setFillColor('red');
    this.setCanvas(canvas);

    listenKeys(this);
  }

  update() {
    move(this);
    this.draw();
  }
}