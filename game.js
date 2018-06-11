class Game {
  constructor(canvas, enemiesNumber, difficultLevel) {
    this._canvas = canvas;
    this._enemiesNumber = enemiesNumber;
    this._difficultLevel = difficultLevel;
  }

  startGame() {
    this._lastEnemyId = 0;
    this._circleHelpers = new CircleHelpers();
    this._interactionResolver = new InteractionResolver();
    this._menu = new Menu();

    this.buildEnemies(this._enemiesNumber);
    this.buildPlayer();
  }

  buildPlayer() {
    const player = new PlayerCirlce(200, 100, this._canvas);
    player.setupBullet(true);
    this._player = player;
  }

  getEnemyId() {
    return this._lastEnemyId++;
  }

  getEnemyRole() {
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

  buildEnemy() {
    const x = Math.random() * this._canvas.getWidth();
    let radius = Math.random() * 40;

    if (radius < 6) {
      radius = 6;
    }

    const dy = (radius / 10) + 3;

    const strokeColor = '#110952';
    const fillColor = this._circleHelpers.getRandomColor();

    const circle = new FallingCircle(x, -30, 0, dy, radius);

    // const dx = Math.random() * 20;
    // const y = Math.random() * this._canvas.getHeight();
    // const circle = new Circle(x, y, dx, dy, radius);

    if (strokeColor) {
      circle.setStrokeColor(strokeColor);
    }

    if (fillColor) {
      circle.setFillColor(fillColor);
    }

    circle.setCanvas(this._canvas);

    let role = this.getEnemyRole();
    circle.setRole(role);
    return circle;
  }

  buildEnemies(enemiesNumber) {
    this._enemies = {};

    for(let i = 0; i < enemiesNumber; i++) {
      this.addNewEnemy();
    }
  }

  addNewEnemy() {
    const enemy = this.buildEnemy();
    const enemyId = this.getEnemyId();
    this._enemies[enemyId] = enemy;
  }

  addEnemies() {
    while (Object.keys(this._enemies).length < this._enemiesNumber) {
      this.addNewEnemy();
    }
  }

  // Update enemies or bullets
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
    let enemies = this._enemies;

    this.multiUpdate(enemies);
    this.multiUpdate(bullets);
    player.update();

    // add new enemies
    this.addEnemies();

    this._interactionResolver.resolve(player, enemies, bullets);
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