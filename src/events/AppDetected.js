import PaasAppEvent from "./PaasAppEvent.js";

export default class AppDetected extends PaasAppEvent {
  constructor(appKey, occurredAt) {
    super('app_detected', appKey, occurredAt);
  }
}
