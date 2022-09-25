# 2022-09-06 - Réflexions techniques

## Gateway vs. proxy vs. tunnel

@VincentHardouin m'a remonté qu'il n'aime pas le terme "gateway" pour désigner la brique qui va faire passe-plat de requêtes HTTP.

Je m'étais déjà posé la question avant de lui lâcher le terme.

J'ai creusé plusieurs pistes / articles :
- [Serveur Fault](https://serverfault.com/questions/994319/what-is-the-difference-between-a-proxy-server-and-a-gateway-server)
- [Stack Overflow](https://stackoverflow.com/a/34284700/2120773)
- [Akana](https://www.akana.com/blog/api-proxy-vs-api-gateway)

Je n'arrive pas à trouver de réponse claire, satisfaisante et définitive.
Faute de mieux, je reste sur "gateway".

## Architecture technique

### DNS

Il faut que `app-1.gateway.example.com`, `app-2.gateway.example.com` et `app-n.gateway.example.com` redirige respectivement vers `app-1.scalingo.com`, `app-2.scalingo.com` et `app-n.scalingo.com`.

Mon idée est de définir 2 entrées `CNAME` : 

```shell
# Zone DNS pour example.com
gateway 10800 IN CNAME paastis-gateway.osc-fr1.scalingo.io.
*.gateway 10800 IN CNAME gateway.example.com.
```

Il faut que le FQDN de l'app "paastis-gateway" soit associé côté Scalingo au DNS `gateway.example.com`.

Si tout se passe comme je le pense / l'espère, ça devrait fonctionner 🤞. 

### Intéragir avec Scalingo

Par souci de simplicité, je décide de passer par leur client JavaScript.

Scalingo l'a mis à jour il n'y a pas si longtemps.

Le défaut est qu'il ne gère pas le multi-régions.
Je suis donc obligé de générer 2 clients.
J'en fais des singletons.

> ⚠️ Il faudra gérer le cas du refresh de token.

Ça semble plutôt bien fonctionner.
Je craignais de me faire ban ou rate limit.
Pour le moment, avec une vingtaine d'apps et malgré de nombreux refresh de page, ça passe 👍.

### Registre des apps

La solution qui me paraît la plus simple (et performante ?) est de conserver à tout moment un "registre des applications actives". 

Pour être en capacité d'avoir une gateway multi-instances, je décide de conserver le registre dans un Redis.

| App name | Last request datetime |
|----------|-----------------------|
| app-1    | 2022-09-06_17:39:09   |
| app-2    | 2022-09-06_17:17:54   |
| app-n    | 2022-09-06_17:23:31   |

Lorsqu'on reçoit une requête, on regarde si l'app est dans le registre.

Si "non", alors on réveille l'app sur Scalingo et on ajoute une entrée dans Redis.

> Je ne suis pas certain qu'il soit nécessaire de stocker la date de dernière requête.
> Je pense qu'il est possible de définir la durée de vie de rétention de l'entrée Redis au moment de l'ajout.
> En réfléchissant mieux, si je suis obligé.
> Il ne faudrait pas que Redis vire l'entrée et que je perde l'info sans avoir pu éteindre l'app Scalingo.

Pour le multi-instances, on peut peut-être ajouter une entrée particulère `last_check` pour que seule la première instance qui fait le check lance l'auto)pause des apps.

Avec ce genre de mécanisme, si une application est ajoutée, le premier qui tente d'y accéder ajoutera l'entrée.

### Réveil d'une app

Il faut prévoir un mécanisme qui vérifie toutes les 6 secondes (pour faire 6 * 10 = 60s) qu'une app est correctement restartée. 

### Cron

Plusieurs pistes possibles : 
- node-cron
- pgboss
- BullMQ

Je pense - et @VincentHardouin est aligné - que dans un premier temps, on peut se contenter d'un simple `node-cron`.

## Implémentation

J'ai créé une app [hello-fastify](https://github.com/jbuget/hello-fastify) pour tester la gateway.

Micro pétouille avec le multi-région Scalingo.
Quant on index un proxy Fastify pour une app, il faut penser à tenir compte de la région pour l'upstream.

Je suis embêté à cause de la double-régions, qu'il faut aussi gérer côté DNS. 

J'ai oublié de mettre un pre-handler qui récupère le sous-domaine et redirige avec préfixe.

Utilisation de [tldts](https://github.com/remusao/tldts) pour extraire le subdomain d'un hostname.

J'ai galéré toute la soirée pour tenter de faire une vieille réécriture d'URL.
Ça ne sent vraiment pas bon.
J'ai l'impression de faire n'importe quoi.
Je trouve très peu de ressources à la recherche "fastify change request url on the fly".
C'est le signe qu'il y a un truc louche.

C'est alors que je tombe sur cette page de documentation de Fastify : "[Recommendations](https://www.fastify.io/docs/latest/Guides/Recommendations/)".

> With Node.js, one can write an application that directly handles HTTP requests. As a result, the temptation is to write applications that handle requests for multiple domains, listen on multiple ports (i.e. HTTP and HTTPS), and then expose these applications directly to the Internet to handle requests.
> The Fastify team strongly considers this to be an anti-pattern and extremely bad practice:
> 
> It adds unnecessary complexity to the application by diluting its focus.
> It prevents horizontal scalability.

Bien que je sente que je suis vraiment au bout du bout d'avoir un résultat, je reconsidère mon choix technique.
Je me demande si la bonne solution ne serait pas de mettre un Nginx en frontal qui se charge de la réécriture (inversion sous-domaine → request URL prefix).
Je ne suis pas très bon en Nginx, mais ça devrait le faire.

Le truc qui m'embête, c'est d'ajouter un élément à la chaîne.
En cas de pic de trafic, le risque est de devoir l'inclure dans l'équation.
En même temps, si le Nginx est embarqué avec la gateway, le scaling horizontal (multiplication des isntances d'apps) sera fait en amont.
Donc ça passe.
Testons.

La première chose à faire est de reconfigurer le projet Scalingo pour qu'il comprenne qu'on a :
- un Nginx
- une app Node.js

Penser à ajouter un Procfile, vu qu'on est sur un Multi Buildpacks.

Rahhh… quel idiot ! 
J'avais oublié qu'il faut déclarer le buildpack Node avant celui de Nginx, pour que ce dernier écoute bien le port de Scalingo.

```bash
web: exec node index & bin/run
```

Ça fonctionne !

Les trucs moyens :
- Il me manque juste la gestion des certificats SSL.
- Je suis passé par `servers.conf.erb` plutôt que `nginx.conf` ou `nginx.conf.erb`, alors que la doc de Scalingo indique que c'est plutôt le fichier optionnel du lot
- J'ai dû mettre en dur "gateway" dans ma config Nginx, ce qui couple fortement ma config DNS avec le code de l'app

> 💡 Truc intéressant/notable :
> Quand l'application paastis-gateway boote, elle ne remonte pas dans les app au statut running, donc elle n'est pas ajoutée au registre.
> Sinon, il faudrait ajouter un test dans le code.  
