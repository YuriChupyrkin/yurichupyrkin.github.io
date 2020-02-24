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
    };
  }

  startGame() {
    this._finished = false;
    this._lastNPCId = 0;
    this._npcBuilder = new NPCsBuilder(this._difficultLevel, this._canvas);
    this._lastStatusBarValues = {};
    this._isPause = false;
    this._eventListener.clearStates();
    this._keyState = this._eventListener.getKeyState();
    this._playerState = {};

    this.buildPlayer();
    this.buildNPCs(this._npcsNumber);
  }

  refresh() {
    if (this._isPause || this._finished) {
      return;
    }

    let player = this._player;

    this._playerState = player.getPlayerState();

    this._canvas.refresh(
      this._playerState,
      this._keyState
    );

    let bullets = player.getBullets();
    let npcs = this._npcs;

    this.multirefresh(npcs);
    this.multirefresh(bullets);
    player.refresh(this._keyState);

    // add new npcs
    this.addNPCs();

    this._interactionResolver.resolve(player, npcs, bullets);
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
      
      this._npcBuilder.increaseDifficulty();
    }

    if (bulletsCount !== this._lastStatusBarValues.bulletsCount) {
      this._menu.updateBulletsCount(bulletsCount);
      this._lastStatusBarValues.bulletsCount = bulletsCount;
    }

    if (hp < 1) {
      this.finishGame(score);
    }

    this.writeLog();
  }

  // Update npcs or bullets
  multirefresh(target) {
    let ids = Object.keys(target);
    ids.forEach((id) => {
      target[id].refresh(this._playerState, this._keyState);

      if (target[id].isHidden && target[id].isHidden()) {
        this._log.destroed ++;
        delete target[id];
      }
    });
  }

  writeLog() {
    this._refreshCount ++;

    if (this._refreshCount % 300 === 0) {
      console.log(this._refreshCount);
      this._log.bullets = Object.keys(this._player.getBullets()).length;
      this._log.npcs = Object.keys(this._npcs).length;

      console.log(`
\n
-----\n
bullets: ${this._log.bullets}\n
npcs: ${this._log.npcs}\n
destroyed: ${this._log.destroed}\n
------\n
\n
      `);
    }
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

    const player = new PlayerCirlce(x, y, this._canvas);

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