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
    this._menu = new Menu();

    this.buildFallings(this._fallingsNumber);
    this.buildPlayer();
  }

  buildPlayer() {
    const player = new PlayerCirlce(200, 100, this._canvas);
    player.setupBullet(true);
    this._player = player;
  }

  getFallingId() {
    return this._lastFallingId++;
  }

  getFallingRole() {
    let diffLevel = this._difficultLevel;
    let randomRole = Math.round(Math.random() * diffLevel);
    let role = 'POISON';
    if (randomRole < diffLevel - 2) {
      return role;
    }

    if (randomRole === diffLevel - 2) {
      role = 'AMMO';
    } else {
      role = 'HEALTH';
    }

    return role;
  }

  buildFalling() {
    const x = Math.random() * this._canvas.getWidth();
    let radius = Math.random() * 40;

    if (radius < 6) {
      radius = 6;
    }

    const dy = (radius / 10) + 3;

    const strokeColor = '#110952';
    const fillColor = this._circleHelpers.getRandomColor();

    const circle = new FallingCircle(x, -30, 0, dy, radius);

    if (strokeColor) {
      circle.setStrokeColor(strokeColor);
    }

    if (fillColor) {
      circle.setFillColor(fillColor);
    }

    circle.setCanvas(this._canvas);

    let role = this.getFallingRole();
    circle.setRole(role);
    return circle;
  }

  buildFallings(fallingsNumber) {
    this._fallings = {};

    for(let i = 0; i < fallingsNumber; i++) {
      this.addNewFalling();
    }
  }

  addNewFalling() {
    const falling = this.buildFalling();
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
    this.updateStatusBar();
  }

  updateStatusBar() {
    let hp = this._player.getHealth();
    this._menu.updateHealth(hp);

    if (hp < 1) {
      alert('GAME OVER');
      this.startGame();
    }

    let score = this._player.getScore();
    this._menu.updateScore(score);

    let bulletsCount = this._player.getBulletsCount();
    this._menu.updateBulletsCount(bulletsCount);
  }
}