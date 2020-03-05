function StatusBarHelper() {
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
    let text = `${state} (ESC)`;
    document.getElementById('btn-pause').innerHTML = text;
  }

  const updatePosition = (x, y) => {
    document.getElementById('position').innerHTML = `${x}; ${y}`;
  }

  return {
    updateHealth,
    updateBulletsCount,
    updateScore,
    updatePauseButton,
    updatePosition,
  };
};