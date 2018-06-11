const getRandomColor = () => {
  const colors = [
    'red', 'black', 'blue',
    'green', 'yellow', 'orange', 'pink'
  ];
  let number = Math.round(Math.random() * colors.length -1);
  number = number < 0 ? 0: number;
  return colors[number];
};



class Game {
  constructor(canvas, enemiesNumber) {
    this._canvas = canvas;
    this._lastEnemyId = 0;

    this.buildEnemies(enemiesNumber);
  }

  getEnemyId() {
    return this._lastEnemyId++;
  }

  buildEnemy() {
    const x = Math.random() * this._canvas.getWidth();
    const radius = Math.random() * 40;

    //const dy = Math.random() * 20;
    const dy = (radius / 10) + 3;

    const strokeColor = '#110952';
    const fillColor = getRandomColor();


    const circle = new FallingCircle(x, -30, 0, dy, radius);

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
    console.log(`enemies number: ${enemyKeys.length}`);

    enemyKeys.forEach((key) => {
      let enemy = this._enemies[key];
      enemy.update();

      if (enemy.isHidden()) {
        this.destroyEnemy(key);
        this.addNewEnemy();
      }
    });
  }
}