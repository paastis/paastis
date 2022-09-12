# 2022-09-04 - Hello world!

## Proposition de valeur

- Pratique → centraliser la gestion de ses différents comptes et providers dans une même interface
- Economique → réduire sa facture (d'environnements dev) jusqu'à 40% 
- Ecologique → réduire sa consommation de ressources numériques jusqu'à 80%

## Fonctionnalités

2 modes d'économie :
- nightly pause : toutes les nuits, les applications sont arrêtées et redémarrées le matin
- inactivity pause : si l'application n'est pas accédée pendant X temps, alors l'application est arrêtée 

Centralisation des comptes & plateformes
- Scalingo
- Heroku
- CleverCloud
- Render
- Platform.sh

## Risques et difficultés

### Gateway
Pour le mode "inactivity pause", il faut prévoir une gateway par laquelle passe tout le trafic.
Il faut que l'utilisateur accepte de voir son trafic passer par un système tiers.
Si celui-ci respecte une ségrégation nette entre compte de dev (review apps, POC, etc.) et compte de prod, alors le trafic n'est (en principe) pas critique ni dangereux.
Sinon, c'est beaucoup plus sensible et il est déconseillé d'utiliser le service. 

Côté sécurité toujours, les utilisateurs ne voudront pas que le trafic soit partagé entre clients (potentiellement concurrents).
Dans l'idéal, il faudrait pouvoir avoir des gateways dédiées (moyennant $$$).

Dans le cas où des utilisateurs accepte de passer par Multipass et de faire transiter leur trafic, il faut quand même leur proposer de quoi paramétrer ou écrire eux-mêmes leur config.

En termes d'implémentation, est-ce qu'il vaut mieux une/des instance(s) de proxy sur étagère (Nginx, HAProxy, Træfik) ou bien une implémentation maison ?  

### API

Le mode "nightly pause" repose sur la consommation d'API des providers.
Passé une certaine quantité de clients, le rate limiting des API va être un souci.
Il faudrait se mettre en partenariat avec les providers.
Mais la conséquence directe de la promesse de paastis est de réduire leurs gains.

D'un point de vue implem, il faudrait mettre en place un mécanisme un peu générique.

Je crois savoir aussi que côté Scalingo, au-delà de 50 apps, les API de stop/start tapent des limites (rate limit again ?) 
