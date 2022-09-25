# 2022-09-10 - 🪪 Multi PaaS Provider

## Version Alpha

J'ai commencé à parler un peu du projet et solliciter quelques copains pour leur faire une démo et les inciter à tester dans leur infra. 

## Business model

`paastis-proxy` en open source pour toujours.

`paastis-console` closed source.

Pour les organisations qui ne veulent pas se prendre la tête :
- proposer une version SaaS :
  - free : 1 provider, 3 apps monitorées en même temps
  - team : 3 providers, 20 apps monitorées en même temps
  - entreprise : infinite providers, 100 apps monitorées en même temps
- avec `paastis-console`

Histoire d'être consistent avec la promesse "écolo", et pour ne pas subir une éventuelle panne d'un des providers, l'hébergement se ferait chez un host 100% écolo :
- [Digital Forest 🇫🇷](https://digitalforest.fr/hebergement-eco-responsable.php),
- [Infomaniak 🇨🇭](https://www.infomaniak.com/fr/hebergement/serveurs-dedies-et-cloud/serveur-cloud-manage),
- [Planet Hoster 🇨🇦](https://www.planethoster.com/fr/Hebergement-Vert)
- [ex2 🇨🇦](https://www.ex2.com/hosting/green-hosting?language=english)

Offre spéciale pour les entreprises green, SRE ou NPO.

## DNS

Vu que le projet semble bien lancé, j'ai acquis : 
- paastis.dev (main)
- paastis.tech
- paastis.fr

## Design

Création d'une arborescence objet :
- `PaasProvider`
- `ScalingoProvider`
- `CleverCloudProvider`

Comme pour les registres, le fichier `index.js` permet d'instancier le bon type de `PaasProvider`.

Autant c'était facile pour Scalingo car je maîtrise très bien la plateforme, avec déjà un compte crédité, des apps et de l'expérience.

Autant pour CleverCloud, il va me falloir creuser, comprendre la logique, les points communs et les différences.

## Support de région

Il vaut mieux fournir un Provider par région, pour éviter le mélange de genre.

Il y a un travail à faire incluant un peu de remaniement de code pour variabiliser la region, ex : plus besoin de `region` dans les méthodes.

## Clever Cloud

Les régions :
- infra:clever-cloud (Paris, France)
- infra:oracle (Jeddah, Saudi Arabia)
- infra:ovh (Monreal, Canada)
- infra:bso (New York, United States)
- infra:ovh (Roubaix, France)
- infra:ovh+certification:hds (Roubaix, France)
- infra:ovh (Singapore, Singapore)
- infra:ovh (Syndey, Australia)
- infra:ovh (Warsaw, Poland)

Je suis assez désemparé devant la difficulté de consommer une API de CleverCloud.
Tout est compliqué.
La doc est ultra sommaire. 
Quand on clique sur un endpoint en bas de menu, le scroll de la page ne remonte même pas automatiquement !
Ils proposent [un client JS](https://github.com/CleverCloud/clever-client.js), mais il est obscur.
Pourquoi ont-ils choisi `superagent` comme lib de requête par défaut ?!
Et pourquoi faut-il avoir conscience de toute la mécanique sous-jacente pour pouvoir consommer les services ?! 
Je ne peux m'empêcher de comparer avec la simplicité d'usage du client Scalingo.

Et pourquoi diable utilisent-ils OAuth 1 ?!
Apparemment, il faut installer une app "OAuth consumer token" pour se simplifier la vie. WTF ?!
Mais c'est payant ou pas ce truc ?

> Apparemment, quand je parviens à afficer la liste des apps, elle n'y figure pas, donc j'en déduis que non.

Dans la foulée, j'ai été obligé d'installer le programme [clever-tools](https://github.com/CleverCloud/clever-tools) pour me générer des credentials OAuth. WTF ?!

Dans l'ensemble, tout est plus compliqué et moins bien pensé / fini que Scalingo.

Ex, quand j'ai créé une app `hello-fastify`, la phase de création a tourné en boucle.
Il a fallu que je recharge la page pour savoir que l'app était prête.

Ex, quand on tente d'accéder à une app endormie, on a un _loader_ qui tourne disant que l'app est en cours de démarrage.
Dans la console, on voit bien que non.

Ex, par défaut, le forçage HTTPS n'est pas activé. 

On me demande 4 informations, quand avec Scalingo, une seule clé d'API suffit :
- OAUTH_CONSUMER_KEY
- OAUTH_CONSUMER_SECRET
- CLEVER_TOKEN
- CLEVER_SECRET

🤔 Là, j'ai comme un doute…
J'ai l'impression que les données remontées sont erronées / obsolètes / vieilles.
C'est quoi encore ce délire ?!

Ils n'ont pas de fonctionalité "Review Apps" par défaut ???
C'est pas possible.
Je dois mal chercher.

Le mieux et le plus simple pour s'en sortir, est de pomper directement le code depuis le [`clever-tools`](https://github.com/CleverCloud/clever-tools/tree/master/src/commands) (cf. `CleverCloudProvider#isAppRunning`)
