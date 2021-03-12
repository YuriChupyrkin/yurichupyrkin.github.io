class Game {
  constructor() {
    this._canvas = null;
    this._playerSocket = null;
    this._statusBarHelper = new StatusBarHelper();
    this._gameLoop = null;
    this._socketHelper = null;
    this._isGameOver = false;

    this._refreshCount = 0;
    this._log = {
      min: 999,
      max: 0,
    };
  }

  init() {
    console.log('start');

    const serverSettings = getServerSettings();
    if (!serverSettings) {
      console.error('Server settings is NOT loaded');
      return;
    }

    this._statusBarHelper.setSettingsVersion(serverSettings.SETTINGS_ID);

    // build canvas
    this.buildCanvas();

    // start connection
    this.buildConnection();

    // subsrcibe
    this._socketHelper.onPlaeyerRefreshed((serverGameState) => {
      this.refresh(serverGameState);
    });
  }

  startGame() {
    const playerScreenParams = {
      width: this._canvas.getWidth(),
      height: this._canvas.getHeight(),
    };

    // Run browser animation
    (() => {
      var animate = () => {
        requestAnimationFrame(animate);
        if (!this._playerHerlper) {
          return;
        }
    
        this._playerHerlper.refresh(playerScreenParams);
      }

      animate();
    })();
  }

  refresh(serverGameState) {
    const refreshTimeStart = performance.now();

    const circles = serverGameState.circles;
    const playerInstance = serverGameState.playerParams;
    this._playerHerlper.setInstance(playerInstance);

    if (playerInstance.isDead && !this._isGameOver) {
      this._isGameOver = true;

      if (confirm('GAME OVER! Press "OK" to exit')) {
        this._playerHerlper.disconnect();
      }
    }

    this._statusBarHelper.updatePosition(playerInstance.x, playerInstance.y);
    this._statusBarHelper.updatePlayerState(serverGameState.playerParams);

    const npcs = Object.values(circles.npcs);
    const bullets = Object.values(circles.bullets);
    const guns = Object.values(circles.guns);
    const players = Object.values(circles.players);

    const allCircles = [circles.gameZone]
      .concat(bullets)
      .concat(npcs)
      .concat(players)
      .concat(guns);

    this._canvas.draw(playerInstance, allCircles);

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
    const socket = io.connect(SERVER_SETTIGS.SERVER_ORIGIN);
    const socketHelper = new SocketHelper(socket);

    socketHelper.onPlayerConnected((message) => {
      this._playerHerlper = new PlayerHelper(message.playerId, socketHelper);
      console.log(message);
    });

    socketHelper.onDisconnected(() => {
      console.log('DISCONNECTED');
      this._gameLoop.pause();

      // TODO: show player stat
      window.location = '/';
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
