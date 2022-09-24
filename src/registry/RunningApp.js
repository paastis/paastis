export default class RunningApp {

  constructor(provider, region, name, group, maxIdleTime, startedAt, lastAccessedAt) {
    const now = new Date();
    this.provider = provider;
    this.region = region;
    this.name = name;
    this.group = group;
    this.maxIdleTime = maxIdleTime;

    if (startedAt) {
      this.startedAt = ((typeof startedAt) !== 'Date') ? new Date(startedAt) : startedAt;
    } else {
      this.startedAt = now;
    }

    if (lastAccessedAt) {
      this.lastAccessedAt = ((typeof lastAccessedAt) !== 'Date') ? new Date(lastAccessedAt) : lastAccessedAt;
    } else {
      this.lastAccessedAt = now;
    }
  }

  updateLastAccessedAt(lastAccessedAt) {
    this.lastAccessedAt = lastAccessedAt || new Date();
  }
}

