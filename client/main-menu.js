$(document).ready(() => {
  console.log('main menu loaded');
  let serverPing = null;

  $('.check-server').click(function() {
    this.setAttribute('disabled', true);

    HttpHelper.getServerPing(origin).then((ping) => {
      serverPing = ping;
      $('.server-ping-value').text(ping);
    }).catch((error) => {
      serverPing = null;
      console.error(error);
      $('.server-ping-value').text('--');
    }).finally(() => {
      this.removeAttribute('disabled');
    })
  });

  $('.start-game-button').click(function() {
    HttpHelper.getServerSettings(origin).then((settings) => {
      console.log(settings);
      localStorage.setItem('serverSettings', settings);
      location.pathname = '/circles-online';
    });
  });
});
