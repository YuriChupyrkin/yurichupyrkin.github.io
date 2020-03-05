class Game {
  constructor() {
    this._canvas = null;
    this._playerSocket = null;
    this._statusBarHelper = new StatusBarHelper();

    this._refreshCount = 0;
    this._log = {
      min: 999,
      max: 0,
    };
  }

  start() {
    console.log('start');

    // todo get config....

    // build canvas
    this.buildCanvas();

    // start connection
    this.buildConnection();

    // run game loop
  }

  refresh(serverGameState) {
    if (!this._playerHerlper) {
      return;
    }

    const refreshTimeStart = performance.now();

    const deserializedCircles = JSON.parse(serverGameState.circles);
    //const deserializedCircles = serverGameState.circles;

    const playerInstance = this._playerHerlper.getInstance(deserializedCircles.players);

    if (!playerInstance) {
      console.error('player is not found');
      return;
    }

    this._statusBarHelper.updatePosition(playerInstance.x, playerInstance.y);

    const npcs = Object.values(deserializedCircles.npcs);
    const bullets = Object.values(deserializedCircles.bullets);
    const guns = Object.values(deserializedCircles.guns);
    const players = Object.values(deserializedCircles.players);

    const allCircles = bullets
      .concat(npcs)
      .concat(players)
      .concat(guns);

    this._canvas.draw(playerInstance, allCircles);
    this._playerHerlper.refresh();

    const refreshTime = performance.now() - refreshTimeStart;

    this._refreshCount++;
    this.writeLog(refreshTime, npcs, bullets, players);
  }

  buildCanvas() {
    const canvas = new Canvas();
    canvas.init(document.querySelector('canvas'));
    let menuHeight = document.getElementById('menu').clientHeight;

    canvas.setSize(window.innerWidth - 2,
      window.innerHeight - menuHeight - 2);

    this._canvas = canvas;

    // todo: player coord
    canvas.refresh({x: 0, y: 0});
  }

  buildConnection() {
    // todo: URL
    const socket = io.connect('http://localhost:8888');
    const socketHelper = new SocketHelper(socket);

    socketHelper.onPlayerConnected((message) => {
      this._playerHerlper = new PlayerHelper(message.playerId, socketHelper);
      console.log(message);
    });

    socketHelper.onGameStateRefresh((message) => {
      this.refresh(message);
    });

    socketHelper.onDisconnected(() => {
      console.log('DISCONNECTED');
    });
  }

  writeLog(refreshTime, npcsArray, bulletsArray, players) {
    if (this._refreshCount % 300 === 0) {
      console.group(`refresh #${this._refreshCount} log`);

      if (this._log.min > refreshTime) {
        this._log.min = refreshTime;
      }

      if (this._log.max < refreshTime) {
        this._log.max = refreshTime;
      }

      console.log(`
-----\n
min time: ${this._log.min}ms\n
max time: ${this._log.max}ms\n
bullets: ${bulletsArray.length}\n
npcs: ${npcsArray.length}\n
players: ${players.length}\n
------\n
      `);
    }

    console.groupEnd();
  }
}

new Game().start();
