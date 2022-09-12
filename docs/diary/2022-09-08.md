# 2022-09-08 - Peaufinage artistique

## 🈳 Gateway → Proxy

Le cœur du réacteur repose sur `node-http-proxy`.
Cela signifie bien que le composant principal n'est pas une _gateway_, mais bien un _proxy_.
On renomme donc le composant `paastis-gateway` en `paastis-proxy`

## 🌳 npm workspaces

Quite à découvrir des choses, autant utiliser les _workspaces_ npm.

À termes, et après renommage, on pourrait avoir les espaces suivant :

```
paastis
  ⌙ paastis-api         → API pour le front ou les clients qui souhaitent manipuler leur comptes en CLI  
  ⌙ paastis-cli         → CLI qui consomme l'API 
  ⌙ paastis-web         → IHM d'administration de la plateforme
  ⌙ paastis-db          → Database PG (pour les comptes, les configs, etc.)
  ⌙ paastis-proxy       → Proxy HTTP qui recense / allume / éteint les apps 
  ⌙ paastis-index    → Map Redis ou in-memory 
  ⌙ ...
```

> ❌ Je ne suis pas parvenu à faire fonctionner les workspaces avec Scalingo.


## ⚙️ Config et variables d'environnement

Ajout d'un module `./config.js` dont le but est de centraliser toutes les variables d'environnement.

La règle : il ne doit y avoir aucune instruction `process.env.xxx` dans aucun autre fichier que le fichier `config.js`.

> ⚠️ Quand on parse des variables d'environnement, il faut vraiment faire attention au type de la donnée attendue, aux cas d'erreur ou à la marge (variable non déclarée ou vide, liste de valeurs avec ',' ou ', ').



