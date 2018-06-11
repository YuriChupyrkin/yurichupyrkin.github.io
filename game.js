class Game {
  constructor(canvas, enemiesNumber) {
    this._canvas = canvas;
    this._enemiesNumber = enemiesNumber;
    this._lastEnemyId = 0;
    this._circleHelpers = new CircleHelpers();
    this._interactionResolver = new InteractionResolver();

    this.buildEnemies(enemiesNumber);
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

  buildEnemy() {
    const x = Math.random() * this._canvas.getWidth();
    const radius = Math.random() * 40;

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
    return circle;
  }

  buildEnemies(enemiesNumber) {
    this._enemies = {};

    for(let i = 0; i < enemiesNumber; i++) {
      this.addNewEnemy();
    }
  }

  // destroyEnemy(enemyId) {
  //   delete this._enemies[enemyId];
  // }

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
  }
}