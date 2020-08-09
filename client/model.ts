class Model {
  private ws: WebSocket;
  private subscribers: Function[] = [];
  constructor() {
    this.ws = new WebSocket('ws://localhost:8999');
    this.ws.onclose = () => console.info('[close] Connection closed to WS');

    this.ws.onmessage = (event) => {
      if (event.data) {
        const { d, t } = JSON.parse(event.data);
        this.subscribers.forEach((callback) => {
          callback({ d, t });
        });
      }
    };
  }

  addSubscriber(cb: Function) {
    this.subscribers.push(cb);
  }
}

export default new Model();
