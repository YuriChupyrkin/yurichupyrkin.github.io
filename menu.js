function Menu() {
  const updateHealth = (health) => {
    document.getElementById('health').innerHTML = health;
  }

  const updateBulletsCount = (bullets) => {
    document.getElementById('bullet-count').innerHTML = bullets;
  }

  const updateEnemiesCount = (enemies) => {
    document.getElementById('enemy-killed-count').innerHTML = enemies;
  }

  return {
    updateHealth,
    updateBulletsCount,
    updateEnemiesCount
  };
};