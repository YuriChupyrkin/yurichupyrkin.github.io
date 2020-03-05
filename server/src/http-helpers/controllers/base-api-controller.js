const url = require('url');
const qs = require('querystring');
const BaseController = require('./base-controller');

module.exports = class BaseApiController {
  onRequest (request, response, methodName) {
    this._request = request;
    this._response = response;

    if (request.method === 'GET') {
      this.beforeGet(request, response, methodName);
    } else if (request.method === 'POST') {
      this.beforePost(request, response, methodName);
    }
  };

  beforePost (request, response, methodName) {
    // TODO: do not parse arrays
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () =>{
      let data = qs.parse(body);

      if (this[methodName]) {
        this._response.writeHead(
          200,
          {
            'Context-Type': 'application/json'
          }
        );

        this[methodName](data);
      } else {
        this.notFound(request, response);
      }
    });
  }

  beforeGet (request, response, methodName) {
    const parsedUrl = this.parseUrl(request);

    if (!parsedUrl || !parsedUrl.pathname) {
      response.writeHead(404);
      response.end();
      return;
    }

    this._pathName = parsedUrl.pathname;
    //this._data = parsedUrl.query;

    if (this[methodName]) {
      this._response.writeHead(
        200,
        {
          'Context-Type': 'application/json'
        }
      );

      this[methodName](parsedUrl.query);
    } else {
      this.notFound(request, response);
    }
  }

  notFound (request, response) {
    response.writeHead(
      404,
      {
        'Context-Type': 'application/json'
      }
    );
    response.write('{"error": "api not found"}');
    response.end();
  }

  parseUrl (request) {
    return url.parse(request.url, true);
  };
};