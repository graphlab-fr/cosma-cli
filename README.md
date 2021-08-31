# Cosma [![DOI](https://zenodo.org/badge/308555323.svg)](https://zenodo.org/badge/latestdoi/308555323)

Cosma est un logiciel de visualisation de graphe documentaire. Il permet d’enregistrer et lire des fiches interreliées sous la forme d’un réseau interactif dans un navigateur web.

Ce dépôt contient la première version de Cosma, développée durant l'année 2020-2021. C'est un logiciel qui s'utilise en ligne de commande et requiert [NodeJS](https://nodejs.org/fr/) version 15 ou supérieure. Nous avons publié Cosma en mai 2021 et fait quelques mises à jour jusqu'en juillet. En août 2021, nous avons fait évoluer Cosma et développé une application à interface graphique. La première version a été rétroactivement qualifiée d'alpha. Elle n'est plus développée ni maintenue. Toutes les itérations de l'alpha sont archivées sur Zenodo.

Visitez [le site dédié à Cosma](https://cosma.graphlab.fr) pour plus d'informations.

## Présentation rapide

Cosma obéit à quatre grandes orientations :

1. Les normes d'écriture utilisées sont interopérables (Markdown, YAML, liens wiki). Elles mettent en œuvre des techniques documentaires robustes et extensibles (identifiants uniques, catégorisation des nœuds, qualification des liens, mots-clés).
2. Le degré de contrôle utilisateur est élevé. Cosma fonctionne avec tout logiciel d'écriture et s'appuie sur la gestion de fichiers native des systèmes d'exploitation. L'interface de visualisation est largement personnalisable (algorithme de dessin de réseau, couleurs des nœuds, tracé des liens, raccourcis).
3. Le développement est open source, documenté et repose sur des technologies interopérables. Le travail sur le code peut ainsi être évalué, archivé et continué par d'autres.
4. La visualisation produite avec Cosma est conçue pour être partagée et réutilisée : il s'agit d'une publication web autonome (fichier HTML unique) qui contient la représentation graphique, son interface et les données (JSON). Cette portabilité vise à accroître la visibilité et l'impact du travail à court, moyen et long terme.

Le format des données utilisées par Cosma le rend compatible de manière privilégiée avec certains logiciels comme [Zettlr](https://zettlr.com) et l'extension [Foam](https://foambubble.github.io/foam/) pour les éditeurs Visual Studio Code et VSCodium.
