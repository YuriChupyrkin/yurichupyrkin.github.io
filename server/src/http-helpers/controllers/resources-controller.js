const fs = require('fs');

module.exports = class ResourcesController {
  get (request, response, pathName) {
    // TODO: need to dev env
    const fullPath = `F:/dev/yurichupyrkin.github.io/client/${pathName}`;
    //const fullPath = `/Users/ychupyrkin/Documents/dev/yurichupyrkin.github.io/client/${pathName}`

    response.writeHead(
      200,
      {
        'Context-Type': 'text/javascript'
      }
    );

    fs.createReadStream(fullPath).pipe(response);
  }
};