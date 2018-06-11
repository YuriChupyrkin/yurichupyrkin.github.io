(function () {
  const canvas = new Canvas();
  canvas.init(document.querySelector('canvas'));
  canvas.setSize(window.innerWidth - 2, window.innerHeight - 28);

  const enemiesNumber = 2;
  const game = new Game(canvas, enemiesNumber);
  
  function updateFrames () {
    function animate() {
      requestAnimationFrame(animate);
      game.update();
    }
    animate();
  };

  updateFrames();
})();
