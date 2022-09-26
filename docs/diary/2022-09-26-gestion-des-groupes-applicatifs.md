# 2022-09-26 - 🍱 Gestion des groupes applicatifs

## 🍣 Contexte / problème

En discutant de Paastis avec plusieurs personnes, il apparaît qu'une des fonctionnalités minimales requises est la possibilité de gérer des "groupes applicatifs".

Un groupe (applicatif) est un ensemble d'applications qui doivent être démarrées en même temps pour que la plateforme qu'elles constituent puissent fonctionner correctement.

Par exemple, de très nombreuses plateformes sont constituées d'une app front `my-app-front` et d'une app back `my-app-back` (souvent constitué elle-même d'une base de données).

Aujourd'hui, Paastis gère très bien le fait d'allumer une app à la demande.
Le problème survient quand un utilisateur tente d'accéder à une application dormante (i.e. `my-app-front`), qui dépend elle-même d'une (ou plusieurs) applications tierce(s) (i.e. `my-app-back`).
L'application front va bien se réveiller et tenter de servir une page / les ressources commandées par l'utilisateur.
Mais elle ne pourra accéder aux ressources de l'application back.
En effet, Paastis n'est qu'un _simple proxy_.
Une fois que la redirection a eu lieu, l'utilisateur se retrouve avec l'app finale, avec son URL upstream, qui pointe directement vers d'autre URLs upstream.

## 🐠 Réflexion / solution

C'est pour gérer ce type de cas que j'ai introduit la notion + fonctionnalité de "fichier de configuration (`paastis.yml`)" qui est un hersatz de définition de règles pour définir des applications en phase de découvrabilité (via le _scheduler_ pour les apps déjà connues et monitorées, ou lorsque l'utilisateur tente d'accéder à une app nouvelle ou dormante).

Je comptais gérer une propriété `group` pour chaque règle, ex : toutes les apps qui matchent le pattern `app-review-pr(\d+)-(.*)` font partir du groupe "`app-review-pr$1`".

Je me suis rendu compte au moment de l'implémentation qu'il y a un souci au moment où l'on se rend compte qu'une _non-running app_ (inconnue ou dormante, donc non-monitorée) appartient à un groupe :
autant je connais l'app et grâce à sa clé (`id` ou `name`) je peux solliciter le provider pour la réveiller ; 
autant avec ce système, je ne peux pas savoir quelles sont les autres applications à ajouter au _registry_ (des _running apps_).

**Solution 1 : bourriner l'API du provider**

Une première solution consiste à interroger à nouveau l'API du provider, pour lister à nouveau toutes les apps et filtrer les bonnes en fonction de la ou des règles qui matchent.

```yaml
rules:
  - pattern: 'pix-app-review-pr(\d+)-(back|front)'
    app_group: 'pix-app-review-pr$1'
    # ...
```

Je vois 2 risques :
- la complexité du code
- le fait de sur-solliciter le provider
  - c'est lent
  - y a un gros risque de défaillance réseau
  - y a un plus gros risque encore de se faire bannir par le provider
  - bref, ça ne passe pas à l'échelle

**Solution 2 : gérer des _linked_apps_ sur le modèle des `depends_on` de Docker**

Une seconde solution est de définir, dans les règles de découvrabilité, non plus un nom de groupe, mais directement les applications associées.

```yaml
rules:
  - pattern: 'pix-app-review-pr(\d+)-(back|front)'
    linked_apps:
    - 'pix-app-review-pr$1-front'  
    - 'pix-app-review-pr$1-back' 
    # ...
```

> 💡 Dans l'exemple ci-dessus, en vrai, dans la mesure où le back ne dépent pas du front, on pourrait simplifier le pattern (que "front") et n'associer qu'une seule linked app (que "back").
> Si on tente d'accéder au back, alors on le réveille ;
> Si on tente d'accéder au front, alors ça réveille aussi le back.

Je trouve cette solution un poil moins élégante.
Mais elle permet de connaître à tout moment la clé des apps à réveiller côté Provider.

