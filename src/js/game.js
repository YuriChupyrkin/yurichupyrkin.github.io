class Game {
  constructor(canvas, npcsNumber) {
    this._canvas = canvas;
    this._npcsNumber = npcsNumber;
    this._difficultLevel = GAME_CONFIG.START_DIFFICULTY;
    this._circleHelpers = new CircleHelpers();
    this._interactionResolver = new InteractionResolver();
    this._eventListener = new EventListener();
    this._menu = new Menu();

    this._eventListener.setupEscAction(this.togglePause.bind(this));
    this._eventListener
      .listenClicks('btn-pause', this.togglePause.bind(this), true);

    this._refreshCount = 0;
    this._log = {
      destroed: 0,
      npcs: 0,
      bullets: 0,
      minRefreshTime: 9999,
      maxRefreshTime: 0,
    };
  }

  startGame() {
    this._finished = false;
    this._lastNPCId = 0;
    this._npcBuilder = new NPCsBuilder(
      this._difficultLevel,
      {
        width: this._canvas.getWidth(),
        height: this._canvas.getHeight(),
      }
    );
    this._lastStatusBarValues = {};
    this._isPause = false;
    this._eventListener.clearStates();
    this._keyState = this._eventListener.getKeyState();
    this._playerCircleParams = {};

    this.buildPlayer();
    this.buildNPCs(this._npcsNumber);
  }

  refresh() {
    if (this._isPause || this._finished) {
      return;
    }

    let refreshTimeStart
    if (GAME_CONFIG.WRITE_LOG) {
      refreshTimeStart = performance.now();
    }

    let player = this._player;
    let bullets = player.getBullets();
    let npcs = this._npcs;
    const npcsArray = Object.values(npcs);
    const bulletsArray = Object.values(bullets);
    const allCircles = bulletsArray
      .concat(npcsArray)
      .concat([
        player,
        player.getGun()
      ]);

    this._playerCircleParams = player.getCircleParams();

    this.multirefresh(npcs);
    this.multirefresh(bullets);
    player.refresh(this._keyState);

    // add new npcs
    this.addNPCs();

    this._interactionResolver.resolve(player, npcs, bullets);

    this._canvas.draw(
      this._playerCircleParams,
      this._keyState,
      allCircles
    );

    if (GAME_CONFIG.WRITE_LOG) {
      const refreshTime = performance.now() - refreshTimeStart;

      // start log from frame #10 to avoid big max value (connected to start the APP)
      if (this._refreshCount > 10) {
        if (this._log.maxRefreshTime < refreshTime) {
          this._log.maxRefreshTime = refreshTime;
        } else if (this._log.minRefreshTime > refreshTime) {
          this._log.minRefreshTime = refreshTime;
        }
      }

      this.writeLog(npcsArray, bulletsArray);
    }

    this.updateGameState();
  }

  updateGameState() {
    let hp = this._player.getHealth();
    let score = this._player.getScore();
    let bulletsCount = this._player.getBulletsCount();
    const playerParams = this._player.getCircleParams();

    if (hp !== this._lastStatusBarValues.hp) {
      this._menu.updateHealth(hp);
      this._lastStatusBarValues.hp = hp;
    }

    if (score !== this._lastStatusBarValues.score) {
      this._menu.updateScore(score);
      this._lastStatusBarValues.score = score;
      
      this._npcBuilder.increaseDifficulty();
    }

    if (bulletsCount !== this._lastStatusBarValues.bulletsCount) {
      this._menu.updateBulletsCount(bulletsCount);
      this._lastStatusBarValues.bulletsCount = bulletsCount;
    }

    this._menu.updatePosition(playerParams.x, playerParams.y);

    if (hp < 1) {
      this.finishGame(score);
    }
  }

  // Update npcs or bullets
  multirefresh(target) {
    let ids = Object.keys(target);
    ids.forEach((id) => {
      target[id].refresh(this._playerCircleParams, this._keyState);

      if (target[id].isHidden && target[id].isHidden()) {
        if (GAME_CONFIG.WRITE_LOG) {
          this._log.destroed ++;
        }
        delete target[id];
      }
    });
  }

  writeLog(npcsArray, bulletsArray) {
    this._refreshCount ++;

    if (this._refreshCount % 300 === 0) {
      console.group(`refresh #${this._refreshCount} log`);

      this._log.bullets = bulletsArray.length;
      this._log.npcs = npcsArray.length;

      console.log(`
-----\n
min time: ${this._log.minRefreshTime}ms\n
max time: ${this._log.maxRefreshTime}ms\n
bullets: ${this._log.bullets}\n
npcs: ${this._log.npcs}\n
destroyed: ${this._log.destroed}\n
------\n
      `);
    }

    console.groupEnd();
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

    const player = new PlayerCirlce(x, y);

    player.setGun();
    listener.setupWhiteSpaceAction(player.shoot.bind(player));

    this._player = player;
  }

  getNPCId() {
    return this._lastNPCId++;
  }

  buildNPCs(npcsNumber) {
    this._npcs = {};

    for(let i = 0; i < npcsNumber; i++) {
      this.addNewNPC();
    }
  }

  addNewNPC() {
    const npc = this._npcBuilder.buildNPC();
    const npcId = this.getNPCId();
    this._npcs[npcId] = npc;
  }

  addNPCs() {
    while (Object.keys(this._npcs).length < this._npcsNumber) {
      this.addNewNPC();
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