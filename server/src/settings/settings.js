const gameConfig = {
  SETTINGS_ID: "1.0.1",
  FPS: 60,


  /* game balance */
  PLAYER_START_RADIUS: 30,
  PLAYER_START_HEALTH: 10,
  PLAYER_START_SPEED: 5,
  GUN_RADIUS: 10,
  BULLET_RADIUS: 8,
  START_BULLETS_COUNT: 30,
  ADD_BULLETS_RATE: 0.5,
  GUN_ANGLE_MOVE_RATE: 6,
  BULLET_SPEED_RATE: 0.3,
  NPC_MIN_RADIUS: 18,
  NPC_MAX_RADIUS: 46,
  NPC_ENEMY_PROBABILITY: 0.8,

  /* GAME ZONE */
  REDUCE_GAME_ZONE_RATE: 3,
  GAME_ZONE_NPC_DENCITY_RATE: 600,
  GAME_ZONE_RADIUS: 5000,
  GAZE_ZONE_STROKE_COLOR: 'red',
  GAZE_ZONE_FILL_COLOR: 'rgba(220, 232, 228, 0.3)',


  /* canvas */
  CANVAS_CELL_LENGHT: 200,


  /* player */
  PLAYER_STROKE_COLOR: '#fd795c',
  PLAYER_FILL_COLOR: '#FF7F66',


  /* gun and bullets */
  GUN_STROKE_COLOR: '#fde25c',
  GUN_FILL_COLOR: '#ffd714',
  BULLET_STROKE_COLOR: '#f58801',
  BULLET_FILL_COLOR: 'orange',


  /* NPC */
  NPC_ENEMY_FILL_COLOR: 'black',
  NPC_ENEMY_STROKE_COLOR: '#110952',
  NPC_DEFAULT_STROKE_COLOR: '#110952',
  NPC_AMMO_FILL_COLOR: '#ebef00',
  NPC_HEALTH_FILL_COLOR: '#10b910',



  /* ROLES */
  ROLE_NPC_AMMO: 'AMMO',
  ROLE_NPC_HEALTH: 'HEALTH',
  ROLE_NPC_ENEMY: 'ENEMY',
  ROLE_BULLET: 'BULLET',
  ROLE_GUN: 'GUN',
  ROLE_PLAYER: 'PLAYER',
  ROLE_GAME_ZONE: 'GAME_ZONE',
};

module.exports = gameConfig;
