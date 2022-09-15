# paastis-proxy

## Installation

```shell
# 1/ Fetch sources
git clone git@github.com:paastis/paastis-proxy.git

# 2/ Enter project directory
cd paastis-proxy

# 3/ Generate and edit .env file (especially, define SCALINGO_API_TOKEN value with your own API key)
cp env.sample .env

# 4/ Install project dependencies
npm install

# 5/ Start project
npm start

# 6/ Enjoy
curl -v http://localhost:3000 -H Host:my-cloud-app.proxy.example.com
```

## Configuration

| Variable                              | Required                                | Type    | Format                                | Default                      |  
|---------------------------------------|-----------------------------------------|---------|---------------------------------------|------------------------------|
| HOST                                  | false                                   | String  | IP or name                            | 0.0.0.0                      |  
| PORT                                  | false                                   | Number  | Number                                | 3000                         |  
| REGISTRY_TYPE                         | false                                   | String  | "in-memory" or "redis"                | in-memory                    |  
| REGISTRY_IGNORED_APPS                 | false                                   | String  | List of strings, separated by a comma | -                            |  
| REDIS_URL                             | false                                   | String  | redis://<host/>:<port/>               | -                            |  
| START_AND_STOP_CHECKING_INTERVAL_CRON | false                                   | String  | CRON expression                       | * * * * *                    |  
| START_AND_STOP_MAX_IDLE_TIME          | false                                   | Number  | Number of minutes                     | 51                           |  
| PROVIDER_NAME                         | **true**                                | String  | "scalingo" or "clever-cloud"          | -                            |  
| PROVIDER_SCALINGO_API_TOKEN           | only if PROVIDER_NAME is "scalingo"     | String  | Token string                          | -                            |  
| PROVIDER_SCALINGO_OPERATION_TIMEOUT   | false                                   | Number  | Number of seconds                     | -                            |  
| PROVIDER_CLEVER_API_HOST              | false                                   | String  | URL                                   | https://api.clever-cloud.com |  
| PROVIDER_CLEVER_OAUTH_CONSUMER_KEY    | only if PROVIDER_NAME is "clever-cloud" | String  | Token string                          | -                            |  
| PROVIDER_CLEVER_OAUTH_CONSUMER_SECRET | only if PROVIDER_NAME is "clever-cloud" | String  | Token string                          | -                            |  
| PROVIDER_CLEVER_TOKEN                 | only if PROVIDER_NAME is "clever-cloud" | String  | Token string                          | -                            |  
| PROVIDER_CLEVER_SECRET                | only if PROVIDER_NAME is "clever-cloud" | String  | Token string                          | -                            |  
| PROVIDER_CLEVER_OPERATION_TIMEOUT     | false                                   | Number  | Number of seconds                     | 60                           |  
| HOOKS_BEFORE_START                    | false                                   | String  | Shell command(s)                      | -                            |  
| HOOKS_AFTER_START                     | false                                   | String  | Shell command(s)                      | -                            |  
| HOOKS_BEFORE_STOP                     | false                                   | String  | Shell command(s)                      | -                            |  
| HOOKS_AFTER_STOP                      | false                                   | String  | Shell command(s)                      | -                            |  
| ROUTING_SYSTEM_API_ENABLED            | false                                   | Boolean |                                       | false                        |  
| ROUTING_SYSTEM_API_TOKEN              | false                                   | String  | xxx-yyy-zzz                           | -                            | 
