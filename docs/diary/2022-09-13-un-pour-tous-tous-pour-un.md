# 2022-09-13 - Un pour tous, tout pour un !

## PaasProvider

Le code pour gérer les hooks before/after-start/stop est le même quel que soit le fournisseur de PaaS.

J'ai ainsi pu mutualiser le code dans la classe `PaasProvider`.

Désormais, il devient très simple et rapide d'ajouter des providers 🙌

> TODO: penser à variabiliser le délai d'attente de démarrage / fermeture d'une app aussi pour Clever Cloud
