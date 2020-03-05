const fs = require('fs');
const BaseController = require('./base-controller');

module.exports = class ResourcesController extends BaseController {
  constructor () {
    super();
  }

  get (data) {
    const pathName = this._pathName;
    // TODO: need to dev env
    const fullPath = `F:/dev/yurichupyrkin.github.io/client/${pathName}`;

    this._response.writeHead(
      200,
      {
        'Context-Type': 'text/javascript'
      }
    );

    fs.createReadStream(fullPath).pipe(this._response);
  }
};