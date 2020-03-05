class PlayerHelper {
  constructor(playerId, socketHelper) {
    this._playerId = playerId;
    this._socketHelper = socketHelper;
    this._keyState = null;
    this._player = null;

    this.initPlayerEventListeners();
  }

  initPlayerEventListeners() {
    const eventListener = new EventListener();

    eventListener.setupEscAction(() => {console.log('escape')});
    //eventListener.listenClicks('btn-pause', () => {console.log('escape')}, true);
    eventListener.setupWhiteSpaceAction(() => this.shoot());

    eventListener.clearStates();

    this._keyState = eventListener.getKeyState();
  }

  getInstance(allPlayers) {
    const player = allPlayers.find((player) => player.id === this._playerId);
    this._player = player;

    return player;
  }

  refresh() {
    this.move();
  }

  move() {
    this._socketHelper.triggerPlayerRefresh(
      this._playerId,
      this._keyState,
    );
  }

  shoot() {
    console.log('shoot');
    this._socketHelper.triggerPlayershoot(this._playerId);
  }
}