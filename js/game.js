class Game {
  constructor(canvas, fallingsNumber, difficultLevel) {
    this._canvas = canvas;
    this._fallingsNumber = fallingsNumber;
    this._difficultLevel = difficultLevel;
    this._circleHelpers = new CircleHelpers();
    this._interactionResolver = new InteractionResolver();
    this._eventListener = new EventListener();
    this._menu = new Menu();

    this._eventListener.setupEscAction(this.togglePause.bind(this));
    this._eventListener
      .listenClicks('btn-pause', this.togglePause.bind(this), true);
  }

  startGame() {
    this._finished = false;
    this._lastFallingId = 0;
    this._fallingBuilder = new FallingsBuilder(this._difficultLevel, this._canvas);
    this._lastStatusBarValues = {};
    this._isPause = false;
    this._eventListener.clearStates();

    this.buildPlayer();
    this.buildFallings(this._fallingsNumber);
  }

  togglePause() {
    if (this._finished) {
      return;
    }

    this._isPause = !this._isPause;

    this._menu.updatePauseButton(this._isPause);
    this._eventListener.setStopListen(this._isPause);
  }

  buildPlayer() {
    const listener = this._eventListener;
    const x = this._canvas.getWidth() / 2;
    const y = this._canvas.getHeight() / 2;

    const player = new PlayerCirlce(x, y, this._canvas);

    player.setKeyState(listener.getKeyState());
    listener.setupWhiteSpaceAction(player.shot.bind(player));

    this._player = player;
  }

  getFallingId() {
    return this._lastFallingId++;
  }

  buildFallings(fallingsNumber) {
    this._fallings = {};

    for(let i = 0; i < fallingsNumber; i++) {
      this.addNewFalling();
    }
  }

  addNewFalling() {
    const falling = this._fallingBuilder.buildFalling();
    falling.setKeyState(this._eventListener.getKeyState());

    if (this._player) {
      falling.setPlayerConfig(this._player.getPlayerConfig.bind(this._player));
    }
    const fallingId = this.getFallingId();
    this._fallings[fallingId] = falling;
  }

  addFallings() {
    while (Object.keys(this._fallings).length < this._fallingsNumber) {
      this.addNewFalling();
    }
  }

  // Update fallings or bullets
  multiUpdate(target) {
    let ids = Object.keys(target);
    ids.forEach((id) => {
      target[id].update();

      if (target[id].isHidden && target[id].isHidden()) {
        delete target[id];
      }
    });
  }

  update() {
    if (this._isPause || this._finished) {
      return;
    }

    this._canvas.clearCanvas();
    let player = this._player;
    let bullets = player.getBullets();
    let fallings = this._fallings;

    this.multiUpdate(fallings);
    this.multiUpdate(bullets);
    player.update();

    // add new fallings
    this.addFallings();

    this._interactionResolver.resolve(player, fallings, bullets);
    this.updateGameState();
  }

  updateGameState() {
    let hp = this._player.getHealth();
    let score = this._player.getScore();
    let bulletsCount = this._player.getBulletsCount();

    if (hp !== this._lastStatusBarValues.hp) {
      this._menu.updateHealth(hp);
      this._lastStatusBarValues.hp = hp;
    }

    if (score !== this._lastStatusBarValues.score) {
      this._menu.updateScore(score);
      this._lastStatusBarValues.score = score;
      
      this._fallingBuilder.increaseDifficulty();
    }

    if (bulletsCount !== this._lastStatusBarValues.bulletsCount) {
      this._menu.updateBulletsCount(bulletsCount);
      this._lastStatusBarValues.bulletsCount = bulletsCount;
    }

    if (hp < 1) {
      this.finishGame(score);
    }
  }

  finishGame(score) {
    if (!this._finished) {
      this._finished = true;
      // delay to render updated health
      setTimeout(() => {
        alert(`GAME OVER! Score: ${score}`);
        this.startGame();
      }, 2000);
    }
  }
}