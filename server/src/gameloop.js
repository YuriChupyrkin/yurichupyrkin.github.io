const gameloop = require('node-gameloop');

  // start the loop at 30 fps (1000/30ms per frame) and grab its id
const startGameLoop = (fps = 30, callBack) => {
  console.log('>>> startGameLoop');
  const tickRate = 1000 / fps;

  const id = gameloop.setGameLoop((delta) => {
    // `delta` is the delta time from the last frame
    console.log('Hi there! (delta=%s)', delta);

    callBack();
  }, tickRate);

  return id;
};

const stopGameLoop = (gameLoopId) => {
  console.log('>>> stopGameLoop');
  gameloop.clearGameLoop(gameLoopId);
};

module.exports = {
  startGameLoop,
  stopGameLoop
};
