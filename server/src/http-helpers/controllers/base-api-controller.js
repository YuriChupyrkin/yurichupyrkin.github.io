const url = require('url');
const qs = require('querystring');

module.exports = class BaseApiController {
  onRequest (request, response, actionName) {
    this._request = request;
    this._response = response;

    if (request.method === 'GET') {
      this.beforeGet(request, response, actionName);
    } else if (request.method === 'POST') {
      this.beforePost(request, response, actionName);
    }
  };

  beforePost (request, response, actionName) {
    // TODO: do not parse arrays
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () =>{
      let data = qs.parse(body);

      if (this[actionName]) {
        this._response.writeHead(
          200,
          {
            'Context-Type': 'application/json'
          }
        );

        this[actionName](data);
        this._response.end();
      } else {
        this.notFound(request, response);
      }
    });
  }

  beforeGet (request, response, actionName) {
    const parsedUrl = this.parseUrl(request);

    if (!parsedUrl || !parsedUrl.pathname) {
      response.writeHead(404);
      response.end();
      return;
    }

    this._pathName = parsedUrl.pathname;
    //this._data = parsedUrl.query;

    if (this[actionName]) {
      this._response.writeHead(
        200,
        {
          'Context-Type': 'application/json'
        }
      );

      this[actionName](parsedUrl.query);
      this._response.end();
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