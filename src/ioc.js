class Container {
  _services;

  constructor() {
    this._services = new Map();
  }

  register(service, name) {
    if (!name) {
      throw new Error('Service name required');
    }
    if (!service) {
      throw new Error('Service instance required');
    }
    this._services.set(name, service);
  }

  lookup(serviceName) {
    const service = this._services.get(serviceName);
    if (!service) {
      throw new Error('Service not registered in IoC container');
    }
    return service;
  }
}

const container = new Container();

export { Container, container };
