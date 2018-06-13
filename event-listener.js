class EventListener {
  constructor() {
    this._keyState = {};
    this._stopListen = false;

    this.listenKeys();
  }

  listenKeys() {
    window.addEventListener('keyup', (e) => {
      if (this._stopListen) {
        this.clearStates();
        return;
      }

      this._keyState[e.keyCode] = false;
    }, true);
  
    window.addEventListener('keydown', (e) => {
      // can listen PAUSE
      if (e.keyCode === 17 && this._ctrlAction) {
        this._ctrlAction();
      }

      if (this._stopListen) {
        return;
      }

      this._keyState[e.keyCode] = true;
  
      if (e.keyCode === 32 && this._whiteSpaceAction) {
        this._whiteSpaceAction();
      }
    }, true);
  }

  listenClicks(elementId, action, withBlur) {
    let element = document.getElementById(elementId);
    element.addEventListener('click', () => {
      if (withBlur) {
        element.blur();
      }
      action();
    });
  }

  setupWhiteSpaceAction(action) {
    this._whiteSpaceAction = action;
  }

  setupCtrlAction(action) {
    this._ctrlAction = action;
  }

  setStopListen(isStop) {
    this._stopListen = isStop;
  }

  getKeyState() {
    return this._keyState;
  }

  clearStates() {
    let keys = Object.keys(this._keyState);
    keys.forEach((key) => {
      this._keyState[key] = false;
    });
  }
}