---
title: Manuel d’utilisation de Cosma
author:
  - Guillaume Brioudes <https://myllaume.fr/>
  - Arthur Perret <https://www.arthurperret.fr/>
date: 2021-05-26
lang: fr-FR
description: Aide à l’utilisation et à la configuration de Cosma
---

Cosma est un logiciel de visualisation de graphe documentaire. Il permet de représenter des notes interreliées sous la forme d’un réseau interactif dans une interface web. Le logiciel est conçu pour fonctionner avec des fichiers texte Markdown (`.md`) et s’adapte aussi bien à une petite collection (une centaine de documents) qu’à une vaste documentation (plusieurs milliers de documents). Il permet de produire différents types de répertoire : carnets de notes, Zettelkasten, wikis.

Cosma est développé dans le cadre du programme de recherche ANR [HyperOtlet].

Bienvenue sur le manuel d’utilisation de Cosma. C'est le guide complet pour exploiter tout le potentiel de l'interface de Cosma. Les personnes souhaitant modifier cette interface et le fonctionnement du logiciel seront également interessées par la [documentation de développement](./documentation-code.html).

::: sommaire
#. [Présentation](#presentation)
#. [Installation](#installation)
#. [Configuration](#configuration)
#. [Utilisation du cosmographe](#utilisation-du-cosmographe)
#. [Utilisation du cosmoscope](#utilisation-du-cosmoscope)
#. [Crédits](#credits)
:::

# Présentation

Le logiciel repose sur trois principes : l'interopérabilité, la portabilité et la modularité.

## Interopérabilité

Cosma fonctionne avec un répertoire de fichiers au format texte, rédigés en Markdown. Vous gardez le contrôle total de cet espace. Les logiciels s'envolent mais les données restent. Utiliser ou désinstaller Cosma n'altérera pas vos fichiers. Ils restent à la disposition de votre explorateur, d'autres outils de gestion de fichiers (synchronisation *cloud*, versionnement Git) et d'édition de texte.

Installez Cosma, indiquez-lui où sont vos fichiers et continuez à travailler avec votre éditeur de texte favori. Cosma ne prescrit pas de logiciel d'écriture, mais son fonctionnement repose sur l'adoption simultanée de plusieurs normes d'écriture qui visent à accroître l'interopérabilité et la pérennité des données :

- YAML pour la configuration du logiciel et les métadonnées des fichiers ;
- Markdown pour le contenu des fichiers ;
- une syntaxe de type wiki (doubles crochets `[[ ]]`) pour créer des liens internes ;
- des identifiants uniques qui servent de cibles aux liens internes.

Cet ensemble de normes correspond à l'intersection de plusieurs cultures textuelles : documentation, wikis, prise de notes avec la méthode Zettelkasten ou encore écriture académique avec Pandoc. Les environnements d'écriture qui partagent cette approche fonctionnent particulièrement bien en tandem avec Cosma.

Exemples :

- l'éditeur Markdown [Zettlr](https://zettlr.com) ;
- l'extension [Foam](https://foambubble.github.io/foam/) pour les éditeurs Visual Studio Code et VSCodium.

## Portabilité

Cosma se divise en deux parties :

- le **cosmographe**, une interface de fabrication ;
- le **cosmoscope**, une interface de visualisation embarqué.

Le **cosmographe** est un logiciel basé sur NodeJS qui inclut deux fonctionnalités principales. La première consiste à faciliter la création de documents aux normes de Cosma via un formulaire. La seconde consiste à lire un répertoire de documents, le modéliser sous la forme de données au format JSON, et générer un **cosmoscope** à partir de ces données et d'outils intégrés.

<!-- Capture d'écran -->

Le **cosmoscope** est un fichier HTML à ouvrir avec un navigateur web. Il contient une visualisation interactive (sous forme de graphe) du répertoire de documents analysé par le **cosmographe**. Il propose de nombreuses fonctionnalités autour de cette visualisation : index, moteur de recherche, filtres d'affichage, enregistrement de vues, paramétrage de l'algorithme de dessin, affichage des documents avec liste des liens et rétroliens, etc.

<!-- Capture d'écran -->

Ce fichier HTML se suffit à lui-même : il contient à la fois les données et les outils, sans dépendance à d'autres logiciels. Par conséquent, vous pouvez partager un cosmoscope aussi facilement que n'importe quelle pièce jointe, l'utiliser hors connexion ou encore le déposer sur un serveur web pour le rendre public. Cosma stocke une copie de chaque cosmoscope généré dans un répertoire sur votre machine pour dresser un historique de vos exports.

## Modularité

Le **cosmoscope** contient l'ensemble des données issues du processus de modélisation. Il s'agit de la liste des fichiers qu'il a analysé, mais aussi toutes les relations qu'il a pu analyser. Ces données sont à votre disposition pour que vous puissiez les réutiliser.

Séparer le traitement des données (cosmographe) de leur modélisation (cosmoscope) comme nous vous le proposons vous permet de créer votre propre visualisation à partir des données générées, mais aussi en modifiant le logiciel. Les code source a été intégré et [documenté](#) à cette fin.

# Vocabulaire

- "**fiche**" : rendu d'un fichier Markdown intégré à Cosma.
- "**étiquette**" : titre de la fiche placé sous le nœud correspondant.
- "**focus**" : limitation de la vue autour d'un nœud pour n'afficher que les  nœuds envrionnants, à [différentes échelles](#focus).
- "**vue**" : configuration d'affichage du graphe, en fonction des filtres et du focus.

# Installation

## Pré-requis

Installer [NodeJS](https://nodejs.org/fr/download/) version 12 ou supérieure.

Le cosmoscope ne peut être utilisé avec le navigateur web Internet Explorer. Vous pouvez utiliser les navigateurs web suivants, avec une version supérieure ou égale à celle qui est indiquée :

- Chrome (v.69)
- Edge (v.79)
- Firefox (v.62)
- Opera (v.56)
- Safari (v.12)

## Téléchargement

Télécharger le dépôt git de Cosma en saisissant les commandes ci-dessous dans un terminal, ou en cliquant sur le lien suivant : <https://github.com/hyperotlet/cosma/archive/master.zip>

```bash
git clone https://github.com/hyperotlet/cosma.git
cd cosma
```

## Mise en route

Installez les dépendances nécessaires au bon fonctionnement de l'application avec la commande suivante. Le gestionnaire de dépendances NPM est installé en même temps que NodeJs.

```bash
npm install --only=production
```

# Configuration

Le fichier de configuration est une liste de paramètres avec pour chacun une valeur ou une liste de sous-paramètres à renseigner. Le fichier tel qu'il est généré est un modèle des paramètres qui doivent obligatoirement être renseignées pour une configuration valide.

Exécutez la commande suivante pour créer le fichier de configuration (`config.yml`) s'il n'existe pas déjà. Vous pouvez aussi le supprimer et utiliser cette commande pour réinitialiser le fichier.

```bash
node app
```

Le fichier de configuration est au [format YAML](https://sweetohm.net/article/introduction-yaml.html). La hiérarchie des paramètres est mise en œuvre par l'indentation, c'est-à-dire la présence d'espaces en début de ligne. L'utilisation de tabulations dans l'indentation est interdite en YAML. Pour l'unité d'indentation, il est conseillé de choisir un multiple de 2 (2 ou 4) et de s'y tenir pour tout le fichier.

## Paramètres nécessaires

La configuration doit contenir les paramètres suivants.

### Import et export

`files_origin` Chemin du répertoire contenant les fichiers Mardown à scanner.
: Exemples : `./fiches/'`, `D:\repertoire\`
: Attention à terminer la chaîne par un slash ou un anti-slash.

`export_target` Chemin vers le répertoire d’export du cosmoscope.
: Exemple : `./'`, `D:\repertoire\`
: Attention à terminer la chaîne par un slash ou un anti-slash.

### Nœuds et liens

De ces paramètres dépendent l'affichage des nœuds et liens.

::: important
Par défaut, un type `undefined` est disposé pour proposer un affichage *par défaut* à vos entités. Il concerne tous les nœuds et liens dont le type n'est pas précisé ou bien ne correspondant à aucun type défini. Si vous retirez ces valeurs par défaut, les nœuds et liens concernés deviendront gris très clair.
:::

`record_types` Listes des types de fiches. Ils apparaissent dans la barre latérale de gauche.
: Ils colorent les nœuds dans le graphe et permettent de les filtrer.
: Vous devez impérativement renseigner le type `undefined`.
: Exemple

		record_types:
		  undefined: '#546de5'
		  très important: red
		  fiche de lecture: 'rgba(157, 62, 12, 0.7)'
		  concepts: 'hsl(14, 100%, 80%)'

`link_types` Listes des types de relations.
: Ils modifient l'apparence des liens dans le graphe.
: Vous devez impérativement renseigner le type `undefined`.
: La couleur est spécifiée grâce au paramètre `color` tandis que la forme de la ligne dépend du paramètre `stroke` : La ligne peut être simple (`simple`), constituée de tirets (`dash`), pointillés (`dotted`) ou bien doublés (`double`).
: Exemple

		link_types:
		  undefined:
		    stroke: simple
			  color: grey
		  s:
		    stroke: dash
			  color: 'rgba(157, 62, 12, 0.7)'

### Paramètres du graphe

Les paramètres suivants peuvent être modifiés

- depuis le fichier de configuration. Les options sont indentées sous le paramètre `graph_config` comme dans l'exemple ci-dessous.
- de manière éphémère, depuis le volet "Paramètres de graphe" du menu ; les paramètres inscrits dans la configuration les remplacent au rechagement de la page.

```yaml
graph_config:
  background_color: white
  highlight_color: red
  text_size: 7
  position:
    x: 0.5
    y: 0.5
  attraction:
    force: -150
    distance_max: 300
    verticale: 0.02
    verticale: 0
  arrows: false
```

Nous vous conseillions de faire vos tests directement dans l'interface de Cosma avant de reporter les valeurs dans le fichier de configuration.

`background_color` Couleur de fond du graphe.
: Exemple : `whitesmoke` ,`#ccc`, `rgb(57, 57, 57)`

`highlight_color` Couleur de surbrillance des éléments du graphe selectionnés.
: Exemple : `red` ,`#0642ff `, `rgb(207, 52, 118)`

`text_size` règle la taille des titres des nœuds
: Valeur en pixels uniquement

`position` Position horizontale (`x`) et verticale (`y`).

`attraction` Attraction des nœuds
: `force` : Puissance globale. Plus elle est faible, plus les liens entre les nœuds sont relâchés. Monter au delà de `-50` provoquera des collisions incessantes.
: `distance_max` : Distance maximum entre les nœuds en vue de contenir leur relâchement dans une zone.
: `verticale` : Compression de l'espace sur l'axe vertical.
: `horizontale` : Compression de l'espace sur l'axe horizontal.

`arrow` Affichage des flèches pour orienter le graphe.
: Valeur : `true` ou `false`

## Paramètres facultatifs

Vous pouvez ajouter au fichier de configuration les paramètres suivants :

`minify`
:   Désactivé par défaut. Permet de réduire le poids du fichier cosmoscope exporté.
:   Valeur : `true` ou `false`

`custom_css`
:   Désactivé par défaut. Permet d'importer les styles d'un fichier CSS personnalisé. Ce fichier `custom.css` doit être placé dans le répertoire `/template/`.
:   Valeur : `true` ou `false`

`history`
:   Désactivé par défaut. Permet d'interrompre l'enregistrement datée d'une copie du cosmoscope et de ses donnnées à chaque export.
:   Valeur : `true` ou `false`

`metas`
: Vide par défaut. Permet d'ajouter des métadonnées arbitraires dans l'entête du Cosmoscope.
: Exemple

		metas:
		  author: Niklas Luhmann
		  keywords:
		    - Zettelkasten
		    - graphe documentaire
		  description: Répertoire de fiches en ligne
		  url: https://domaine.fr/cosmoscope.html

`focus_max`
: Valeur maximale du focus.
: Valeur : de 0 à ∞

`views`
: Liste des vues apparaissant dans la section "Vues" du cosmoscope.
: La chaîne suivant le nom de la vue doit être générée par le cosmoscope (bouton "Sauvegarder la vue actuelle") pour indiquer les instrutions à reproduire (fitres actifs, focus, fiche à afficher).
: Exemple

		views:
		  les graphes: eyJyZWNvcmRJZCI6MjAyMTAyMjExNDQ0NTF9
		  sujet 2: eyJyZWNvcmRJZCI6MjAyMDA5MzAyMTQ0MDAsImlzb2xhdGVJZCI6IjIwMjAwOTMwMjE0NDAwLTEifQ%3D%3D

## Exemples de configuration

La configuration suivante permet de concentrer la visualisation sur le type des relations entre les nœuds. Les relations `undefined` sont poitillées tandis que les autres sont plus lisibles. Nous vous proposons ci-dessous un typologie de relations type **thesaurus** avec des relations spécifique (`s`), génériques (`g`) et associées (`a`).

```yaml
link_types:
  undefined:
    stroke: dotted
    color: grey
  s:
    stroke: dash
    color: 'rgba(157, 62, 12, 0.7)'
  g:
    stroke: double
    color: 'rgba(157, 62, 12, 0.7)'
  a:
    stroke: simple
    color: 'rgba(157, 62, 12, 0.7)'
```

## Commandes

Les commandes suivantes vous permettent de modifier rapidement la configuration.

Modifier le chemin vers les fichiers sources :

```bash
node app import <chemin>
```

Modifier le chemin d'export du cosmoscope :

```bash
node app export <chemin>
```

Ajouter des types valides :

```bash
node app atype <nom> <couleur>
```

Créer le fichier de style personnalisé `custom.css` au répertoire `/template/` :

```bash
node app css
```

Ajouter des vues :

```bash
node app aview <nom> <code>
```

# Utilisation du cosmographe

## Générer des fiches

Pour générer une nouvelle fiche vous pouvez entrer l'une des deux commandes suivantes. Vous pouvez également créer un fichier Markdown (`.md`) par d'autres moyens, tant que vous respecter le modèle de fichier présenté plus bas.

```bash
node app record
node app autorecord <titre> <type> <mots-clés>
```

- `<titre>` corredpond au titre de la fiche et au nom de fichier généré ;
- `<type>` doit correspondre à l’un des types définis dans la configuration ;
- `<mots-clés>` est une liste de mots-clés séparés par des virgules (sans espaces).

Ces commandes génèrent un fichier Markdown avec le contenu suivant.

### Entête

En entête, le *YAML Front Matter* (entre les deux séparations `---`) contient le titre (`title`) de la fiche, son identifiant unique (`id`), son type (`type`) et ses mots-clés (`tags`).

```
---
title: La transclusion
id: 20210427185546
type: Technique
tags:
  - documentarisation
  - programmation
---


```

Ces différents champs sont libres et respectent la [syntaxe du langage YAML](https://sweetohm.net/article/introduction-yaml.html). Vous pouvez y renseigner ce que vous voulez et même ajouter des champs qui ne sont pas de cette liste, tant que vous repectez la syntaxe du langage YAML. Par exemple un champ `description`. Les champs `type` et `tags` ne sont pas obligatoires.

L'**identifiant** doit une une série de chiffres unique par rapport à l'ensemble des fichiers Mardown du répertoire. Par défaut, Cosma génère des identifiants à 14 chiffres par horodatage (année, mois, jour, heure, minute et seconde concaténés) sur le modèle de certains logiciels de prise de notes type Zettelkasten comme [The Archive](https://zettelkasten.de/the-archive/) ou [Zettlr](https://www.zettlr.com). 

Une fiche ne peut être assignée qu'à un seul **type**. Si le champ `type` n'est pas spécifié ou bien que sa valeur ne correspond à l'un des type enregistré dans la configuration sous le paramètre `record_types`, le type de la fiche sera interprétée comme `undefined`. Il recevra alors les propriétés prévues dans la configuration pour le type `undefined`. 

Vous pouvez entrer autant de **mots-clés** que vous souhaitez. Vous devez respecter la syntaxe YAML et bien aligner vos tirets et entrées.

### Corps

Vous ne pouvez pas insérer d'images dans Cosma.

Après l'entête, vous pouvez librement inscrire votre contenu avec la [syntaxe Markdown](https://blog.wax-o.com/2014/04/tutoriel-un-guide-pour-bien-commencer-avec-markdown/). Elle vous permet de mettre en forme votre texte (gras, italique, barré), de disposer des blocs sémantiques (paragraphes, niveaux de titre, citation, code, tableau) et des liens.

Vous pouvez ajouter des attributs personnalisés (`.class`, `#id`, `data-`, `onclick` etc.) à vos blocs, entre accolades `{ }`. Avec le code ci-dessous, nous attribuons la classe `p_imp` à un paragraphe. Ainsi, vous pouvez styliser cet éléments avec le CSS personnalisé.

```
Lorem ipsum dolor sit amet, consectetur. { .p_imp }
```

## Inscrire des liens internes

Dans le corps de vos fiches, vous pouvez créer des liens internes à votre base documentaire avec l'identifiant de la fiche cible entre double crochets (ex : `[[20201209111625]]`). Vous pouvez également donner un type à ce lien selon la typologie dressée dans la configuration. Pour cela vous devez inscrire le nom du type comme prefixe à l'identifiant tel que `[[type:20201209111625]]`.

## Exporter un cosmoscope

Générer un cosmoscope avec l'une de ces commandes :

```bash
node app modelize
node app
```

Le fichier `cosmoscope.html` est exporté dans le répertoire défini dans la configuration. Il écrasera un fichier éponyme au même emplacement. Ce fichier est également copié dans le répertoire `/history`, dans un sous-répertoire portant la date du jour et avec les données modélisées au format JSON.

### Mise en ligne

Le fichier `cosmoscope.html` peut être lu avec un navigateur web depuis votre ordinateur. Il peut aussi être mis en ligne, déposé sur un serveur web, comme une page web. Vous pourrez alors partager vos fiches avec le monde entier.

Pour retrouver une fiche en particulier sur un cosmoscope en ligne, vous pouvez ajouter son identifiant précédé d'un croisillion `#` en fin d'adresse. L'adresse `https://domaine.fr/cosmoscope.html#20210427185546` permet d'accéder à la fiche identifiée `20210427185546`.

Pour confondre le fichier cosmoscope avec la racine de votre domaine ou d'un répertoire, renommez le fichier `cosmoscope.html` en `index.html`. Vous pourrez accéder à cette même fiche avec l'adresse `https://domaine.fr/#20210427185546` ou `https://domaine.fr/cosmoscope/#20210427185546` si le fichier `index.html` se trouve dans un répertoire `cosmoscope`.

## Historique d'export

Chaque fois que vous exportez un cosmoscope, il est sauvegardé dans un répertoire `/history` à la racine de l'arborescence de Cosma. Ce répertoire contient un sous-répertoire daté (à la minute près) pour chaque export effectué. Ils contiennent

- une copie du fichier `cosmoscope.html`
- un registre `error.log` des alertes (erreurs et points d'attention) enregistrées durant la prodécure
- un répertoire `data` contenant les fichiers
  - `links.json` : liste des liens et de leurs métadonnées
  - `nodes.json` : liste des nœuds et de leurs métadonnées

Vous pouvez réutiliser ces fichiers pour les intégrer à d'autres logiciels de visualisation. Vous pouvez aussi consulter vos fiches et l'état de votre réseau dans le temps.

Cette sauvegarde systématiue peut être interrompue via la configuration, avec le paramètre `history: false`.

# Utilisation du cosmoscope

## Interface du cosmoscope

L'interface de Cosma est composée en trois colonnes :

- **"*Menu*" latéral gauche** : il concentre tous les menus permettant d'agir sur l'affichage du graphe ou de retrouver une fiche de manière globale.
- **"*Graphe*"** : espace où s'étendent les nœuds, leur étiquette, leurs liaisons, et au sein duquel l'utilisateur peut zoomer, se déplacer latéralement.
- **"*Fiche*" latérale droite** : lecture des métadonnées, du contenu des fiches et de leur réseau direct.

![](https://i.imgur.com/FZiYK5Y.jpg)

<!-- Description générale, portabilité -->

L'affichage n'est pas adapté pour les petits écrans, comme pour les mobiles et petites tablettes. La manipulation au doigt ne vous permet pas de profiter de certaines interactions comme l'affichage du réseau au survol.

### Personnaliser l'interface

Vous pouvez via la commande suivante créer un fichier de style.

```bash
node app css
```

Il peut être désactivé dans la configuration sans que ayez besoin de le supprimer. Les règles que vous inscrirez dans ce fichier viendront s'ajouter ou remplacer les styles préscrites au cosmoscope, inscrites dans le fichier `/template/styles.css` et `/template/print.css` pour les styles à l'impression. Vous pouvez ainsi réécrire les variables pour modifier les couleurs, les typographies utilisées (elles doivent être installées sur votre ordinateur pour que vous puissiez les lire) et réécrire les règles attachées aux selecteurs.

Vous pouvez vous baser sur le fichier `/template/template.njk` ou l'inspecteur de votre navigateur web pour repérer les parties de l'interface que vous souhaitez modifier.

## Menu latéral gauche

### Moteur de recherche

C'est un champ de texte situé en haut du menu latéral gauche. Pour y faire une entrée, vous pouvez cliquer dessous ou bien taper la touche S.

Au fur et à mesure de votre saisie, le moteur de recjerche suggère une liste de fiches dont le titre proche de votre entrée. Cette liste est établie en fonction des filtres et du focus actifs : les fiches n'apparaissant pas dans le graphe ne sont pas indexées.

Cliquer sur une suggestion met en surbrillance le nœud et son réseau correspondant dans le graphe et ouvre la fiche correspondante. Vous pouvez également pendant votre saisie naviguer verticalement dans les résultats grâce aux flèches directionnelles de votre clavier. Un cadre vous indique la fiche pouvant être seléctionnée avec la touche Entrée.

### Filtres

C'est la liste des types de fiche, située en haut du menu latéral gauche. Pour qu'un filtre apparaisse dans le menu, il doit être enregistré dans votre configuration, mais aussi être le type désigné d'au moins une fiche. À la droite de chaque filtre, vous retrouvez le nombre de fiches qu'il affecte.

Cliquer sur un filtre permet de masquer ou de réafficher les fiches du type correspondant dans le graphe, l'index et les suggestions du moteur de recherche.

### Mots-clés

Cette liste dépend de tous les éléments que vous avez saisi dans les champs `tags` de vos fichiers. Elle est située dans le menu latéral gauche. Le nombre de fiches liées est affiché au droite du mot-clé. Séléctionner un mot-clé met en surbrillance dans le graphe l'étiquette de toutes les fiches liées. Les entrées de l'index sont également triées pour être limitées à cette liste de fichées liées. Vous pouvez activer simultanément plusieurs mots-clés. Pour désactiver un mot-clé, cliquez à nouveau sur le bouton pour que sa bordure noire disparaisse.

### Index

Il s'agit de la liste de toutes les fiches sous forme d'un menu déroulant. Il est située dans le menu latéral gauche. Un badge à droite indique le nombre de fiche actuellement affichées dans l'index. Un bouton vous permet de trier l'affichage dans l'ordre alphabétique (de manière croissante ou décroissante). Cliquer sur un titre sélectionne le nœud correspondant dans le graphe et ouvre la fiche correspondante.

L'index s'actualise avec l'affichage du graphe : les filtres, les mots-clés et le focus limitent le nombre d'entrées apparaissant dans l'index.

### Vues

À tout moment, l'état du graphe (fiche sélectionnée, filtres actifs, mode focus) peut être sauvegardé pour une restitution rapide et partageable. Cliquer sur le bouton « Sauvegarder la vue » insère un code dans le presse-papier de l'utilisateur. Ce code (en base 64) doit être ajouté à la suite d'un titre dédié dans le fichier de configuration, dans l'option `views`. Un bouton portant ce titre permet d'appliquer les paramètres activés à l'enregistrement et ainsi de retrouver les mêmes conditions de lecture. Pour désactiver une vue, cliquez à nouveau sur le bouton pour que sa bordure noire disparaisse.

Exemple :

```
views:
  Une vue intéressante: eyJwb3MiOnsieCI6MCwieSI6MCwiem9vbSI6MX19
```

### Paramètres du graphe

C'est la liste des différents outils de configuration visuelle du graphe. Il s'agit de définir différents paramètres dont les valeurs par défaut peuvent être modifiées dans le fichier de configuration (pour retrouver à chaque export la même configuration visuelle).

- l'affichage dans le graphe
  - des liens (avec une indication sur le nombre total des liens)
  - des étiquettes
- l'animation des nœuds au survol
- les différentes forces simulées par l'algorithme de dessin du graphe,
- la position du graphe dans l'espace de la page,
- la taille du titre des nœuds.

## Graphe

Le graphe est l'ensemble de nœuds interreliés. Les nœuds correspondent aux fiches et leurs liaisons aux liens qu'elles intègrent. En dessous de chaque nœud se trouve l'étiquette, le titre de la fiche à laquelle est lié le nœud.

Survoler un nœud le met temporairement en surbrillance, ainsi que ses connexions.

Cliquer sur un nœud le met en surbrillance, ainsi que ses connexions, et ouvre la fiche correspondante. Pour retirer la subrillance, il faut fermer la fiche, via le bouton « Fermer » en haut de la fiche.

Avec un clic maintenu sur un nœud, vous pouvez le déplacer et ainsi *tirer* l'ensemble de son réseau.

### Zoom et déplacement

Vous pouvez zoomer dans le graphe grâce à la molette de votre souris, en double cliquant sur le fond blanc ou bien avec le boutons dédiés, situés en bas à gauche du graphe. Au même endroit, le bouton *Recentrer* (raccourcis : touche R) vous permet de retrouver votre point de vue original.

<!-- À compléter. Zoom etc. -->

### Spacialisation des entités

La gestion des nœuds dans l'espace peut être paramétré dans le fichier de configuration, mais peut aussi être actualisé en direct avec les paramètres disponibles dans le menu "Paramètres du graphe".

Cliquer sur le *Temoin de spacialisation* ou sur le barre Esapce vous permet de relancer l'algorithme pour un réseau bien espacé.

### Focus

En dessous des commandes de zoom se trouve une case à cocher « Activer le focus ». Elle ne fonctionne que si vous avez une fiche ouverte. Le réseau éloigné du nœud lié à cette fiche va alors disparaître pour ne laisser voir que ses connexions immédiates (liens et rétroliens). Vous pouvez avec la manette étendre cette zone d'affichage (focus) aux connexions situées à plusieurs liens de distance jusqu'au maximum permis par le paramètre `focus_max` du fichier de configuration.

## Lecture des fiches

Les fiches sont présentées dans un volet latéral qui permet de consulter leur contenu et leur réseau.

Vous pouvez ouvrir une fiche en cliquant sur le nœud dédié, l'entrée de l'index ou bien via un lien interne. Ouvrir la fiche

- affiche son contenu dans le volet,
- enregistrer son identifiant dans l'adresse de la page (permettant de la retrouver dans l'historique du navigateur, de partager l'adresse en ligne ou encore de la mettre de côté en dupliquant l'onglet).

Cliquer sur le bouton « Fermer » referme le volet et désélectionne le nœud correspondant dans le graphe, sans changer l'adresse de la page.

### Liens

Les liens que vous avez intégré à votre fichier texte apparaissent bleus, entre les mêmes crochets et soulignés. Vous pouvez ouvrir ces liens dans un nouvel onglet via un clic droit. Si vous survolez un lien quelques secondes, vous pouvez lire le titre de la fiche vers laquelle il pointe.

Au bas de la fiche se trouve une liste des fiches vers lesquelles elle renvoie (liens sortants, d'après les liens bleu inscrits au-dessus) et des fiches qui pointent vers elle (liens entrants ou rétroliens). Survoler ces liens vous permet de lire le paragraphe où ils sont intégrés depuis leur fiche respective.

# Crédits

## Équipe

- [Arthur Perret](https://www.arthurperret.fr/) (chef de projet)
- [Guillaume Brioudes](https://myllaume.fr/) (développeur)
- [Olivier Le Deuff](http://www.guidedesegares.info/) (chercheur)
- [Clément Borel](https://mica.u-bordeaux-montaigne.fr/borel-clement/) (chercheur)

## Bibliothèques utilisées

Pour améliorer la maintenabilité et la lisibilité du code source, l’équipe de développement a recouru aux bibliothèques suivantes.

- [D3](https://d3js.org/) v4.13.0 (BSD 3-Clause) : Génération du graphe
- [Nunjucks](https://mozilla.github.io/nunjucks/) v3.2.3 (BSD 2-Clause) : Génération du template du Cosmoscope
- [Js-yaml](https://github.com/nodeca/js-yaml) v3.14.0 (MIT License) : Lecture du fichier de configuration et écriture des YAML Front Matter
- [Js-yaml-front-matter](https://github.com/dworthen/js-yaml-front-matter) v4.1.0 (MIT License) : Lecture des YAML Front Matter des fichiers Markdown
- [Markdown-it](https://github.com/markdown-it/markdown-it) v12.0.2 (MIT License) : Conversion Markdown → HTML
- [Markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs) v4.0.0  (MIT License) : Traitement des hyperliens Markdown au sein des fiches
- [Minify-html](https://github.com/wilsonzlin/minify-html) v0.4.3 (MIT License) : Allègement du Cosmoscope
- [Fuse-js](https://fusejs.io/) v6.4.6 (Apache License 2.0) : Moteur de recherche
- [Moment](https://momentjs.com/) v2.29.1 (MIT License) : Gestion de l'horodatage

## Historique du projet

Août 2020
: Expérimentation du "Lexicographe" dans l'interface de l'[Otletosphère](https://github.com/hyperotlet/otletosphere) avec les données d'un premier scanner de fichiers Mardown.

Décembre 2020
: Début du développement de Cosma avec un nouveau cahier des charges.

Avril 2021
: Finalisation de la première version de Cosma.

[HyperOtlet]: https://hyperotlet.hypotheses.org/