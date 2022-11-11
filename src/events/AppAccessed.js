import PaasAppEvent from "./PaasAppEvent.js";

export default class AppAccessed extends PaasAppEvent {
  constructor(appKey, occurredAt) {
    super('app_accessed', appKey, occurredAt);
  }
}
