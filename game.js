class Game {
  constructor(canvas, fallingsNumber, difficultLevel) {
    this._canvas = canvas;
    this._fallingsNumber = fallingsNumber;
    this._difficultLevel = difficultLevel;
  }

  startGame() {
    this._lastFallingId = 0;
    this._circleHelpers = new CircleHelpers();
    this._interactionResolver = new InteractionResolver();
    this._fallingBuilder = new FallingsBuilder(this._difficultLevel, this._canvas);
    this._menu = new Menu();
    this._lastStatusBarValues = {};

    this.buildFallings(this._fallingsNumber);
    this.buildPlayer();
  }

  buildPlayer() {
    const x = this._canvas.getWidth() / 2;
    const y = this._canvas.getHeight() / 2;

    this._player = new PlayerCirlce(x, y, this._canvas);
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
      
      this._fallingBuilder.increaseDifficult();
    }

    if (bulletsCount !== this._lastStatusBarValues.bulletsCount) {
      this._menu.updateBulletsCount(bulletsCount);
      this._lastStatusBarValues.bulletsCount = bulletsCount;
    }

    if (hp < 1) {
      alert('GAME OVER');
      this.startGame();
    }
  }
}