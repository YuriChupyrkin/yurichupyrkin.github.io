$(document).ready(() => {
  console.log('main menu loaded');
  let serverPing = null;


  // const socket = io.connect('http://localhost:8888');

  // socket.on('game-state-refresh', onReceiveMessage);

  // function onReceiveMessage (data) {
  //   console.log(data);
  // }

  // window.upudateState = function () {
  //   socket.emit('game-state-refresh', {
  //     refreshCount: 100
  //   });
  // }




  $('.check-server').click(function() {
    this.setAttribute('disabled', true);

    HttpHelper.getServerPing().then((ping) => {
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
    console.log('start game');
    location.pathname = '/circles-online';
  });
});
