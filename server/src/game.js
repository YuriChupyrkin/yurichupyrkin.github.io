class Game {
  constructor(id) {
    this._game = 'game id___' + id;
  }

  startGame() {
    console.log('start game: ' + this._game);
  }

  refresh() {
    console.log('refresh: ' + this._game);
  }
}

module.exports = Game;