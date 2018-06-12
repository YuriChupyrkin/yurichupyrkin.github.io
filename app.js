(function () {
  const canvas = new Canvas();
  canvas.init(document.querySelector('canvas'));
  canvas.setSize(window.innerWidth - 2, window.innerHeight - 28);

  const fallingsNumber = 25;
  const game = new Game(canvas, fallingsNumber, 20);
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
