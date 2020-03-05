const url = require('url');
const qs = require('querystring');

module.exports = class BaseController {
  onRequest (request, response) {
    this._request = request;
    this._response = response;

    if (request.method === 'GET') {
      this.beforeGet(request, response);
    } else if (request.method === 'POST') {
      this.beforePost(request, response);
    }
  };

  beforePost (request, response) {
    // TODO: do not parse arrays
    let self = this;
    let body = '';
    request.on('data', function (chunk) {
      body += chunk;
    });
    request.on('end', function () {
      let data = qs.parse(body);
      self.post(data);
    });
  }

  beforeGet (request, response) {
    const parsedUrl = this.parseUrl(request);

    if (!parsedUrl || !parsedUrl.pathname) {
      response.writeHead(404);
      response.end();
      return;
    }

    this._pathName = parsedUrl.pathname;
    //this._data = parsedUrl.query;
    this.get(parsedUrl.query);
  }

  parseUrl (request) {
    return url.parse(request.url, true);
  };
};