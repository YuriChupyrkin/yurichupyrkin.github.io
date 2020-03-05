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

  getAllCircles2() {
    const p = Object.values(this._players);
    const n = Object.values(this._npcs);
    const b = Object.values(this._bullets);
    const g = Object.values(this._guns)


    const playersStr = this.getSerializedInstances(p);
    const npcsStr = this.getSerializedInstances(n);
    const bulletsStr = this.getSerializedInstances(b);
    const gunsStr = this.getSerializedInstances(g);

    const result = '{"players":' + playersStr +
      ',"npcs":' + npcsStr +
      ',"bullets":' + bulletsStr +
      ',"guns":' + gunsStr + '}';

    return result;
  };

  getSerializedInstances(instances) {
    let instancesStr = "[";
    instances.forEach((instance, index) => {
      let p = instance.getCircleParams();
      instancesStr += "{"
      instancesStr += `"id":${p.id},"x":${p.x}, "y":${p.y},"dx":${p.dx},"dy":${p.dy},"radius":${p.radius},"strokeColor":"${p.strokeColor}","fillColor":"${p.fillColor}"`
      instancesStr += "}"

      if (index !== instances.length - 1) {
        instancesStr += ",";
      }
    });
    instancesStr += "]";

    return instancesStr;
  }

  getNpcAndBulletInstances() {
    return []
      .concat(Object.values(this._npcs))
      .concat(Object.values(this._bullets));
  }
}

module.exports = new GameState();