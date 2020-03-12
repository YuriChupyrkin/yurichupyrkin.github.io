function getServerSettings() {
  let serverSettings = JSON.parse(localStorage.getItem('serverSettings'));

  // todo: fix me
  window.SERVER_SETTIGS = serverSettings;

  return serverSettings;
}