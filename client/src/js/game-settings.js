const playerColor = '#FF7F66';

// shoud be set from server
const gameConfig = {
  START_DIFFICULTY: 6,
    NPC_COUNT_RATE: 9000, // 90000 default


    /* canvas */
    CANVAS_CELL_LENGHT: 200,


    /* player */
    START_RADIUS: 30,
    START_HEALTH: 10,
    START_SPEED: 5,
    PLAYER_COLOR: playerColor,
    PLAYER_ROLE: 'PLAYER',
    HEALTH_REDUCE_COLORS: [
      '#8e1a03',
      playerColor,
      '#8e1a03',
      playerColor,
      '#8e1a03'
    ],
    HEALTH_INCREASE_COLORS: [
      '#e2a194',
      playerColor,
      '#e2a194',
      playerColor,
      '#e2a194'
    ],
    BULLETS_UPDATED_COLORS: [
      '#e0c504',
      playerColor,
      '#e0c504',
      playerColor,
      '#e0c504'
    ],


    /* gun and bullets */
    GUN_RADIUS: 10,
    BULLET_RADIUS: 8,
    START_BULLETS_COUNT: 300,
    BULLET_SPEED_RATE: 0.7,
    ADD_BULLETS_RATE: 0.5,
    GUN_ANGLE_MOVE_RATE: 6,
    GUN_COLOR: '#ffd714',


    /* NPC */
    NPC_SPEED_RADIUS_RATE: 10,
    NPC_START_BORDER_COORDINAT: 3100,
    NPC_MIN_RADIUS: 18,
    NPC_MAX_RADIUS: 46,
    NPC_SPEED_LEVEL_DIFICULT_RATE: 10,
    NPC_ENEMY_COLOR: 'black',
    NPC_ENEMY_STROKE: '#110952',
    NPC_DEFAULT_STROKE: '#110952',
    NPC_AMMO_COLOR: '#ebef00',
    NPC_HEALTH_COLOR: '#10b910',
    // can be hidden after that coef
    NPC_IVISIBLE_BORDER_LENGTH: 4000,


    /* constants */
    NPC_AMMO: 'AMMO',
    NPC_HEALTH: 'HEALTH',
    NPC_ENEMY: 'ENEMY',
};

window.GAME_CONFIG = gameConfig;

function getServerSettings() {
  let serverSettings = JSON.parse(localStorage.getItem('serverSettings'));

  // todo: fix me
  window.SERVER_SETTIGS = serverSettings;

  return serverSettings;
}