export default class RunningApp {

  constructor(provider, name, region, maxIdleTime, startedAt, lastAccessedAt) {
    const now = new Date();
    this._provider = provider;
    this._name = name;
    this._region = region;
    this._maxIdleTime = maxIdleTime;

    if (startedAt) {
      this._startedAt = ((typeof startedAt) !== 'Date') ? new Date(startedAt) : startedAt;
    } else {
      this._startedAt = now;
    }

    if (lastAccessedAt) {
      this._lastAccessedAt = ((typeof lastAccessedAt) !== 'Date') ? new Date(lastAccessedAt) : lastAccessedAt;
    } else {
      this._lastAccessedAt = now;
    }
  }

  get provider() {
    return this._provider;
  }

  get name() {
    return this._name;
  }

  get region() {
    return this._region;
  }

  get maxIdleTime() {
    return this._maxIdleTime;
  }

  updateLastAccessedAt(lastAccessedAt) {
    this._lastAccessedAt = lastAccessedAt || new Date();
  }

  get lastAccessedAt() {
    return this._lastAccessedAt;
  }
}

