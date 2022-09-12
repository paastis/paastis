import ScalingoProvider from "./ScalingoProvider.js";
import config from "../config.js";
import { CleverCloudProvider } from "./CleverCloudProvider.js";

const provider = (config.provider.name === 'clever-cloud') ? new CleverCloudProvider() : new ScalingoProvider();

export default provider;
