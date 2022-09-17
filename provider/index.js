import ScalingoProvider from "./ScalingoProvider.js";
import config from "../config.js";
import { CleverCloudProvider } from "./CleverCloudProvider.js";

let provider;
if (!provider) {
  if (config.provider.name === 'clever-cloud') {
    provider = new CleverCloudProvider();
  } else if (config.provider.name === 'scalingo') {
    provider = new ScalingoProvider();
  } else {
    throw new Error('PaaS provider not defined. Check that `PROVIDER_NAME` environment variable is set.')
  }
}

export default provider;
