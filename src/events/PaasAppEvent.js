export default class PaasAppEvent {
  /**
   * @param name String title at past form
   * @param appKey String provider:region:app-name
   * @param occurredAt Date
   */
  constructor(name, appKey, occurredAt) {
    this.name = name;
    this.appKey = appKey;
    this.occurredAt = occurredAt;
  }
}
