const fs = require('fs');
const url = require('url');
const qs = require('querystring');

module.exports = class HomeController {
  onRequest (request, response, actionName) {
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
    request.on('end', () => {
      let data = qs.parse(body);
      if (this[actionName]) {
        this[actionName](request, response, data);
      } else {
        this.notFoundPage(request, response)
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

    if (this[actionName]) {
      this[actionName](request, response, parsedUrl.query);
    } else {
      this.notFoundPage(request, response)
    }
  }

  parseUrl (request) {
    return url.parse(request.url, true);
  };

  notFoundPage (request, response) {
    response.writeHead(
      404,
      {
        'Context-Type': 'text/plain'
      }
    );
    response.write('<h1>Page not found</h1>');
    response.end();
  };

  mainMenu(request, response) {
    response.writeHead(
      200,
      {
        'Context-Type': 'text/html'
      }
    );

    //const path = '/Users/ychupyrkin/Documents/dev/yurichupyrkin.github.io/client/circles-online.html'
    const path = 'F:/dev/yurichupyrkin.github.io/client/main-menu.html';
    fs.createReadStream(path).pipe(response);
  }

  circlesOnline(request, response) {
    response.writeHead(
      200,
      {
        'Context-Type': 'text/html'
      }
    );

    const path = 'F:/dev/yurichupyrkin.github.io/client/circles-online.html';
    fs.createReadStream(path).pipe(response);
  }
};