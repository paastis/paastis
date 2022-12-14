# 2022-09-09 - 🎡 La routourne a tourné

## ✅ It works again!

Aujourd'hui, rien ne fonctionne correctement.
Depuis hier et quelques modifs, impossible de déployer et scaler correctement l'application Scalingo `paastis-proxy`.

Rahhh… C'était tout bidon.
Quand j'ai mis en place la config, j'ai mis `localhost` en host par défaut plutôt que `0.0.0.0`.
Et donc, selon les règles de Scalingo, l'application n'écoutait pas correctement le bon host + port.
Pfff… 2h de perdues pour une bêtise.

## 🚦 Supervisor, Redis & POO

Redis va permettre d'avoir du scaling horizontal.
Toutes les instances de `paastis-proxy` vont pouvoir s'appuyer sur une seule et même source de vérité.

L'un des soucis, c'est qu'en l'état, on peut avoir plusieurs instances qui tentent de démarrer ou couper une même app en même temps (ou dans un temps trop court).

Plusieurs solutions :
- sortir le cron dans un nouveau processus, mais dépendant du mode de fonctionnement de Scalingo / Heroku. Pas très host-provider agnostic
- sortir le cron dans un nouveau module/workspace `paastis-supervisor`
- avoir une clé `last_checked_at` dans Redis, mais il faut s'assurer qu'on locke bien la base

Quoi qu'il en soit, l'idée est de supporter 2 types de index store :
- `in-memory`
- `redis`

Pour ça, on va utiliser les mécanismes (très basiques) de POO de JavaScript.

J'avais oublié que Redis ne stocke que des Strings.

```javascript
  async get(appName) {
    return JSON.parse(await this._redisClient.get(appName));
  }

  async set(appName, managedApp) {
    return await this._redisClient.set(appName, JSON.stringify(managedApp));
  }
```

Comme d'hab, des soucis de date à gérer : 

```javascript
export default class RunningApp {

  constructor(name, region, startedAt, lastAccessedAt) {
    const now = new Date();
    this._name = name;
    this._region = region;

    if (startedAt) {
      this._startedAt = ((typeof startedAt) !== 'Date') ? new Date(startedAt) : startedAt;
    } else {
      this._startedAt = now;
    }

    if (lastAccessedAt) {
      this._lastAccessedAt = ((typeof lastAccessedAt) !== 'Date') ? new Date(lastAccessedAt) : lastAccessedAt;
    } else {
      this._lastAccessedAt = now;
    }
  }
}
```

### Variables d'environnement

Autre souci, quand on ajoute un addon Redis dans Scalingo, il ajoute les 2 variables d'environnement suivantes :
- `SCALINGO_REDIS_URL=redis://:{generated_password}@{app_instance}.redis.a.osc-fr1.scalingo-dbs.com:{port}`
- `REDIS_URL=$SCALINGO_REDIS_URL`

L'interpolation ne fonctionne qu'à un niveau.

Et donc ajouter une troisième variable `REGISTRY_REDIS_URL=$REDIS_URL` ne fonctionne pas.

### Design

J'ai opté pour un design qui sépare bien les responsabilités :
- `index.js` → fournit une instance (singleton) de `RunningAppRegistry`
- `RunningApp.js` → la structure de donnée qui permet de monitorer les apps actives
- `RunningAppRegistry.js` → 🤔 classe englobante du store ; je me demande s'il y a vraiment un intérêt à conserver cette proxy-class
- `RunningAppRegistryStore.js` → là où se passe la magie de stockage, récupération et modification de l'information ; 2 implémentations sont disponibles : in-memory et Redis-based

## 🪝 Hooks before/after - start/stop

Il y a 2 façons d'exécuter des commandes / scripts shell : 
- `child_process/exec`
- `child_process/spawn`

https://benborgers.com/posts/node-shell

