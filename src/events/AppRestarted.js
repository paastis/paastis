import PaasAppEvent from "./PaasAppEvent.js";

export default class AppRestarted extends PaasAppEvent {
  constructor(appKey, occurredAt) {
    super('app_restarted', appKey, occurredAt);
  }
}
