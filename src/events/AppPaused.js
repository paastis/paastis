import PaasAppEvent from "./PaasAppEvent.js";

export default class AppPaused extends PaasAppEvent {
  constructor(appKey, occurredAt) {
    super('app_paused', appKey, occurredAt);
  }
}
