const settings = require('../settings/settings');

module.exports = class ApiController {
  constructor() {
  }

  registerRoutes(router) {
    router.get('/api/check_ping', (req ,res) => {
      res.json({ok: true});
    });

    router.get('/api/get_settings', (req ,res) => {
      const serverOrigin = `${req.get('host')}`;
      res.json(JSON.stringify(
        {
          ...settings,
          SERVER_ORIGIN: serverOrigin,
        })
      );
    });
  }
}
