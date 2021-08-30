# Cosma [![DOI](https://zenodo.org/badge/308555323.svg)](https://zenodo.org/badge/latestdoi/308555323)

Cosma est un logiciel de visualisation de graphe documentaire. Il permet d’enregistrer et lire des fiches interreliées sous la forme d’un réseau interactif dans un navigateur web.

Ce dépôt contient la première version de Cosma, exécutable en ligne de commande. Elle n'est plus développée ni maintenue. La documentation reste disponible : https://hyperotlet.github.io/cosma/

## Présentation rapide

Cosma obéit à quatre grandes orientations :

1. Les normes d'écriture utilisées sont interopérables (Markdown, YAML, liens wiki). Elles mettent en œuvre des techniques documentaires robustes et extensibles (identifiants uniques, catégorisation des nœuds, qualification des liens, mots-clés).
2. Le degré de contrôle utilisateur est élevé. Cosma fonctionne avec tout logiciel d'écriture et s'appuie sur la gestion de fichiers native des systèmes d'exploitation. L'interface de visualisation est largement personnalisable (algorithme de dessin de réseau, couleurs des nœuds, tracé des liens, raccourcis).
3. Le développement est open source, documenté et repose sur des technologies interopérables. Le travail sur le code peut ainsi être évalué, archivé et continué par d'autres.
4. La visualisation produite avec Cosma est conçue pour être partagée et réutilisée : il s'agit d'une publication web autonome (fichier HTML unique) qui contient la représentation graphique, son interface et les données (JSON). Cette portabilité vise à accroître la visibilité et l'impact du travail à court, moyen et long terme.
Il permet de produire différents types de documents : carnets de notes, Zettelkasten, wikis.

Le format des données utilisées par Cosma le rend compatible de manière privilégiée avec certains logiciels comme [Zettlr](https://zettlr.com) et l'extension [Foam](https://foambubble.github.io/foam/) pour les éditeurs Visual Studio Code et VSCodium.

Cosma est basé sur [NodeJS](https://nodejs.org/fr/) (version 15 ou supérieure). La configuration se fait via un fichier YAML. L'utilisation se fait en ligne de commande. Une interface graphique sera développée prochainement pour Windows. Un prototype d'interface graphique est [disponible pour macOS](https://github.com/hyperotlet/cosma-macos) ; c'est une preuve de concept qui nécessite d'être modifiée avec Xcode pour être adaptée à l'installation de chaque utilisateur.
