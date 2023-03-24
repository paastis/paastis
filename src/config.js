import dotenv from 'dotenv';

dotenv.config();

function parseIgnoredApps() {
  const value = process.env.REGISTRY_IGNORED_APPS;
  if (!value || value.trim().length === 0) {
    return [];
  }
  return value.trim().split(',');
}

function parseBoolean(value) {
  return value && value.trim().toLowerCase() === 'true';
}

let config = {
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  routing: {
    systemApiEnabled:
      parseBoolean(process.env.ROUTING_SYSTEM_API_ENABLED) || false,
    systemApiToken: process.env.ROUTING_SYSTEM_API_TOKEN,
  },
  registry: {
    type: process.env.REGISTRY_TYPE || 'in-memory', // ['in-memory', 'redis']
    ignoredApps: parseIgnoredApps(),
    redisUrl: process.env.REGISTRY_REDIS_URL || 'redis://127.0.0.1:6379',
  },
  provider: {
    name: process.env.PROVIDER_NAME || 'scalingo', // ['clever-cloud', 'scalingo', 'heroku']
    region: process.env.PROVIDER_REGION || 'to_be_defined',
    clever: {
      apiHost:
        process.env.PROVIDER_CLEVER_API_HOST || 'https://api.clever-cloud.com',
      oauthConsumerKey: process.env.PROVIDER_CLEVER_OAUTH_CONSUMER_KEY,
      oauthConsumerSecret: process.env.PROVIDER_CLEVER_OAUTH_CONSUMER_SECRET,
      apiOauthToken: process.env.PROVIDER_CLEVER_TOKEN,
      apiOauthTokenSecret: process.env.PROVIDER_CLEVER_SECRET,
      operationTimeout:
        parseInt(process.env.PROVIDER_CLEVER_OPERATION_TIMEOUT, 10) || 60,
    },
    heroku: {
      apiToken: process.env.PROVIDER_HEROKU_API_TOKEN || 'tk-us-xxx',
      operationTimeout:
        parseInt(process.env.PROVIDER_HEROKU_OPERATION_TIMEOUT, 10) || 30,
    },
    scalingo: {
      apiToken: process.env.PROVIDER_SCALINGO_API_TOKEN || 'tk-us-xxx',
      operationTimeout:
        parseInt(process.env.PROVIDER_SCALINGO_OPERATION_TIMEOUT, 10) || 30,
    },
  },
  startAndStop: {
    checkingIntervalCron:
      process.env.START_AND_STOP_CHECKING_INTERVAL_CRON || '* * * * *',
    maxIdleTime: parseInt(process.env.START_AND_STOP_MAX_IDLE_TIME, 10) || 15,
  },
  hooks: {
    beforeAppStart: process.env.HOOKS_BEFORE_START,
    afterAppStart: process.env.HOOKS_AFTER_START,
    beforeAppStop: process.env.HOOKS_BEFORE_STOP,
    afterAppStop: process.env.HOOKS_AFTER_STOP,
  },
  events: {
    store: process.env.EVENTS_STORE_TYPE || 'in-memory',
  },

  updateActivityMaxIdleTime(maxIdleTime) {
    this.startAndStop.maxIdleTime = maxIdleTime > 0 ? maxIdleTime : 0;
  },

  updateServerHost(host) {
    this.server.host = host;
  },

  updateServerPort(port) {
    this.server.port = port;
  },
};

export default config;
