const START_DIFFICULTY = 10;

(function () {
  const canvas = new Canvas();
  canvas.init(document.querySelector('canvas'));
  let menuHeight = document.getElementById('menu').clientHeight;

  canvas.setSize(window.innerWidth - 2,
    window.innerHeight - menuHeight - 2);

  function calculateFallingsNumber() {
    let width = canvas.getWidth();
    let height = canvas.getHeight();
    const rate = 90000;
    const number = Math.round(width * height / rate);

    return number;
  }

  const fallingsNumber = calculateFallingsNumber();
  const game = new Game(canvas, fallingsNumber, START_DIFFICULTY);
  game.startGame();

  function updateFrames () {
    function animate() {
      requestAnimationFrame(animate);
      game.update();
    }
    animate();
  };

  updateFrames();
})();
