# 2022-09-14 - Internal System Monitoring

## État interne et custom headers

Il est important de pouvoir monitorer, alerter et déboguer le proxy, cette espèce de réseau de canalisation HTTP.

Parmi les métriques intéressantes :

- les `RunningApps` indiquées dans le registre (in-memory ou Redis-based)
- connaître l'état général du système via une query `/ping` ou `/health`
- avoir un aperçu plus fin des ressources système via une query `/metrics`

Dans le cadre d'un système de type proxy, l'affaire est "intéressante" dans la mesure où on ne peut pas passer par la voie facile des URL/URI.

On ne peut pas suffixer par `/admin` car très probablement, l'une des applications proxifiée proposera une telle route.

Suffixer par `internal.` ou `system.` ou `admin.` semble aussi très bizarre.
À la rigueur, on pourrait ajouter une variable d'environnement `PAASTIS_SYSTEM_DOMAIN`.
Mais je trouve quand même cela pas optimal.
Je n'aime pas trop l'idée mettre du code au niveau du "routage métier", dans le cœur du dispositif.
Je préfère que la décision de faire un traitement interne (vs. router vers l'externe) ait été prise en amont.

La solution que je retiens est de passer par les custom headers HTTP.

## Custom headers HTTP

Naïvement, je pensais que tous les custom headers HTTP devaient être prévixés par `X-`.

C'était bien une recommandation… il y a fort fort longtemps.
Depuis, cette recommandation a été annulée dans une RFC officielle (la [RFC 6648](https://www.rfc-editor.org/rfc/rfc6648.html)).
[Cette discussion sur StackOverflow](https://stackoverflow.com/questions/3561381/custom-http-headers-naming-conventions) est passionnante.

Le problème d'utiliser le préfixe `X-` est que si le header devient un standard, ça devient très dur de le renommer.

À noter aussi qu'un header `X-` ne peut être considéré comme un header ou une info de sécurité.

[Il est préconisé](https://specs.openstack.org/openstack/api-wg/guidelines/headers.html) aujourd'hui de préfixer les custom headers par le domain de la plateforme qui les introduit / exploite,

Ex :

- `PaastisProxyTarget` : `system`, `upstream`
- `PaastisProxyToken` : `tk-us-xxx-yyy-zzz`

## Décision

Afin de monitorer, alerter, déboguer le système interne du module `paastis-proxy` :

- celui-ci expose des endpoints `/system/health`, `/system/registry`, `/system/metrics`, etc.
- au format JSON
- pour y accéder, il faut que la requête contienne les headers `PaastisProxyTarget` et `PaastisProxyToken`
- il faut ajouter les variables d'environnement `PROXY_SYSTEM_API_ENABLED` et `PROXY_SYSTEM_API_TOKEN` (en attendant d'avoir un mécanisme d'authentification plus évolé)

🚨 Pour l'heure, il faut bien prendre garde à **bien sécuriser les clients de l'API système** !!!

## Exemple

```shell
$ curl -v localhost:3000 -H "Host: app_0210ab5c-xxx-yyy-zzz.proxy.paastis.dev" -H "PaastisProxyTarget: system" -H "PaastisProxySystemApiToken: abcd-1234-EFGH-5678"
```
