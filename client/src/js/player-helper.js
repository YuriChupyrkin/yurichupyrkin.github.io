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
    eventListener.listenClicks('btn-disconnect', () => {this.disconnect()}, true);
    eventListener.setupWhiteSpaceAction(() => this.shoot());

    eventListener.clearStates();

    this._keyState = eventListener.getKeyState();
  }

  setInstance(playerInstance) {
    this._player = playerInstance;
  }

  refresh(playerScreenParams) {
    this._socketHelper.triggerPlayerRefresh(
      this._playerId,
      this._keyState,
      playerScreenParams,
    );
  }

  shoot() {
    this._socketHelper.triggerPlayershoot(this._playerId);
  }

  disconnect() {
    this._socketHelper.disconnect('this._playerId');
  }
}
