class Game {
  constructor() {
    this._canvas = null;
    this._playerSocket = null;
    this._statusBarHelper = new StatusBarHelper();
    this._gameLoop = null;
    this._socketHelper = null;

    this._refreshCount = 0;
    this._log = {
      min: 999,
      max: 0,
    };
  }

  init() {
    console.log('start');

    // todo get config....

    // build canvas
    this.buildCanvas();

    // start connection
    this.buildConnection();

    // run game loop
  }

  startGame() {
    this._gameLoop = new GameLoop(60, this.gameLoop.bind(this));
    this._gameLoop.start();
  }

  gameLoop(gameLoopInfo) {
    if (!this._playerHerlper) {
      return;
    }

    //this._socketHelper.triggerPlayerRefresh();
    this._playerHerlper.refresh();

    this._socketHelper.onPlaeyerRefreshed((serverGameState) => {
      this.refresh(serverGameState);
    });
  }

  refresh(serverGameState) {
    //const refreshTimeStart = performance.now();

    const circles = serverGameState.circles;
    const playerInstance = this._playerHerlper.getInstance(circles.players);

    if (!playerInstance) {
      console.error('player is not found');
      return;
    }

    this._statusBarHelper.updatePosition(playerInstance.x, playerInstance.y);

    const npcs = Object.values(circles.npcs);
    const bullets = Object.values(circles.bullets);
    const guns = Object.values(circles.guns);
    const players = Object.values(circles.players);

    const allCircles = bullets
      .concat(npcs)
      .concat(players)
      .concat(guns);

    this._canvas.draw(playerInstance, allCircles);

    //const refreshTime = performance.now() - refreshTimeStart;

    //this._refreshCount++;
    //this.writeLog(refreshTime, npcs, bullets, players);
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

    socketHelper.onDisconnected(() => {
      console.log('DISCONNECTED');
      this._gameLoop.pause();
    });

    this._socketHelper = socketHelper;
    this.startGame();
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

new Game().init();
