class Game {
  constructor(canvas, enemiesNumber) {
    this._canvas = canvas;
    this._lastEnemyId = 0;
    this._circleHelpers = new CircleHelpers();

    this.buildEnemies(enemiesNumber);
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

  destroyEnemy(enemyId) {
    delete this._enemies[enemyId];
  }

  addNewEnemy() {
    const enemy = this.buildEnemy();
    const enemyId = this.getEnemyId();
    this._enemies[enemyId] = enemy;
  }

  update() {
    this._canvas.clearCanvas();
    const enemyKeys = Object.keys(this._enemies);

    enemyKeys.forEach((key) => {
      let enemy = this._enemies[key];
      enemy.update();

      if (enemy.isHidden()) {
        this.destroyEnemy(key);
        this.addNewEnemy();
      }
    });

    this.checkEnemiesIntersection();
  }

  checkEnemiesIntersection() {
    const enemyKeys = Object.keys(this._enemies);
    enemyKeys.forEach((key, index) => {
      let circle_1 = this._enemies[key];

      for (let i = index + 1; i < enemyKeys.length; i++) {
        let circle_2 = this._enemies[enemyKeys[i]];

        let isIntersect = this._circleHelpers
          .circlesAreIntersect(circle_1, circle_2);

        if (isIntersect) {
          this.enemiesHaveIntersection(circle_1, circle_2);
        }
      }
    });
  }

  enemiesHaveIntersection(circle_1, circle_2) {
    // exchange of direction
    let dx = circle_1._dx;
    let dy = circle_1._dy;

    circle_1._dx = circle_2._dx;
    circle_1._dy = circle_2._dy;

    circle_2._dx = dx;
    circle_2._dy = dy;

    // FIX intersection
    circle_1._x +=  circle_1._dx * 1.5;
    circle_1._y +=  circle_1._dy * 1.5;
  }
}