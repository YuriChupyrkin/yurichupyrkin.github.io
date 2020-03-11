class GameLoop {
  constructor(fps, callback) {
    this.isPlaying = false;

    this.delay = 1000 / fps;
    this.fps = fps;
    this.time = null;
    this.frame = -1;
    this.lastRequest = null;
    this.callback = callback;
  }

  loop(timestamp) {
    if (this.time === null) {
      // init start time
      this.time = timestamp;
    }

    // calc frame no.
    let newFrameNo = Math.floor((timestamp - this.time) / this.delay);

    if (newFrameNo > this.frame) {
      this.frame = newFrameNo;
      this.callback({
        time: timestamp,
        frame: this.frame,
      });
    }

    this.lastRequest = requestAnimationFrame(this.loop.bind(this));
  }

  updateFrameRate (newfps) {
    if (!newfps) {
      return;
    }

    this.delay = 1000 / newfps;
    this.fps = newfps;
    this.frame = -1;
    this.time = null;
  }

  start() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.lastRequest = requestAnimationFrame(this.loop.bind(this));
    }
  }

  pause() {
    if (this.isPlaying) {
      cancelAnimationFrame(this.lastRequest);
      this.isPlaying = false;
      this.time = null;
      this.frame = -1;
    }
  }
}
