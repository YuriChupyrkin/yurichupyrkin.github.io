const fs = require('fs');
const BaseController = require('../base-controller');

module.exports = class HomeController extends BaseController {
  constructor () {
    super();
    // TODO: need for dev env
    this._htmlPath = 'F:/dev/yurichupyrkin.github.io/client/main-menu.html'
  }

  get (data) {
    this._response.writeHead(
      200,
      {
        'Context-Type': 'text/html'
      }
    );
    fs.createReadStream(this._htmlPath).pipe(this._response);
  }
};