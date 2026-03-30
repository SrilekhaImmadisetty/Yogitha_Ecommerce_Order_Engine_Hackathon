class EventBus {
  constructor() {
    this.listeners = {};
  }

  subscribe(event, handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  publish(event, data) {
    const handlers = this.listeners[event] || [];

    for (let handler of handlers) {
      handler(data);
    }
  }
}

module.exports = new EventBus();