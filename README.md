# paastis

## Features

Paastis module is the heart of the Paastis project.

**Its goal is to monitor and manage (start & stop) PaaS applications based on their activity.**

![Paastis schema](./docs/paastis_schema.png)

Scenario :
1. Auto-discovery: Paastis detects that there is a new review app on Scalingo ; it begins to monitor it
2. Scale-to-zero: If the app is not accessed during the next 15mn (editable duration), then it is shut down (but not delete)
3. Run on-demand: If someone wants to finally access the app, then it is awakened
4. Smart proxy: Thus, the engine proxies the HTTP request to the upstream desired location

It is composed of the following building blocks :
- a proxy that forwards ingoing HTTP requests to an upstream server (based on the predefined PaaS provider)
- a registry of the running PaaS applications to monitor (in-memory or Redis-based)
- a schedule (cron-based) process that regularly (every minute by default) update the registry with new / deleted / running / sleeping PaaS applications

Paastis supports **multiple PaaS providers** (but not yet all their regions) :
- Clever Cloud
- Heroku
- Scalingo

It is also possible to define Shell commands (a.k.a. **hooks**) to be executed for each application on the following phases :
- before an app to be stopped
- after it stopped
- before an app to be started
- after it started

Sometimes, we do not want to monitor and manage some apps (for example, an instance of Paastis engine 😙).
We can exclude / **ignore apps to me managed** (with environment variable `REGISTRY_IGNORED_APPS`.

## Getting started in 2 minutes

The easiest and quickest way to try Paastis is to launch a program instance with npx.

```shell
$ PROVIDER_NAME=scalingo \
PROVIDER_SCALINGO_API_TOKEN=tk-us-xxx \
npx paastis
```

You can add a `.env` and `paastis.yml` file(s) (cf. below) to configure your instance.

## Installation

```shell
# 1/ Fetch sources
git clone git@github.com:paastis/paastis.git

# 2/ Enter project directory
cd paastis

# 3/ Generate and edit .env file (especially, define SCALINGO_API_TOKEN value with your own API key)
cp sample.env .env

# 4/ Install project dependencies
npm install

# 5/ Start project
npm start

# 6/ Enjoy
curl -v http://localhost:3000 -H Host:my-cloud-app.proxy.example.com
```

## Configuration

### Environment variables

| Variable                              | Required                                | Type    | Format                                | Default                      |
|---------------------------------------|-----------------------------------------|---------|---------------------------------------|------------------------------|
| HOST                                  | false                                   | String  | IP or name                            | 0.0.0.0                      |
| PORT                                  | false                                   | Number  | Number                                | 3000                         |
| REGISTRY_TYPE                         | false                                   | String  | "in-memory" or "redis"                | in-memory                    |
| REGISTRY_IGNORED_APPS                 | false                                   | String  | List of strings, separated by a comma | -                            |
| REGISTRY_REDIS_URL                    | false                                   | String  | redis://<host/>:<port/>               | -                            |
| START_AND_STOP_CHECKING_INTERVAL_CRON | false                                   | String  | CRON expression                       | * * * * *                    |
| START_AND_STOP_MAX_IDLE_TIME          | false                                   | Number  | Number of minutes                     | 15                           |
| PROVIDER_NAME                         | **true**                                | String  | "scalingo" or "clever-cloud"          | -                            |
| PROVIDER_REGION                       | false                                   | String  | "osc-fr1", "rbx", etc.                | -                            |
| PROVIDER_SCALINGO_API_TOKEN           | only if PROVIDER_NAME is "scalingo"     | String  | Token string                          | -                            |
| PROVIDER_SCALINGO_OPERATION_TIMEOUT   | false                                   | Number  | Number of seconds                     | -                            |
| PROVIDER_HEROKU_API_TOKEN             | only if PROVIDER_NAME is "heroku"       | String  | Token string                          | -                            |
| PROVIDER_HEROKU_OPERATION_TIMEOUT     | false                                   | Number  | Number of seconds                     | -                            |
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

### App rules

Declare a file `paastis.yml` (or copy and rename `paastis.yml.sample`).

You can set or edit the following `RunningApp.js` properties :
- `app_name` → set `RunningApp.name`
- `app_max_idle_time` → set `RunningApp.maxIdleTime`
- `linked_apps` → set (without any concatenation) `RunningApp.linkedApps`

```yaml
rules:
  - pattern: 'app-review-pr(\d+)-(back|front)'
    linked_apps:
      - 'app-review-pr$1-front'

  - pattern: 'hello-fastify'
    linked_apps:
      - 'hellofastifydeux'

  - pattern: 'hello-fastify-2'
    app_name: 'hellofastifydeux'

  - pattern: '.*fastify.*'
    app_max_idle_time: 0
```

## Docker

**1/** Build the Docker image

```shell
$ docker build -t paastis .
```

> 💡 If you define a file `paastis.yml` it will be added to the image.

**2/** Run a container

```shell
$ docker run \
-it --rm -p 3000:3000 \
--name paastis \
-e PROVIDER_SCALINGO_API_TOKEN=tk-us-xxx \
-e ROUTING_SYSTEM_API_ENABLED=true \
-e ROUTING_SYSTEM_API_TOKEN=abcd-1234-EFGH-5678 \
paastis
```

**3/** Test

```shell
$ curl -v localhost:3000 -H "Host: my-app.proxy.example.net"
$ curl -v localhost:3000/apps -H "PaastisProxyTarget: system" -H "PaastisProxySystemApiToken: abcd-1234-EFGH-5678" | jq .
```
