import PaasAppEvent from "./PaasAppEvent.js";

export default class AppRemoved extends PaasAppEvent {
  constructor(appKey, occurredAt) {
    super('app_removed', appKey, occurredAt);
  }
}
