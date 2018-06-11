function Menu() {
  const updateHealth = (health) => {
    document.getElementById('health').innerHTML = health;
  }

  const updateBulletsCount = (bullets) => {
    document.getElementById('bullet-count').innerHTML = bullets;
  }

  const updateScore = (score) => {
    document.getElementById('score-count').innerHTML = score;
  }

  return {
    updateHealth,
    updateBulletsCount,
    updateScore
  };
};