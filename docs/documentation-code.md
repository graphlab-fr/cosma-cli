---
title: Documentation de code de Cosma
author:
  - Guillaume Brioudes <https://myllaume.fr/>
  - Arthur Perret <https://www.arthurperret.fr/>
date: 2021-05-03
lang: fr-FR
description: Documentation du code de Cosma pour faciliter sa réutilisation
---

Nous vous recommandons vivement de lire le manuel d'utilisation pour bien saisir l'ensemble des usages en jeu dans le code source qui va vous être présenté ci-dessous.

Cette documentation s'adresse à des développeurs expérimentés en JavaScript. Elle vous présente l'arborescence et les concepts surlesquels reposent les *deux parties* formant Cosma, le cosmographe et le cosmoscope.

# Architecture de Cosma

Cosma est principalement implémenté en JavaScript. Le logiciel repose sur deux systèmes distincts :

- Le **cosmographe** : il repose sur l'environnement NodeJs. Une série de scripts permettent de
    - vérifier et actualiser le fichier de configuration
    - générer des fichiers Markdown et leur entête
    - scanner un répertoire pour en extraire les fichiers Markdown et analyser leur contenu (Markdown, métadonnées YAML et liens *wiki*) pour générer
        - des fichiers JSON
        - le cosmoscope (ses données et variables CSS)
- Le **cosmoscope** : il s'agit d'un fichier `.html` exécuté sur navigateurs web qu'un template [Nunjucks](https://mozilla.github.io/nunjucks/) (`template.njk`) permet de générer. Il intègre
    - les métadonnées web et styles issues de la configuration
    - les scripts et bibliothèques JavaScript
    - des index (mots-clés, titre de fiche, vues)
    - les fiches

Les pages présentées ci-dessous vous présentent la liste exhaustive des fonctions au sein du code source de Cosma. Vous pouvez à votre tour les modifier, les appeller.

- [API du Cosmographe](./api/cosmographe/index.html)
- [API du Cosmoscope](./api/cosmoscope/index.html)

## Arborescence

Vous trouverez ci-dessous une description complète de l'arborescence du logiciel. Vous pourrez ainsi distinguer les fichiers concernant le cosmographe et ceux du cosmoscope.

```
.
├── docs/                   | répertoire de la documentation
│   ├── api/                | répertoire des index des API
│   │   └── [x].md          | introduction à l'index [x] de l'API
│   └── api-config-[x].json | config. de l'index [x] de l'API
├── functions/              | fonctions du COSMOGRAPHE
│   ├── autorecord.js       | création de fichiers Markdown formatés
│   ├── history.js          | création répertoires de l'historique des exports
│   ├── links.js            | analyse des liens wiki et de leurs attributs
│   ├── log.js              | affichage des alertes et création des registres
│   ├── modelize.js         | analyse des fichiers Markdown et création modèle de données
│   ├── record.js           | formulaire du terminal pour création des fichiers Md
│   ├── template.js         | intégration données, style et corps du COSMOSCOPE
│   └── verifconfig.js      | validation et modification de la configuration
├── template/               | 
│   ├── libs                | bibliothèques JavaScript
│   ├── scripts/            | fonctions du COSMOSCOPE
│   │   ├── filter.js       | appliquer filtres et focus
│   │   ├── graph.js        | génération du graphe selon données et configuration
│   │   ├── index.js        | contrôle des volets et boutons du menu gauche
│   │   ├── main.js         | historique de navigation et les variables globales
│   │   ├── nodes.js        | affichage et subrillance des nœuds
│   │   ├── record.js       | ouvrir/fermer le volet latéral droit
│   │   ├── search.js       | paramétrage moteur de recherche
│   │   ├── view.js         | enregistrer et appliquer une vue
│   │   └── zoom.js         | paramétrer les déplacement (latéral, zoom) au sein du graphe
│   ├── cosmalogo.svg       | logo du logiciel
│   ├── template.njk        | structure du COSMOSCOPE
│   └── styles.css          | styles du COSMOSCOPE
├── app.js                  | adressage des commandes au terminal
└── package.json            | liste des dépendances NodeJs
```

# Le cosmoscope

## Génération des données

Il est généré en trois temps, par trois fonctions implémentées dans le fichier `/functions/template.js`. Elles sont appelées au sein du fichier `/functions/modelize.js` d'où proviennent les intrants (données passées en paramètre).

1. La fonction [`jsonData()`](https://hyperotlet.github.io/cosma/api/cosmographe/global.html#jsonData) pour créer le fichier `/template/graph-data.js` contenant les données de modélisation du graphe, sa configuration et l'index des fiches.
2. La fonction [`colors`](https://hyperotlet.github.io/cosma/api/cosmographe/global.html#colors) pour créer le fichier `/template/colors.css` contenant les [variables CSS](https://developer.mozilla.org/fr/docs/Web/CSS/Using_CSS_custom_properties) et les règles associées selon la configuration des couleurs préscrite dans le fichier `config.yml` extraites.
3. La fonction [`cosmoscope`](https://hyperotlet.github.io/cosma/api/cosmographe/global.html#cosmoscope) s'appuyant sur le fichier de construction `/template/template.njk` pour intégrer l'ensemble des données des deux premiers fichiers créés (il inclut `colors.css` et `graph-data.js`)  ainsi que des fichiers analysés.

Les données intégrées avec le fichier `graph-data.js` sont déterminantes pour l'ensemble des opérations du cosmoscope. Elles permettent d'abord de générer le graphe en étant affectées dans le fichier `/template/scripts/graph.js`. Elles permettent ensuite de coordonner les filtres et focus sur les nœuds.