export class Event {
  oid;
  name;
  date;

  constructor(name, id) {
    this.oid = id;
    this.name = name;
    this.date = new Date(Date.now());
  }
}

export class AppRegistered extends Event {
  constructor(appKey) {
    super('APP_REGISTERED', appKey);
  }
}

export class AppUnregistered extends Event {
  constructor(appKey) {
    super('APP_UNREGISTERED', appKey);
  }
}

export class AppStopped extends Event {
  constructor(appKey) {
    super('APP_STOPPED', appKey);
  }
}

export class AppStarted extends Event {
  constructor(appKey) {
    super('APP_STARTED', appKey);
  }
}
