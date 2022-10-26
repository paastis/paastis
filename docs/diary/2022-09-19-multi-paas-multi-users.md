# 2022-09-19 - Multi-PaaS, multi-users

## Bilan

Faisons le point, après 2 semaines tout pile de boulot :

- je n'ai pas de tests auto, ni de CI / CD, ni de package npm, ni image Docker sur le Hub
- j'ai un POC qui valide l'hypothèse qu'on peut faire un proxy multi-paas
- le tout est Open Source (licence AGPL-3.0)

## Vision, ambition et licence

> 💡 On n'a plus le droit d'utiliser le code [SPDX](https://fr.wikipedia.org/wiki/SPDX) `AGPL-3.0` qui est dépréciée mais `AGPL-3.0-or-later` ou `AGPL-3.0-only`.

Je me demande s'il ne faudrait pas changer la licence : **passer de `AGPL-3.0` à [`CC BY-NC-SA 3.0`](https://creativecommons.org/licenses/by-nc-sa/3.0/deed.fr)**.

**Vision (à date) :** j'ai envie de conserver un moteur en logiciel libre.
Je suis persuadé que ce projet peut permettre d'économiser un peu les ressources de la planète et contribuer à faire de l'IT PaaS-based un endroit écologiquement un peu meilleur.
Si plein d'équipes utilisent `paastis-engine` ce sera une belle victoire.

A côté de ça, je trouve légitime de pouvoir retirer de tout mon travail une rémunération pour toutes ces heures passées et toutes les compétences mobilisées (lesquelles sont le résultat d'années d'efforts et progression).

**Proposition de valeur :** tout repose sur 3 promesses fortes qui n'ont pas changé depuis le premier jour :

- économique
- écologique
- pratique

**Business model :** Je vois 3 axes pour la partie payante :

- proposer l'hébergement d'une (multitude d') instance(s) (?) pour simplifier encore plus la vie des équipes
- proposer une console d'admin Web (+ mobile apps) qui renforce la promesse "pratique"
- proposer du support et une priorité aux équipes qui payent

**Business plans :** (à tester / améliorer)

- free : 1 provider, 5 apps max en même temps
- team : 3 providers, 15 apps max en même temps pour chaque provider
- enterprise : 5 providers, 100 apps max en même temps pour chaque provider

> ❓Comment faire en sorte que le code de l'engine soit open source tout en protégeant mon activité ?

## Architecture SaaS

J'en viens à me questionner sur la partie SaaS.

Où et comment gérer le fait d'avoir plusieurs clients ?

Si on commence à gérer les _Espaces_ (1 espace = 1 config de provider pour 1 user) dans paastis-engine, ça va rendre le projet inutilisable pour les éventuels développeurs ou équipes initialement intéressées.

### MicroVMs & Firecracker

J'ai entendu parler (par Yves d'Empreinte Digitale) de [Firecracker](https://firecracker-microvm.github.io/), une techno OSS d'orchestration de _microVMs_.

> Firecracker is an open source virtualization technology that is purpose-built for creating and managing secure, multi-tenant container and function-based services.

Une piste peut être de générer et gérer plein de microVMs, 1 par Espace.

Avantages :

- ségrégation forte (_a priori_) des flux et données
-

Risques :

- le coût d'infra
- les compétences d'admin système spécialisé en VM (que je pense ne pas avoir aujourd'hui)
- le code de glue à inventer (vs. du CRUD en Node.js)

### TODO-list & feedbacks

J'ai eu une belle et longue discussion de conception / feedback avec J\*\*.
J'en retire un max d'idées et de choses, dont des demandes d'évolutions ou des bugs.
Il a accepté de déployer sur un vrai projet avec une demi-douzaine de review apps.

- [ ] Il faut que je blinde la doc (même s'il lui a suffi de lire le code)
  - je songeais déjà à mettre en place prochainement Docusaurus
  - il faut penser à la partie DNS, notamment côté PaaS
- [x] Le `README.md` contient (déjà) des infos erronées ou manquantes (du coup, il ne les contient pas)
  - il manque des variables d'environnement dont la partie Redis
- [x] Le client JS Scalingo ne tient pas compte du refresh token et donc au bout d'1 heure, l'application crashe
- [ ] L'application crashe trop souvent
  - quand le Redis n'est pas prêt
  - quand le token Scalingo a expiré
- [x] Il y a un `console.log` bien sale au startup avec les secrets 🤦‍♂️
- [ ] Il faudrait avoir une white list des applis à prendre en compte plutôt qu'un blacklist
  - [ ] il faudrait que ces listes acceptent les patterns
- [ ] Il faudrait avoir la liste des apps managées au startup
- [ ] Il faudrait proposer une CLI packagée dans npm pour simplifier l'exploitation en-dehors d'un hébergeur

Au-delà de toutes ces remarques (très justes) on a évoqué le fait que ce qui l'intéresserait plus, serait d'avoir un contrôle non pas au niveau du provider+zone (= "Région"), mais au niveau de chaque application.

Comme Træfik, il faudrait pouvoir dissocier la découvrabilité des apps du reste.
Chaque appli ayant été un jour managée pourrait être stockée en BDD.
Je sens que c'est une excellente direction à prendre, mais que ça représente un boulot monstrueux !

Autre point : le fait de permettre d'avoir un Registre in-memory ne permet pas d'exploiter tout le potentiel de Redis.
Et notamment, oblige à avoir une API système gérer par l'engine.
On pourrait imaginer que l'API système soit plus découplée et gérée à côté.

Il a été question aussi de proposer d'avoir / déclarer /rendre des apps multi-tenants.
L'idée est très intéressante.
Mais je pense qu'elle n'entre pas dans le cadre de ce projet.
En tout cas, pas pour le moment.
Peut-être si un jour je dois pivoter.

## Problème de refresh token avec Scalingo.js

C'est un vrai problème que le client ne rafraîchisse pas son bearer token automatiquement.

Il existe [une issue ouverte depuis 2020](https://github.com/Scalingo/scalingo.js/issues/115), restée lettre morte.

Je m'en suis sorti avec un trick un peu cra-cra :

```javascript
async function getClient() {
  if (!client) {
    client = await clientFromToken(config.provider.scalingo.apiToken, {
      apiUrl: "https://api.osc-fr1.scalingo.com",
    });
    tokenLastUpdate = new Date();
  } else {
    const now = new Date();
    if ((now - tokenLastUpdate) / 1000 > 3600 - 60) {
      // if current bearer token was generated 59mn ago or more…
      client._token = await client.Tokens.exchange(
        config.provider.scalingo.apiToken
      );
    }
  }
  return client;
}
```

Sale, mais efficace.
