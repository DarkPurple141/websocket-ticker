class Model {
  constructor() {
    this.ws = new WebSocket('ws://localhost:8999');
    this.ws.onerror = function (error) {
      console.warn(`[error] ${error.message}`);
    };
    this.ws.onclose = function () {
      console.info('[close] Connection closed to WS');
    };
    this.subscribers = [];

    this.ws.onmessage = (event) => {
      if (event.data) {
        const { d, t } = JSON.parse(event.data);
        this.subscribers.forEach((callback) => {
          callback({ d, t });
        });
      }
    };
  }

  addSubscriber(cb) {
    this.subscribers.push(cb);
  }
}

export default new Model();
