class HttpHelper {
  static getServerPing(url = '') {
    return new Promise((resolve, reject) => {
      const pingTime = performance.now();
      $.get(`${url}/api/check_ping`).then(() => {
        const ping = Math.round(performance.now() - pingTime);
        resolve(ping);
      }).fail((error) => {
        reject(error);
      });
    });
  }

  static getServerSettings(url = '') {
    return new Promise((resolve, reject) => {
      $.get(`${url}/api/get_settings`).then((settings) => {
        resolve(settings);
      }).fail((error) => {
        reject(error);
      });
    });
  }
}
