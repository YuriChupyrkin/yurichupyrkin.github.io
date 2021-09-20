class EventListener {
  constructor() {
    this._keyState = {};
    this._stopListen = false;
    this._escAction = () => {};
    this._ctrlAction = () => {};

    this.listenKeys();
  }

  updateKeyStateDirection(keyCode, value) {
    // NOTE: whitespace doens't work when 2 arrows are down
    switch (keyCode) {
      case 65:
        return this._keyState['LEFT'] = value;
      case 68:
        return this._keyState['RIGHT'] = value;
      case 87:
        return this._keyState['UP'] = value;
      case 83:
        return this._keyState['DOWN'] = value;
      case 38:
        return this._keyState['ARROW_UP'] = value;
      case 40:
        return this._keyState['ARROW_DOWN'] = value;
      case 37:
        return this._keyState['ARROW_LEFT'] = value;
      case 39:
        return this._keyState['ARROW_RIGHT'] = value;
    }
  }

  listenKeys() {
    window.addEventListener('keyup', (e) => {
      if (this._stopListen) {
        this.clearStates();
        return;
      }

      this.updateKeyStateDirection(e.keyCode, false);
    }, true);
  
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 27 && this._escAction) {
        this._escAction();
      }

      if (e.keyCode === 17 && this._ctrlAction) {
        this._ctrlAction();
      }

      if (this._stopListen) {
        return;
      }

      this.updateKeyStateDirection(e.keyCode, true);
  
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

  setupEscAction(action) {
    this._escAction = action;
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