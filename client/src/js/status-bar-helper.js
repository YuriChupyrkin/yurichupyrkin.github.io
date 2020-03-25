function StatusBarHelper() {
  const updatePauseButton = (isPause) => {
    let state = isPause ? 'Continue' : 'Pause';
    let text = `${state} (ESC)`;
    document.getElementById('btn-pause').innerHTML = text;
  }

  const setSettingsVersion = (version) => {
    document.querySelector('.settings-id').innerHTML = version;
  }

  const updatePosition = (x, y) => {
    document.getElementById('position').innerHTML =
      `${Math.round(x)}; ${Math.round(y)}`;
  }

  const updatePlayerState = (playerState) => {
    document.getElementById('health').innerHTML
      = playerState.health;

    document.getElementById('bullet-count').innerHTML
      = playerState.bulletsCount;

    document.getElementById('npc-score-count').innerHTML
      = playerState.score.npcKilled;

    document.getElementById('players-score-count').innerHTML
      = `${playerState.score.playerHit} / ${playerState.score.playerKilled}`;
  }

  return {
    updatePauseButton,
    updatePosition,
    updatePlayerState,
    setSettingsVersion,
  };
};