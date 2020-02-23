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

  const updatePauseButton = (isPause) => {
    let state = isPause ? 'Continue' : 'Pause';
    let text = `${state} (Ctrl)`;
    document.getElementById('btn-pause').innerHTML = text;
  }

  return {
    updateHealth,
    updateBulletsCount,
    updateScore,
    updatePauseButton,
  };
};