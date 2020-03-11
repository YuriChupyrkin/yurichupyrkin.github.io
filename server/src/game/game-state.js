class GameState {
  constructor() {
    this._players = {};
    this._npcs = {};
    this._bullets = {};
    this._guns = {};

    this._newCircleId = 0;
  }

  addPlayer(player) {
    this._players[player._id] = player;
  }

  removePlayer(id) {
    delete this._players[id];
  }

  removeGun(id) {
    delete this._guns[id];
  }

  getPlayersCount() {
    return Object.keys(this._players).length;
  }

  getPlayerById(id) {
    return this._players[id];
  }

  getNewCircleId() {
    return ++this._newCircleId;
  }

  addNpc(npc) {
    this._npcs[npc._id] = npc;
  }

  getNpcs() {
    return this.intancesObjectToArray(this._npcs);
  }

  removeAllNpcs() {
    return this._npcs = {};
  }

  getPlayers() {
    return this.intancesObjectToArray(this._players);
  }

  addBullet(bullet) {
    this._bullets[bullet._id] = bullet;
  }

  getBullets() {
    return this.intancesObjectToArray(this._bullets);
  }

  addGun(gun) {
    this._guns[gun._id] = gun;
  }

  getGuns() {
    return this.intancesObjectToArray(this._guns);
  }

  intancesObjectToArray(instances) {
    const array = Object.values(instances).map((instance) => instance.getCircleParams());
    return array;
  }

  getAllCircles() {
    return {
      players: this.getPlayers(),
      npcs: this.getNpcs(),
      bullets: this.getBullets(),
      guns: this.getGuns(),
    };
  }

  getAllVisibleCycles(playerParams, playerScreenParams) {
    const allCicles = this.getAllCircles();

    const visiblePlayers = this.getVisibleCycles(
      playerParams, playerScreenParams, allCicles.players);
    const visibleNpcs = this.getVisibleCycles(
      playerParams, playerScreenParams, allCicles.npcs);
    const visibleBullets = this.getVisibleCycles(
      playerParams, playerScreenParams, allCicles.bullets);
    const visibleGuns = this.getVisibleCycles(
      playerParams, playerScreenParams, allCicles.guns);

    return {
      players: visiblePlayers,
      npcs: visibleNpcs,
      bullets: visibleBullets,
      guns: visibleGuns,
    }
  }

  getVisibleCycles(playerParams, playerScreenParams, cycles) {
    const x = playerParams.x;
    const y = playerParams.y;

    const playerScreenWidth = playerScreenParams.width;
    const playerScreenHeight = playerScreenParams.height;

    const visibleCycles = cycles.filter((cycle) => {
      return (
        Math.abs(x - cycle.x) < playerScreenWidth
        && Math.abs(y - cycle.y) < playerScreenHeight
      )
    });

    return visibleCycles;
  }


  getNpcAndBulletInstances() {
    return []
      .concat(Object.values(this._npcs))
      .concat(Object.values(this._bullets));
  }
}

module.exports = new GameState();