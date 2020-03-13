const http = require('http');

module.exports = class Server {
  constructor (onRequestHander) {
    this._onRequestHandler = onRequestHander;
    this._port = 8888;
  }

  run() {
    console.log('server is running...');
    let server = http.createServer(this._onRequestHandler);

    // TODO: doesn't work
    server.on('error', function (er) { console.log('SERVER ERROR'); });
    server.listen(this._port);
    return server;
  };
};
