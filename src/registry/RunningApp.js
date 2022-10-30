export default class RunningApp {
  constructor(
    provider,
    region,
    name,
    maxIdleTime,
    linkedApps,
    startedAt,
    lastAccessedAt
  ) {
    const now = new Date(Date.now());

    this.provider = provider;
    this.region = region;
    this.name = name;
    this.linkedApps = linkedApps || [];
    this.maxIdleTime = maxIdleTime;

    if (startedAt) {
      this.startedAt =
        typeof startedAt !== 'Date' ? new Date(startedAt) : startedAt;
    } else {
      this.startedAt = now;
    }

    if (lastAccessedAt) {
      this.lastAccessedAt =
        typeof lastAccessedAt !== 'Date'
          ? new Date(lastAccessedAt)
          : lastAccessedAt;
    } else {
      this.lastAccessedAt = now;
    }
  }

  get hasLinkedApps() {
    return this.linkedApps.length > 0;
  }

  updateLastAccessedAt(lastAccessedAt) {
    this.lastAccessedAt = lastAccessedAt || new Date(Date.now());
  }
}
