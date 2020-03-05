const stringify = require('node-stringify');
const BaseApiController = require('../base-api-controller');

module.exports = class ApiController extends BaseApiController {
  constructor () {
    super();
  }

  getCats (data) {
    this._response.write(stringify(this.getAllCats()));
    this._response.end();
  }

  postCats (data) {
    this._response.write(stringify(this.getAllCats()));
    this._response.end();
  }

  getAllCats () {
    let cats = {
      cats: [
        {id: 1, name: 'Cat #1'},
        {id: 2, name: 'Cat #2'}
      ]
    };

    return cats;
  }
};