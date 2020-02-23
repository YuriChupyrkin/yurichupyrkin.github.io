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
  }

  startGame() {
    this._finished = false;
    this._lastNPCId = 0;
    this._npcBuilder = new NPCsBuilder(this._difficultLevel, this._canvas);
    this._lastStatusBarValues = {};
    this._isPause = false;
    this._eventListener.clearStates();
    this._keyState = this._eventListener.getKeyState();

    this.buildPlayer();
    this.buildNPCs(this._npcsNumber);
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
    listener.setupWhiteSpaceAction(player.shot.bind(player));

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

    if (this._player) {
      npc.setPlayerConfig(this._player.getPlayerConfig.bind(this._player));
    }
    const npcId = this.getNPCId();
    this._npcs[npcId] = npc;
  }

  addNPCs() {
    while (Object.keys(this._npcs).length < this._npcsNumber) {
      this.addNewNPC();
    }
  }

  // Update npcs or bullets
  multiUpdate(target) {
    let ids = Object.keys(target);
    ids.forEach((id) => {
      target[id].update(this._keyState);

      if (target[id].isHidden && target[id].isHidden()) {
        delete target[id];
      }
    });
  }

  update() {
    if (this._isPause || this._finished) {
      return;
    }

    this._canvas.refreshCanvas(
      this._player.getPlayerConfig.bind(this._player),
      this._keyState
    );

    let player = this._player;
    let bullets = player.getBullets();
    let npcs = this._npcs;

    this.multiUpdate(npcs);
    this.multiUpdate(bullets);
    player.update(this._keyState);

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