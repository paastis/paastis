# 2022-09-11.md - Clever Cloud 🤯

## Erreur incompréhensible de proxyfication

Voilà plusieurs que je me tape cette erreur au moment d'accéder à l'app via le proxy : 

```shell
/Users/jeremy.buget/Works/jbuget/paastis/paastis-proxy/node_modules/http-proxy/lib/http-proxy/index.js:120
    throw err;
    ^

Error: Parse Error: Missing expected CR after header value
    at TLSSocket.socketOnData (node:_http_client:521:22)
    at TLSSocket.emit (node:events:513:28)
    at addChunk (node:internal/streams/readable:315:12)
    at readableAddChunk (node:internal/streams/readable:289:9)
    at TLSSocket.Readable.push (node:internal/streams/readable:228:10)
    at TLSWrap.onStreamRead (node:internal/stream_base_commons:190:23) {
  bytesParsed: 47,
  code: 'HPE_CR_EXPECTED',
  reason: 'Missing expected CR after header value',
  rawPacket: Buffer(1541) [Uint8Array] [
     72,  84,  84,  80,  47,  49,  46,  49,  32,  52,  48,  52,
     32,  78, 111, 116,  32,  70, 111, 117, 110, 100,  10,  67,
     97,  99, 104, 101,  45,  67, 111, 110, 116, 114, 111, 108,
     58,  32, 110, 111,  45,  99,  97,  99, 104, 101,  10,  88,
     45,  67, 108, 101, 118, 101, 114,  67, 108, 111, 117, 100,
     85, 112, 103, 114,  97, 100, 101,  58,  32, 116, 114, 117,
    101,  10,  67, 111, 110, 110, 101,  99, 116, 105, 111, 110,
     58,  32,  99, 108, 111, 115, 101,  10,  67, 111, 110, 116,
    101, 110, 116,  45,
    ... 1441 more items
  ]
}

Process finished with exit code 1
```

J'ai tenté de suivre [des pistes](https://github.com/nodejs/node/issues/43798) en rapport avec [l'option `insecureHTTPParser`](https://nodejs.org/api/cli.html#--insecure-http-parser) du serveur Node.js.
Ça ne donne rien.

Et je viens seulement d'observer que :
- l'`appId` récupéré via le client CC est : `https://app_0210ab5c-6baf-477b-8c0f-32c18a0e7fb6.cleverapps.io/`
- l'`appId` indiqué dans la select box du header de l'IHM Web CC est : `https://app_0210ab5c-6baf-477b-8c0f-32c18a0e7fb6.cleverapps.io/`
- l'`appId` indiqué dans la section "domain names" de l'IHM Web CC est : `https://app-0210ab5c-6baf-477b-8c0f-32c18a0e7fb6.cleverapps.io/`

La différence, c'est ce put*** de `_` VS. `-` en début d'URL 🤬 !!!

La transformation ci-dessous fonctionne ! (quelle blague…)

```javascript
proxy.web(req, res, { target: `https://${appName.replace('app_', 'app-')}.cleverapps.io` })
```

Au passage, j'ai confirmé [en demandant sur Twitter](https://twitter.com/jbuget/status/1568723184337166339?s=20&t=2Mv4Jv7d-lfT0HEkniasgw) que Clever Cloud ne propose pas de Review Apps par défaut.
C'est étonnant autant que dommage.

On peut accoler des domaines à ses apps Scalingo.
Peut-être que c'est une meilleure solution.
Surtout que, comme il n'y a pas de mécanisme par défaut pour générer automatiquement des RA, on a complètement la main sur les apps qu'on doit créer soi-même 🙃.

## Business model

Du coup, je me dis qu'ajouter une fonctionnalité pour générer auto les RA pourrait être intéressante 🤔.

## Remaniement

Il faut monter d'un niveau le code des hooks pre/post-start/stop (a.k.a. "PPSS hooks").

J'ai dû introduire la notion de `PaasProvider.name` dans la classe abstraite, surchargé dans le constructeur de chaque classe fille, pour éviter de faire des `if` _intempestifs_ dans le code.

Argh ! Je vais de voir introduire la notion de PaasApp car chez Scalingo on utilise le `app.name`, alors que pour Clever Cloud, c'est plutôt le `app.id`.
