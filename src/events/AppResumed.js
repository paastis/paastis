import PaasAppEvent from "./PaasAppEvent.js";

export default class AppResumed extends PaasAppEvent {
  constructor(appKey, occurredAt) {
    super('app_resumed', appKey, occurredAt);
  }
}
