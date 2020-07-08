class GameState {
  constructor() {
    this._players = {};
    this._npcs = {};
    this._bullets = {};
    this._guns = {};
    this._gameZone = null;
    this._killedPlayers = {};

    this._newCircleId = 0;
  }

  setGameZoneCircle(gameZone) {
    this._gameZone = gameZone;
  }

  getGameZoneInstance() {
    return this._gameZone;
  }

  getGameZoneCircle() {
    return this._gameZone && this._gameZone.getCircleParams();
  }

  addPlayer(player) {
    this._players[player._id] = player;
  }

  killPlayer(playerId) {
    const player = this._players[playerId];
    this.killPlayer[playerId] = this._players[playerId];
    this.removeGun(player.getGunParams().id);
    this.removePlayer(playerId);
  }

  isKilledPlayer(playerId) {
    return !!this.killPlayer[playerId];
  }

  removePlayer(id) {
    delete this._players[id];
  }

  getPlayers() {
    return this.intancesObjectToArray(this._players);
  }

  getPlayersInstances() {
    return Object.values(this._players);
  }

  removeGun(id) {
    delete this._guns[id];
  }

  getPlayersCount() {
    return Object.keys(this._players).length;
  }

  getPlayerById(id) {
    return this._players[id] || this.killPlayer[id];
  }

  getNewCircleId() {
    return ++this._newCircleId;
  }

  addNpc(npc) {
    this._npcs[npc._id] = npc;
  }

  removeNpc(npcId) {
    delete this._npcs[npcId];
  }

  getNpcs() {
    return this.intancesObjectToArray(this._npcs);
  }

  getNpcsCount() {
    return Object.keys(this._npcs).length;
  }

  removeAllNpcs() {
    return this._npcs = {};
  }

  addBullet(bullet) {
    this._bullets[bullet._id] = bullet;
  }

  removeBullet(bulletId) {
    delete this._bullets[bulletId];
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

  resetAll() {
    this._players = {};
    this._npcs = {};
    this._bullets = {};
    this._guns = {};
    this._killedPlayers = {};
    this._gameZone = null;

    this._newCircleId = 0;
  }

  getAllCircles() {
    return {
      players: this.getPlayers(),
      npcs: this.getNpcs(),
      bullets: this.getBullets(),
      guns: this.getGuns(),
      gameZone: this.getGameZoneCircle(),
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
      gameZone: this.getGameZoneCircle(),
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

  getNpcInstances() {
    return Object.values(this._npcs);
  }

  getBulletInstances() {
    return Object.values(this._bullets);
  }
}

module.exports = new GameState();