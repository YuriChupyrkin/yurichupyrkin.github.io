const HomeController = require('./controllers/home/home-controller');
const ResourcesController = require('./controllers/resources-controller');
const ApiController = require('./controllers/api/api-controller');
// const SocketChatController = require('../controllers/socketChat/chatController');
const _ = require('lodash');
const url = require('url');

module.exports = class Routing {
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

  controllerFactory(request, response, controller) {
    let instance = new controller();
    instance.onRequest(request, response);
  }

  apiControllerFactory(request, response, methodName) {
    let apiController = new ApiController();
    apiController.onRequest(request, response, methodName);
  }

  checkResourcesRequest (pathName) {
    let lowerCase = pathName.toLowerCase();
    return _.endsWith(lowerCase, '.js') || _.endsWith(lowerCase, '.css');
  }

  buildRequestHander (request, response) {
    const controllerFactory = this.controllerFactory.bind(this, request, response);
    const apiControllerFactory = this.apiControllerFactory.bind(this, request, response);
    const requestUrl = url.parse(request.url);
    let pathName;

    if (!requestUrl || !requestUrl.pathname) {
      this.notFoundPage(request, response);
    }

    pathName = requestUrl.pathname;

    if (this.checkResourcesRequest(pathName)) {
      console.log(`internal resources url: ${pathName}`);
      new ResourcesController().onRequest(request, response);
      return;
    }

    console.log(`request url: ${pathName}`);

    if (pathName.includes('/api/')) {
      const splittedByApi = pathName.split('/api/');
      const methodName = splittedByApi[splittedByApi.length - 1];
      apiControllerFactory(methodName);

      return;
    }

    switch (pathName) {
      case '/':
      case '/index':
      case '/home':
        controllerFactory(HomeController);
        break;
      default:
        this.notFoundPage(request, response);
    }
  }
}
