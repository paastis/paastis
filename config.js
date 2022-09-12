import dotenv from 'dotenv';

dotenv.config();

function parseIgnoredApps() {
  const value = process.env.REGISTRY_IGNORED_APPS;
  if (!value || value.trim().length === 0) {
    return [];
  }
  return value.trim().split(',');
}

const config = {
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  registry: {
    type: process.env.REGISTRY_TYPE || 'in-memory', // ['in-memory', 'redis']
    ignoredApps: parseIgnoredApps(),
    redisUrl: process.env.REGISTRY_REDIS_URL || 'redis://127.0.0.1:6379',
  },
  provider: {
    name: process.env.PROVIDER_NAME || 'scalingo', // ['clever-cloud', 'scalingo']
    clever: {
      apiHost: process.env.CLEVER_API_HOST || 'https://api.clever-cloud.com',
      oauthConsumerKey: process.env.CLEVER_OAUTH_CONSUMER_KEY,
      oauthConsumerSecret: process.env.CLEVER_OAUTH_CONSUMER_SECRET,
      apiOauthToken: process.env.CLEVER_TOKEN,
      apiOauthTokenSecret: process.env.CLEVER_SECRET,
    },
    scalingo: {
      apiToken: process.env.SCALINGO_API_TOKEN || 'tk-us-xxx',
      operationTimeout: parseInt(process.env.SCALINGO_OPERATION_TIMEOUT, 10) || 30,
    },
  },
  startAndStop: {
    checkingIntervalCron: process.env.START_AND_STOP_CHECKING_INTERVAL_CRON || '* * * * *',
    maxIdleTime: parseInt(process.env.START_AND_STOP_MAX_IDLE_TIME, 10) || 15,
  },
  hooks: {
    beforeAppStart: process.env.HOOKS_BEFORE_START,
    afterAppStart: process.env.HOOKS_AFTER_START,
    beforeAppStop: process.env.HOOKS_BEFORE_STOP,
    afterAppStop: process.env.HOOKS_AFTER_STOP,
  }
}

console.debug();
console.debug(config);
console.debug();

export default config;
