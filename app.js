(function () {
  const canvas = new Canvas();
  canvas.init(document.querySelector('canvas'));
  canvas.setSize(window.innerWidth - 2, window.innerHeight - 28);

  const enemiesNumber = 10;
  const game = new Game(canvas, enemiesNumber);
  
  function updateFrames () {
    function animate() {
      requestAnimationFrame(animate);
      game.update();
    }
    animate();
  };

  updateFrames();















  /*
  const canvas = new Canvas();
  canvas.init(document.querySelector('canvas'));
  canvas.setSize(window.innerWidth - 2, window.innerHeight - 28);

  function buildCircle(x, y, dx, dy, radius, strokeColor, fillColor) {
    const circle = new FallingCircle(x, y, dx, dy, radius);

    if (strokeColor) {
      circle.setStrokeColor(strokeColor);
    }

    if (fillColor) {
      circle.setFillColor(fillColor);
    }

    circle.setCanvas(canvas);
    return circle;
  }

  function getRandomColor() {
    const colors = ['red', 'black', 'blue', 'green', 'yellow', 'orange', 'pink'];
    let number = Math.round(Math.random() * colors.length -1);
    number = number < 0 ? 0: number;
    return colors[number];
  }

  function buildCircles(count) {
    const circles = [];

    for(let i = 0; i < count; i++) {
      circles.push(
        buildCircle(
          Math.random() * canvas.getWidth(),
          Math.random() * canvas.getHeight(),
          Math.random() * 20,
          Math.random() * 20,
          Math.random() * 40,
          '#110952',
          getRandomColor()),
      );
    }

    return circles;
  }

  function animateCircle () {
    // const circles = [
    //   buildCircle(100, 400, 5, 15, 20, 'red'),
    //   buildCircle(200, 500, 10, 15, 30, 'green'),
    //   buildCircle(500, 100, 30, 15, 20),
    //   buildCircle(300, 200, 10, 5, 30),
    //   buildCircle(100, 300, 10, 10, 15),
    //   buildCircle(200, 200, 20, 10, 20),
    //   buildCircle(500, 400, 6, 25, 35),
    //   buildCircle(500, 100, 8, 15, 20),
    //   buildCircle(700, 200, 9, 15, 22),
    //   buildCircle(200, 300, 14, 14, 16),
    //   buildCircle(200, 300, 28, 10, 18)
    // ]

    const circles = buildCircles(1);

    function animate() {
      requestAnimationFrame(animate);
      canvas.clearCanvas();

      circles.forEach((circle) => {
        circle.update();
      });
    }
    animate();
  };

  animateCircle();

  */
})();