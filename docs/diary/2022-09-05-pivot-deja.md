# 2022-09-05 - Pivot (déjà ?!)

## 😭 Une concurrence déjà en place sur Heroku

Énorme douche froide après que @jonathanperret m'ait fait découvrir [AutoIdle](https://autoidle.com/).
Tout y est.
Toutes les fonctionnalités que j'avais en tête.
Jusqu'au compteur précis d'économie et au simulateur qui en découle.
En plus le site est beau et le tout a l'air bien ficelé.
Allez, à la rigueur, je dirais qu'il manque un peu d'emphase sur le côté GreenIT.
Ça reste un service 🇺🇸…

Le bon point, c'est que le service se concentre sur Heroku. 
C'est d'ailleurs un add-on Heroku.
Il y aurait donc de la place pour d'autres plateformes, dont render.com.

Mais le coup reste dur à encaisser.
Ça confirme au moins une intuition : il y a un véritable marché.
AutoIdle se targue d'avoir 300 clients.
Je pourrais me concentrer sur les PaaS 🇫🇷 / 🇪🇺.

Le temps de / pour retrouver mes esprits, je vais creuser la partie technique, notamment la gateway proxy http.  

## 🌱 Le projet est mort ; vive le projet !

Je me suis posé la question d'abandonner ce projet bête et méchant.
Finalement, je vais lui laisser une chance.
Je commence par le re-renommer Paastis.
Parce que c'est plus drôle.
Et que dans un premier temps, le temps d'explorer / valider des choix techs, je vais pivoter.

Je décide de ne plus faire une plateforme multi-paas mais un complément applicatif pour un compte Scalingo.
On passe donc de multi-provider + multi-accounts à mono-provider + mono-account.
Il faut parfois prendre du recul pour reprendre de l'élan et continuer d'avancer 💪.

> Finalité : pour les équipes de dev qui souhaitent que les apps inactives soient mises en pause, il leur suffit d'installer l'application.

## 🚀 Nouvelle Architecture

Je pense que je vais conserver SvelteKit.
Plus pour la curiosité et le plaisir qu'autre chose.

En revanche, on passe d'une mono-app SSR à une architecture à la Gravitee, avec une Gateway au cœur de l'archi.

Je décide de rester sur des technos JS.
Je n'ai pas envie de faire un add-on NGINX, Apache, HAProxy ou Træfik.
Je sens que ça va être chiant de coder, et pas simple.
Je sens que j'aurais beaucoup plus de plasir + efficacité + souplesse à développer une app dans un langage classique plutôt qu'une brique préconçue.

Je n'ai pas non plus envie de changer de langage, même si je pense qu'on pourrait très bien faire le taf avec du Go, Rust, Java ou même Python.

J'ai recherché et consulté plusieurs benchmarks.
Avec le bon niveau de réglage, on parvient assez rapidement à une solution quasi équivalente entre Node native, Express ou Fastify.
Je trouve un plugin qui a l'air très bien pour Fastify : @fastify/http-proxy.
Après analyse vite faite du code, le scope couvert semble assez large (dont les web sockets).
Je décide de partir dessus.

  –––––––––––––
  | Web front |
  –––––––––––––
       ↑
       |
  -–––––––––––
  | Database |
  ––––––––––––
       ↑
       |
 ––––––––––––––––
 | HTTP gateway |
 ––––––––––––––––
       ↑
       |
 ––––––––––––––––
 | HTTP traefik |
 ––––––––––––––––

