class HttpHelper {
  static getServerPing() {
    return new Promise((resolve, reject) => {
      const pingTime = performance.now();
      $.get('/api/check_ping').then(() => {
        const ping = Math.round(performance.now() - pingTime);
        resolve(ping);
      }).fail((error) => {
        reject(error);
      });
    });
  }
}