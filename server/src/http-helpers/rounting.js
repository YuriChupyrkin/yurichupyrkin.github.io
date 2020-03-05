const ResourcesController = require('./controllers/resources-controller');
const ApiController = require('./controllers/api/api-controller');
const WebPagesController = require('./controllers/web-pages/web-pages-controller');

const _ = require('lodash');
const url = require('url');

module.exports = class Routing {
  checkResourcesRequest (pathName) {
    let lowerCase = pathName.toLowerCase();
    return _.endsWith(lowerCase, '.js') || _.endsWith(lowerCase, '.css');
  }

  buildRequestHander (request, response) {
    const requestUrl = url.parse(request.url);

    if (!requestUrl || !requestUrl.pathname) {
      new WebPagesController().notFoundPage(request, response);
    }

    let pathName = requestUrl.pathname;

    if (this.checkResourcesRequest(pathName)) {
      console.log(`internal resources url: ${pathName}`);
      new ResourcesController().get(request, response, pathName);
      return;
    }

    console.log(`request url: ${pathName}`);

    if (pathName.includes('/api/')) {
      const splittedByApi = pathName.split('/api/');
      const actionName = splittedByApi[splittedByApi.length - 1];

      const apiController = new ApiController();
      apiController.onRequest(request, response, actionName);

      return;
    }

    switch (pathName) {
      case '/':
      case '/index':
        new WebPagesController().onRequest(request, response, 'mainMenu');
        break;
      case '/circles-online':
        new WebPagesController().onRequest(request, response, 'circlesOnline');
        break;
      default:
        new WebPagesController().notFoundPage(request, response);
    }
  }
}
