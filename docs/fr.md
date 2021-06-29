---
title: Documentation de Cosma
author:
  - Guillaume Brioudes <https://myllaume.fr/>
  - Arthur Perret <https://www.arthurperret.fr/>
date: 2021-05-26
lang: fr-FR
---

Cosma est un logiciel de visualisation de graphe documentaire. Il permet de représenter des notes interreliées sous la forme d’un réseau interactif dans une interface web. Le logiciel est conçu pour fonctionner avec des fichiers texte en Markdown et s’adapte aussi bien à une petite collection (centaine de documents) qu’à une vaste documentation (jusqu'à plusieurs milliers de documents).

Cosma est développé dans le cadre du programme de recherche ANR [HyperOtlet](https://hyperotlet.hypotheses.org/).

::: sommaire
#. [Présentation](#presentation)
#. [Installation](#installation)
#. [Configuration](#configuration)
#. [Utilisation du cosmographe](#utilisation-du-cosmographe)
#. [Utilisation du cosmoscope](#utilisation-du-cosmoscope)
#. [Développement](#developpement)
#. [Crédits](#credits)
:::

# Présentation

Cosma est un logiciel de visualisation de graphe documentaire. Il permet de représenter des notes interreliées sous la forme d’un réseau interactif dans une interface web. Cosma n'est pas lui-même un logiciel de prise de notes : il est pensé pour fonctionner en complémentarité avec ces logiciels et nécessite que les notes soient structurées suivant un format bien précis.

La plupart des outils de visualisation concentrent leurs fonctionnalités dans une application à interface graphique, à partir de laquelle il est possible d'exporter des données structurées ou des images statiques. Cosma inverse cette logique : la partie application, surnommée **cosmographe**, est un simple formulaire de création, et c'est l'export, un fichier HTML surnommé **cosmoscope**, qui constitue la véritable interface de visualisation. Ce fichier autonome contient un graphe interactif, des outils de navigation interne (index, moteur de recherche, filtres) et le texte intégral des fiches ; il inclut aussi les données sources au format JSON et peut être utilisé hors connexion.

Cosma est conçu pour laisser un degré élevé de contrôle à ses utilisateurs.

Premièrement, le logiciel fonctionne avec un répertoire de fichiers au format texte qu'il se contente de lire : utiliser ou désinstaller le logiciel n'altérera pas vos fichiers et vous permet donc de mettre en œuvre les pratiques de stockage, de versionnement et d'édition de votre choix. De cette manière, si le logiciel s'envole les données restent.

Deuxièmement, de nombreux éléments d'interface sont personnalisables : algorithme de dessin de réseau, couleurs des nœuds, tracé des liens, raccourcis vers des vues particulières, etc.

Troisièmement, des enrichissements documentaires (métadonnées) et sémantiques (qualification des liens) sont possibles et se font par des mécanismes génériques : l'utilisateur est libre d'appliquer les typologies et ontologies de son choix.

Et quatrièmement, Cosma est un logiciel qui se veut modulaire, interopérable et portable mais surtout libre : le code est public, son développement est documenté, il est accessible et réutilisable gratuitement sous licence MIT. Le travail peut ainsi être évalué, archivé et continué par d'autres.

# Installation

## Pré-requis

Installez [Node.js](https://nodejs.org/fr/download/) version 12 ou supérieure.

Utiliser le cosmoscope nécessite un navigateur web. Vous pouvez utiliser les navigateurs suivants, dans la version indiquée ou supérieure :

- Chrome (v.69)
- Edge (v.79)
- Firefox (v.62)
- Opera (v.56)
- Safari (v.12)

Le cosmoscope n'est pas compatible avec Internet Explorer.

## Téléchargement

Téléchargez le dépôt git de Cosma en saisissant les commandes ci-dessous dans un terminal, ou en cliquant sur le lien suivant : <https://github.com/hyperotlet/cosma/archive/master.zip>

```
git clone https://github.com/hyperotlet/cosma.git
```

## Installation des dépendances

Le fonctionnement de Cosma repose sur d'autres programmes qualifiés de dépendances. Cosma utilise le gestionnaire de dépendances NPM qui est installé en même temps que Node.js. Installez les dépendances nécessaires au bon fonctionnement de l'application avec la commande ci-dessous :

```
npm install --only=production
```

# Configuration

Cosma utilise un fichier de configuration au format [YAML](http://yaml.org). C'est une liste hiérarchisée de paramètres dont les valeurs modifient le comportement du logiciel.

::: astuce
Pour une introduction à YAML, [cliquez ici](https://sweetohm.net/article/introduction-yaml.html). Dans le contexte de Cosma, il est notamment important de savoir qu'en YAML la hiérarchie des paramètres est mise en œuvre par l'indentation, c'est-à-dire la présence d'espaces en début de ligne, et que l'utilisation de tabulations pour indenter les lignes est interdite en YAML. Il est recommandé de choisir une unité d'indentation correspondant à un multiple de 2 espaces (2 ou 4) et de s'y tenir pour tout le fichier.
:::

Exécutez la commande suivante pour créer le fichier de configuration (`config.yml`) s'il n'existe pas déjà. Vous pouvez aussi le supprimer et utiliser cette commande pour réinitialiser le fichier. Le fichier généré par cette commande est un modèle des paramètres qui doivent obligatoirement être renseignés pour une configuration valide.

```
node app config
node app c
```

## Paramètres nécessaires

La configuration doit contenir les paramètres suivants.

`files_origin`
: Chemin du répertoire contenant les fichiers Markdown à lire.
: Exemple : `/Users/user/Fiches/'`, `D:\repertoire\`

`export_target`
: Chemin du répertoire où exporter le cosmoscope.
: Exemple : `./'`, `D:\repertoire\`

::: important
Les chemins `files_origin` et `export_target` doivent obligatoirement se terminer par une barre oblique.
:::

`record_types`
: Liste des types de fiches. Chaque type est défini par une paire `nom: valeur` dans laquelle `nom` correspond au nom du type et `valeur` correspond à une couleur de votre choix. Les couleurs sont déclarées [comme en HTML](https://www.w3schools.com/html/html_colors.asp) avec leur nom prédéfini ou bien une valeur RGB, HEX, HSL, RGBA ou HSLA entre guillemets.

Exemple :

```yaml
record_types:
  undefined: '#546de5'
  très important: red
  fiche de lecture: 'rgba(157, 62, 12, 0.7)'
  concept: 'hsl(14, 100%, 80%)'
```

`link_types`
: Liste des types de relations. Chaque type est défini par un paramètre `nom` dont la valeur est une liste de deux paramètres, lesquels affectent la représentation des liens dans le graphe : `stroke` correspond à la forme du trait et `color` à sa couleur. La valeur de `stroke` peut être `simple` (trait continu simple), `double` (trait continu double), `dash` (tirets) ou `dotted` (pointillés). Les couleurs sont déclarées comme en HTML, de la même manière que pour les types de fiches.

Exemple :

```yaml
link_types:
  undefined:
    stroke: simple
    color: grey
  spécial:
    stroke: dash
    color: 'rgba(157, 62, 12, 0.7)'
```

::: important
Le type par défaut `undefined` doit obligatoirement être défini, que ce soit pour les types de fiches ou pour les types de liens.
:::

La configuration des relations a une incidence sur leur lisibilité au sein du graphe. Dans l'exemple suivant, l'utilisateur a défini trois types de liens qualifiés à la manière d'un thésaurus (spécifique `s`, générique `g` et associé `a`). Les paramètres sont définis de manière à renforcer la visibilité des liens qualifiés : les liens non qualifiés (`undefined`) sont en pointillés (`dotted`) gris (`grey`), tandis que les liens qualifiés sont plus lisibles, grâce à des traits plus marqués et une couleur plus vive.

```yaml
link_types:
  undefined:
    stroke: dotted
    color: grey
  s:
    stroke: simple
    color: 'rgba(157, 62, 12, 0.7)'
  g:
    stroke: simple
    color: 'rgba(157, 62, 12, 0.7)'
  a:
    stroke: dash
    color: 'rgba(157, 62, 12, 0.7)'
```

## Paramètres du graphe

Les paramètres suivants définissent la valeur par défaut des paramètres du graphe. La plupart de ces paramètres peuvent être modifiés en direct dans l'interface du cosmoscope (voir [Graphe](#graphe) plus bas). Vous pouvez tester différentes valeurs avant de les reporter dans le fichier `config.yml` ; les valeurs définies dans le fichier sont rétablies à chaque rechargement du cosmoscope.

```yaml
graph:
  background_color: white
  highlight_color: red
  highlight_on_hover: true
  text_size: 9
  attraction:
    force: -50
    distance_max: 800
    verticale: 0
    horizontale: 0
  arrows: false
```

`background_color`
: Couleur de fond du graphe.
: Exemple : `whitesmoke` ,`#ccc`, `rgb(57, 57, 57)`

`highlight_color`
: Couleur de surbrillance des éléments mis en sélection.
: Exemple : `red` ,`#0642ff `, `rgb(207, 52, 118)`

`highlight_on_hover`
: Survoler un nœud le met temporairement en surbrillance, ainsi que ses connexions. Valeur : `true` ou `false`.

`text_size`
: Taille des étiquettes des nœuds. L'unité implicite est le pixel. La valeur minimale est `5` ; la valeur maximale est `15`.

`attraction`
: Paramètres de la simulation de forces entre les nœuds.
: `force` : puissance globale. Plus elle est faible, plus les liens entre les nœuds sont relâchés. Une valeur inférieure à `50` tend à provoquer des collisions incessantes.
: `distance_max` : distance maximum entre les nœuds et îlots. Au-delà de `1000`, ce paramètre n'a pas d'effet mesurable. La valeur de `distance_max` indique également la valeur maximale effective de `force`. Par exemple, si `distance_max: 500`, alors augmenter `force` au-delà de 500 n'aura pas d'incidence.
: `verticale` : force d'attraction vers l'axe vertical. Une valeur de `0` signifie que ce paramètre est désactivée.
: `horizontale` : force d'attraction vers l'axe horizontal. Une valeur de `0` signifie que ce paramètre est désactivée.

`arrows`
: Affichage des flèches. Permet d'obtenir un graphe orienté ou non orienté. Valeur booléenne : `true` ou `false`.

## Paramètres facultatifs

Vous pouvez ajouter au fichier de configuration les paramètres suivants :

`bibliography`
: Chemin vers le fichier (JSON CSL) `.json` contenant la liste des références bibliographiques. Permet d'activer la [bibliographie des fiches](#bibliographie).

`csl`
: Chemin vers le fichier de style (CSL) `.csl` contenant les styles de citation. Permet d'activer la [bibliographie des fiches](#bibliographie).

`minify`
: Réduit le poids du fichier `cosmoscope.html`, au détriment de la lisibilité du code source. Valeur : `true` ou `false`. Désactivé par défaut.

`custom_css`
: Applique les styles déclarés par l'utilisateur dans le fichier `/template/custom.css`. Valeur : `true` ou `false`. Désactivé par défaut.

`history`
: Exporte une copie du cosmoscope et de ses données dans un sous-dossier horodaté du dossier `history`. Valeur : `true` ou `false`. Activé par défaut.

`metadata`
: Liste de métadonnées ajoutées sous la forme de balises `meta` dans l'en-tête `<head>` du fichier `cosmoscope.html` et dans le volet « À propos ».

Exemple :

```yaml
metadata:
  title: Mon cosmoscope
  author: Prénom Nom
  keyword:
    - Zettelkasten
    - graphe documentaire
  description: "Répertoire de fiches en ligne"
  url: https://domaine.fr/cosmoscope.html
```

`focus_max`
: Valeur maximale du focus. La valeur doit un entier supérieur ou égal à `0`.

`views`
: Liste des vues apparaissant dans la section Vues du cosmoscope. Chaque vue est définie par une paire `nom: valeur` dans laquelle `nom` correspond au nom de la vue et `valeur` correspond à une chaîne de caractères générée via le bouton Sauvegarder la vue actuelle du cosmoscope.

Exemple :

```yaml
views:
  Graphe: eyJmaWx0ZXJzIjpbImNvbmNlcHQiXX0%3D
  Graphe (focus 2): eyJyZWNvcmRJZCI6MjAyMTAyMjExNDQ0NTF9
```

## Modifier la configuration en ligne de commande

Les commandes suivantes vous permettent de modifier rapidement la configuration.

Générer un fichier de configuration modèle :

```
node app config
node app c
```

Modifier le chemin vers les fichiers sources :

```
node app import <chemin>
```

Modifier le chemin d'export du cosmoscope :

```
node app export <chemin>
```

Ajouter des types valides :

```
node app atype <nom> <couleur>
```

Créer le fichier de style personnalisé `custom.css` dans le répertoire `/template` :

```
node app css
```

Ajouter des vues :

```
node app aview <nom> <code>
```

# Utilisation du cosmographe

## Format de données

Cosma ne prescrit pas de logiciel d'écriture, mais son fonctionnement repose sur l'adoption simultanée de plusieurs normes d'écriture qui visent à accroître l'interopérabilité et la pérennité des données :

- YAML pour la configuration du logiciel et les métadonnées des fichiers ;
- Markdown pour le contenu des fichiers ;
- une syntaxe de type wiki (doubles crochets `[[ ]]`) pour créer des liens internes ;
- des identifiants uniques qui servent de cibles aux liens internes.

Cette combinaison de normes d'écriture correspond au croisement de plusieurs cultures textuelles : documentation ; wikis ; prise de notes avec la méthode Zettelkasten ; écriture académique avec Pandoc. Cosma fonctionne donc particulièrement bien lorsqu'il est utilisé en tandem avec des environnements d'écriture qui partagent cette approche, comme [Zettlr](https://zettlr.com) ou l'extension [Foam](https://foambubble.github.io/foam/) pour Visual Studio Code et VSCodium.

Pour être correctement interprétés par Cosma, les fichiers Markdown doivent donc respecter une certaine structure, et notamment la présence d'un en-tête YAML au début du fichier.

Exemple :

```
---
title: Titre du document
id: 20201209111625
type: undefined
tags:
  - mot-clé 1
  - mot-clé 2
---
```

L'en-tête YAML est délimité par deux séries de trois tirets seuls sur une ligne (`---`). Cosma reconnaît et utilise les quatre champs suivants :

`title`
: Titre de la fiche. Obligatoire.

`id`
: Identifiant unique de la fiche. Obligatoire. Par défaut, Cosma génère des identifiants à 14 chiffres par horodatage (année, mois, jour, heures, minutes et secondes) sur le modèle de certains logiciels de prise de notes type Zettelkasten comme [The Archive](https://zettelkasten.de/the-archive/) ou [Zettlr](https://www.zettlr.com).

`type`
: Type de la fiche. Facultatif. Une fiche ne peut être assignée qu'à un seul type. Si le champ `type` n'est pas spécifié ou bien que sa valeur ne correspond à l'un des types enregistrés dans la configuration sous le paramètre `record_types`, Cosma interprètera le type de la fiche comme `undefined`.

`tags`
: Mots-clés de la fiche. Facultatif. La valeur doit être une liste. Une fiche peut disposer d'autant de mot-clés que vous souhaitez.

Conformément à la spécification YAML, la liste des mots-clés peut être inscrite en mode *block* :

```yaml
tags:
- mot-clé 1
- mot-clé 2
```

Ou bien en mode *flow* :

```yaml
tags: [mot-clé 1, mot-clé 2]
```

Vous pouvez ajouter des champs supplémentaires de manière arbitraire, par exemple un champ `description`.

Après l'entête, vous pouvez librement inscrire votre contenu.

::: important
Le rendu des fichiers Markdown sous forme de fiche HTML dans le cosmoscope est limité aux éléments textuels. Les images par exemple ne sont pas incluses et seront remplacées par leur texte alternatif le cas échéant.
:::

## Créer des fiches via le cosmographe

Vous pouvez créer un fichier Markdown conforme pour Cosma à la main ou bien en utilisant la ligne de commande. Deux options sont proposées. La première est une commande qui déclenche une saisie guidée en plusieurs étapes :

```
node app record
node app r
```

La seconde est un *one-liner* qui permet de créer une fiche en une seule saisie :

```
node app autorecord <titre> <type> <mots-clés>
node app a <titre> <type> <mots-clés>
```

- `<titre>` correspond au titre de la fiche, qui est aussi le nom du fichier généré ;
- `<type>` correspond à l’un des types définis dans la configuration ;
- `<mots-clés>` est une liste de mots-clés séparés par des virgules (sans espaces).

Seul le titre est obligatoire.

## Créer des liens

À l'intérieur des fiches, vous pouvez créer des liens avec l'identifiant de la fiche cible entre double crochets. Le cosmographe reconnaît ces liens et les utilise pour modéliser la structure du graphe.

Exemple :

```
Un lien vers [[20201209111625]] une fiche.
```

Vous pouvez également qualifier le lien selon la typologie indiquée sous `link_types` dans la configuration. Le type de lien est alors ajouté comme préfixe à l'identifiant, avec un deux-points comme séparateur.

Exemple :

```
Le concept B dérive du [[générique:20201209111625]] concept A.
```

## Bibliographie

Vous pouvez intégrer des clés de citation au sein de vos fiches. Elles peuvent être enregistrées avec le logiciel de références bibliographiques [Zotero](https://www.zotero.org/) puis exportées avec un identifiant unique dans un fichier JSON CSL grâce à son extension [Better BibTeX](https://retorque.re/zotero-better-bibtex/). Cet identifiant peut ensuite être inséré dans vos fiches (dans le style du logiciel Pandoc), entre crochets tel que ci-dessous.

```
D'après les références [@ledeuffTempsHumanitesDigitales2014, 22; @perretFonctionDocumentairePreuve2020].
```

Vous devez cibler au sein de la configuration le fichier JSON CSL exporté avec Zotero, ainsi que le syle des citations.

```
bibliography: 'D:\documents\ma_bibliotheque.json'
csl: 'D:\documents\mon_style.csl'
```

Les commandes suivantes permettent de générer un cosmoscope en utilisant le convertisseur Citeproc intégré à Cosma. 

```
node app modelize --citeproc
node app modelize -c
```

Chaque clé de citation est alors remplacée par une courte référence et une entrée dans la bibliographie (placée au bas des fiches).

```
D'après les références (Le Deuff 2014, p. 22; Perret 2020).

Bibliographie
-------------

LE DEUFF, Olivier, 2014. Le temps de humanités digitales. FYP. ISBN 978-2-36405-155-5.

PERRET, Arthur, 2020. Fonction documentaire de preuve et données numériques. Arthurperret.fr [en ligne]. 9 septembre 2020. [Consulté le 14 septembre 2020]. Disponible à l’adresse : https://www.arthurperret.fr/fonction-documentaire-preuve-donnees-numeriques.html
```

Vous pouvez modifier le style de citation (par défaut : ISO690-author-date-fr) en remplaçant le fichier `/template/citeproc/styles.csl`. Téléchargez un nouveau style depuis la [base de données de Zotero](https://www.zotero.org/styles).

Vous pouvez modifier la traduction des mots-clés de la notice bibliographique (par défaut : français) en remplaçant le fichier `/template/citeproc/locales.xml`. Téléchargez une nouvelle traduction depuis la [base de donnée CSL](https://github.com/citation-style-language/locales/tree/6b0cb4689127a69852f48608b6d1a879900f418b).

Toutes les données de toutes les références citées sont enregistrée dans le cosmoscope sous forme de données JSON, au sein de la fiche `<article id="citation-references">`. Vous pouvez retrouver et télécharger ces données en cliquant sur le lien « Données », au bas du menu.

## Export

Pour créer le fichier `cosmoscope.html`, utilisez l'une de ces commandes :

```
node app modelize
node app m
```

Vous pouvez aussi obtenir une version publication du cosmoscope avec la commande suivante. Elle permet de nommer, présenter et signer votre export depuis le menu « À propos » (accessible depuis le bouton, au pied du menu de gauche). Elle y intègre les métadonnées `title`, `author` et `description` renseignées dans la [configuration (option `metas`)](#parametres-facultatifs). Si elle est renseignée, la métadonnée `title` vient aussi remplacer le logo en haut du menu gauche.

```
node app modelize --publish
node app m -p
```

Vous pouvez combiner les différentes options d'export comme suit :

```
node app modelize --publish --citeproc
node app m -p -c
```

Le fichier `cosmoscope.html` est exporté dans le répertoire défini par `export_target` dans la configuration. Si le fichier existe déjà au même emplacement, il est écrasé.

Si le paramètre `history` a pour valeur `true`, un sous-répertoire horodaté (selon la date d'export, à la seconde près) est également créé dans le répertoire `/history` avec les contenus suivants :

- une copie du fichier `cosmoscope.html` ;
- un répertoire `data` contenant les fichiers `links.json` et `nodes.json`, respectivement la liste des liens et des nœuds, avec leurs métadonnées respectives.

Cet export facilite le partage des données et leur réutilisation dans d'autres logiciels de visualisation.

## Alertes et erreurs

Durant le processus d'analyse de vos fichiers Markdown, il se peut que des conflits avec le système surviennent (sans interrompre le processus d'export). Il y a alors deux types de notification :

- certaines données doivent être remplacées (type non reconnu, lien sans cible…), vous recevez alors une **alerte** (*warning*) ;
- certaines informations empêchent le traitement d'un fichier (manque d'un titre, identifiant non unique…), vous recevez alors une **erreur** (*error*).

Les alertes peuvent être ignorées. Vous devez corriger toutes les erreurs pour que le cosmoscope soit complet par rapport à votre bibliothèque.

Les alertes (en jaune) et erreurs (en rouge) sont affichées dans la console. Au-delà de 5 notifications par type, seul leur nombre est annoncé. Vous pouvez les lire dans un fichier `error.log`. Le cas échéant, il est enregistré dans un sous-répertoire horodaté (selon la date d'export, à la seconde près), dans le répertoire `history`.

# Utilisation du cosmoscope

Le fichier `cosmoscope.html` peut être lu avec un navigateur web depuis votre ordinateur. Il peut aussi être mis en ligne, par exemple déposé sur un serveur web par un simple envoi FTP. Ceci permet éventuellement de le partager largement. Vous pouvez notamment envoyer un lien vers une fiche en particulier sur un cosmoscope en ligne, en ajoutant son identifiant précédé d'un croisillon `#` en fin d'URL. Exemple :

`https://domaine.fr/cosmoscope.html#20210427185546`

## Description générale de l'interface

L'interface de Cosma est organisée en trois colonnes :

Panneau latéral gauche (Menu)
: Regroupe les fonctionnalités permettant de chercher de l'information et de modifier l'affichage de manière globale.

Zone centrale (Graphe)
: Affiche le graphe et les contrôles associés (zoom, focus).

Panneau latéral droit (Fiche)
: Affiche les fiches (métadonnées et contenu) ainsi qu'une liste des liens sortants (Liens) et entrants (Rétroliens).

[![Interface de Cosma (cliquez sur l'image pour l'afficher en grand)](https://hyperotlet.huma-num.fr/cosma/img/cosma-interface-schema.png)](https://hyperotlet.huma-num.fr/cosma/img/cosma-interface-schema.png)

## Graphe

Le graphe située dans la zone centrale de l'interface affiche des nœuds étiquetés et interreliés. Chaque nœud correspond à une fiche ; l'étiquette correspond au titre de la fiche. Les liens correspondent aux liens établis entre les fiches via leur identifiant entre doubles crochets.

Si le [paramètre `highlight_on_hover` est activé](#parametres-du-graphe), survoler un nœud le met temporairement en **surbrillance**, ainsi que ses connexions. Cliquer sur un nœud le met en surbrillance, ainsi que ses connexions, et ouvre la fiche correspondante.

Vous pouvez **zoomer** dans le graphe à la souris, au pavé tactile, en double cliquant sur le fond du graphe ou bien avec les boutons dédiés situés en bas à gauche. Le bouton Recentrer (raccourci : touche `R`) réinitialise le zoom.

Les nœuds sont organisés dans l'espace par un algorithme de simulation de forces. Une barre colorée sous le logo Cosma témoigne de l'état de la simulation. Cliquez dessus (raccourci : touche `Espace`) pour lancer un cycle de simulation supplémentaire.

::: astuce
Quelques pressions sur la touche `Espace` permettent de « déplier » progressivement un graphe emmêlé.
:::

Le graphe n'est pas figé, les nœuds peuvent donc être déplacés par cliquer-glisser. Ils restent soumis en permanence à la simulation, donc il n'est pas possible de les disposer manuellement de manière arbitraire.

L'affichage du graphe peut être modifié de manière temporaire via les contrôles placés sous Paramètres du graphe dans le panneau latéral gauche :

- affichage des liens ;
- affichage des étiquettes ;
- animation des nœuds au survol ;
- forces simulées par l'algorithme de dessin du graphe ;
- position du graphe dans l'espace ;
- taille des étiquettes.

Pour modifier l'affichage de manière permanente, modifiez les valeurs par défaut des paramètres correspondants sous `graph_config` dans `config.yml` (voir [Paramètres du graphe](#parametres-du-graphe) plus haut).

::: astuce
Modifiez `force` et `distance_max` pour adapter l'affichage à la résolution et la taille de votre écran. Modifiez `verticale` et `horizontale` pour appliquer une force centripète vers l'axe correspondant, ce qui permet notamment de ramener les îlots et nœuds isolés plus près du centre.
:::

L'affichage est possible sur tous types d'écrans mais n'est pas optimisé pour les terminaux mobiles : le tactile ne donne pas accès à certaines interactions comme le survol, et les petits écrans restreignent l'utilité du graphe.

## Fiches

Les fiches peuvent êtres ouvertes en cliquant sur un nœud, une entrée de l'index, une suggestion du moteur de recherche, ou un lien dans le corps d'une fiche. Ouvrir une fiche affiche son contenu dans le panneau latéral droit. Cela met aussi à jour l'URL de la page avec l'identifiant de la fiche : ceci permet de naviguer entre les fiches visitées via les fonctionnalités Précédent / Suivant du navigateur, mais aussi de les retrouver dans l'historique ou encore d'obtenir un lien direct vers la fiche.

Cliquer sur le bouton « Fermer » referme le volet et désélectionne le nœud correspondant dans le graphe.

Les liens présents dans les fiches sont cliquables. Vous pouvez ouvrir ces liens dans un nouvel onglet via un clic droit. Le titre du lien (affiché en infobulle après 1-2 secondes de survol) est celui de la fiche correspondante.

En bas de la fiche se trouve une liste des fiches vers lesquelles elle renvoie (liens sortants), ainsi que des fiches qui pointent vers elles (liens entrants ou rétroliens). Les liens et rétroliens sont contextualisés : au survol, une infobulle s'affiche, montrant le paragraphe dans lequel ce lien se trouve dans la fiche correspondante.

## Mode focus

Le bouton Activer le focus (raccourci : touche `F`) situé en bas à gauche du graphe permet de restreindre l'affichage au nœud sélectionné : en mode focus, seules les connexions directes à la fiche sélectionnée sont affichées dans l'interface. Le mode focus ne fonctionne que si vous avez sélectionné une fiche.

Le curseur qui apparaît sous le bouton Activer le focus permet de faire varier la distance d'affichage, jusqu'au maximum permis par le paramètre `focus_max` dans la configuration.

::: astuce
Le curseur du niveau de focus est contrôlable via les flèches du clavier. Vous pouvez enchaîner les raccourcis : `F` pour activer le focus, puis les flèches pour augmenter le niveau de focus.
:::

## Moteur de recherche

Le champ de texte situé en haut du panneau latéral gauche est un moteur de recherche. Il suggère une liste de fiches dont le titre est proche de votre saisie (*fuzzy search*). Cliquer sur une suggestion sélectionne le nœud correspondant dans le graphe et ouvre la fiche correspondante dans le panneau latéral de droite.

::: important
Les suggestions disponibles sont contraintes par les filtres et le mode focus : une fiche masquée par l'une l'autre de ces fonctionnalités ne sera pas accessible via le moteur de recherche.
:::

## Filtrer l'affichage par types

La liste des types de fiches située en haut du panneau latéral gauche permet de filtrer l'affichage. Cliquer sur un type permet de masquer et réafficher les fiches du type correspondant dans le graphe, l'index et les suggestions du moteur de recherche. Cliquer sur un type en maintenant la touche `Alt` enfoncée permet de masquer et réafficher les fiches des autres types.

Pour qu'un type apparaisse, il doit être déclaré sous `record_types` dans la configuration et être présent dans au moins une fiche.

## Mots-clés

La liste des mots-clés située dans le panneau latéral gauche permet de mettre en évidence les fiches qui utilisent chaque mot-clé. Sélectionner un mot-clé met en surbrillance l'étiquette des nœuds correspondants dans le graphe et restreint l'index aux fiches correspondantes. Vous pouvez activer simultanément plusieurs mots-clés. Pour désactiver un mot-clé, cliquez à nouveau sur le bouton correspondant.

Pour qu'un mot-clé apparaisse, il suffit qu'il ait été déclaré dans au moins une fiche via le champ `tags`.

## Index

L'index alphabétique des fiches situé dans le panneau latéral gauche permet d'accéder directement à une fiche sans passer par le graphe. Cliquer sur un titre sélectionne le nœud correspondant dans le graphe et ouvre la fiche correspondante. L'index peut être trié par ordre alphabétique croissant ou décroissant. Les filtres, les mots-clés et le mode focus modifient l'affichage de l'index.

## Vues

À tout moment, l'état du graphe (fiche sélectionnée, filtres actifs, mode focus) peut être sauvegardé pour un accès rapide. Cette fonctionnalité est une sorte de marque-page mais pour le graphe. Cliquez sur le bouton Sauvegarder la vue pour récupérer un code dans votre presse-papier. Ce code doit ensuite être déclaré à la suite d'un nom de vue sous le paramètre `views` dans la configuration :

```
views:
  Une vue intéressante: eyJwb3MiOnsieCI6MCwieSI6MCwiem9vbSI6MX19
```

Ceci ajoute un bouton éponyme dans la section Vues du panneau latéral gauche. Cliquer sur ce bouton applique tous les paramètres qui étaient actifs au moment de l'enregistrement de la vue. Cliquer à nouveau sur le bouton rétablit l'affichage normal.

## Personnalisation de l'interface

L'interface du cosmoscope est conçue à partir des fichiers Nunjucks (`.njk`) et CSS présents dans le dossier `/template` du répertoire de Cosma.

L'interface peut être personnalisée via un fichier `custom.css` placé dans ce même dossier. Vous pouvez créer manuellement le fichier ou bien exécuter la commande suivante :

```
node app css
```

Le paramètre `custom_css` de la configuration permet d'activer ou désactiver la prise en compte de ce fichier sans avoir à le supprimer.

Les déclarations CSS ajoutées dans `/template/custom.css` remplacent celles présentes dans `/template/styles.css` et `/template/print.css` (pour les styles à l'impression). Elles s'appliquent au fichier `/template/template.njk`. Consultez ces fichiers ou utilisez l'inspecteur de votre navigateur web pour connaître les sélecteurs à utiliser pour telle ou telle déclaration. Les feuilles de style du cosmoscope utilisent notamment des variables CSS pour définir les couleurs et les polices utilisées. Vous pouvez redéfinir uniquement ces variables pour modifier tous les éléments d'interface auxquels elles s'appliquent.

Dans l'exemple ci-dessous, le fichier `custom.css` contient des déclarations qui modifient les polices utilisées dans le cosmoscope :

```css
:root {
  --sans: "IBM Plex Serif", sans-serif;
  --serif: "IBM Plex Serif", serif;
  --mono: "IBM Plex Mono", monospace;
  --condensed: 'IBM Plex Sans Condensed', sans-serif;
}
```

# Développement

Cette partie de la documentation s'adresse à des développeurs expérimentés en JavaScript. Elle présente l'arborescence et les concepts sur lesquels reposent les deux parties formant Cosma, le **cosmographe** et le **cosmoscope**.

Nous vous recommandons vivement de lire le reste de la documentation pour bien saisir l'ensemble des usages en jeu dans le code source présenté ci-dessous.

## Terminologie

Les fichiers Markdown interprétés par Cosma sont qualifiés ici de « fiches » plutôt que de « notes », en référence à la tradition de la fiche érudite et à l'histoire de la documentation. L'acception documentaire de « fiche » n'a pas de traduction directe en anglais (sinon *index card*). En revanche, elle est conceptuellement proche du mot « *record* » issu du [*records management*](https://fr.wikipedia.org/wiki/Records_management). Le code de Cosma emploie donc le mot record pour désigner une fiche.

## Description générale de l'architecture

Cosma est principalement implémenté en JavaScript. Le logiciel repose sur deux systèmes distincts, le cosmographe et le cosmoscope.

Le **cosmographe** repose sur l'environnement Node.js. Une série de scripts permettent de :

- vérifier et actualiser le fichier de configuration ;
- générer des fichiers Markdown et leur entête ;
- lire un répertoire pour en extraire les fichiers Markdown et analyser leur contenu (Markdown, métadonnées YAML et liens style wiki) afin de générer :
	- des fichiers JSON ;
	- le cosmoscope (ses données et variables CSS).

Le **cosmoscope** est un fichier HTML exécuté sur navigateurs web, créé à partir d'un *template* [Nunjucks](https://mozilla.github.io/nunjucks/) (`template.njk`). Il intègre :

- les métadonnées web et styles issus de la configuration ;
- les scripts et bibliothèques JavaScript ;
- des index (mots-clés, titre de fiche, vues) ;
- les fiches.

## Arborescence

Vous trouverez ci-dessous une description complète de l'arborescence du logiciel. Vous pourrez ainsi distinguer les fichiers concernant le cosmographe et ceux du cosmoscope.

```
.
├── docs/                   | répertoire de la documentation
│   ├── api/                | répertoire des index des API
│   │   └── [x].md          | introduction à l'index [x] de l'API
│   └── api-config-[x].json | config. de l'index [x] de l'API
├── functions/              | fonctions du cosmographe
│   ├── autorecord.js       | création de fichiers Markdown formatés
│   ├── history.js          | création répertoires de l'historique des exports
│   ├── links.js            | analyse des liens wiki et de leurs attributs
│   ├── log.js              | affichage des alertes et création des registres
│   ├── modelize.js         | analyse des fichiers Markdown et création modèle de données
│   ├── record.js           | formulaire du terminal pour création des fichiers Md
│   ├── template.js         | intégration données, style et corps du cosmoscope
│   └── verifconfig.js      | validation et modification de la configuration
├── template/               | 
│   ├── libs/               | bibliothèques JavaScript
│   ├── scripts/            | fonctions du cosmoscope
│   │   ├── bibliography.js | téléchargement des données bibliographiques
│   │   ├── counter.js      | actualiser les compteurs d'entités
│   │   ├── filter.js       | appliquer filtres
│   │   ├── focus.js        | appliquer focus
│   │   ├── graph.js        | affichage du graphe et intéractions
│   │   ├── history.js      | historique de navigation entre les fiches
│   │   ├── index.js        | contrôle des volets et boutons du menu gauche
│   │   ├── keyboard.js     | affectation des raccourcis clavier
│   │   ├── main.js         | variables globales et animation logo
│   │   ├── record.js       | ouvrir/fermer le volet latéral droit
│   │   ├── search.js       | paramétrage moteur de recherche
│   │   ├── tag.js          | appliquer tags
│   │   ├── view.js         | enregistrer et appliquer une vue
│   │   └── zoom.js         | paramétrer les déplacement (latéral, zoom) au sein du graphe
│   ├── cosmalogo.svg       | logo du logiciel
│   ├── template.njk        | structure du cosmoscope
│   ├── print.css           | styles d'impression du cosmoscope
│   └── styles.css          | styles du cosmoscope
├── app.js                  | adressage des commandes du terminal
└── package.json            | liste des dépendances Node.js
```

## Index des fonctions

Cliquez sur les liens ci-dessous pour consulter la liste des fonctions utilisées par le cosmographe et le cosmoscope :

- [Consulter l'API du cosmographe](./api/cosmographe/index.html)
- [Consulter l'API du cosmoscope](./api/cosmoscope/index.html)

## Fonctionnement du cosmographe

Il a trois utilisations possibles via le terminal. Ces différentes requêtes sont réceptionnées par `app.js` qui les renvoie :

- extraire et modéliser (`modelize.js`) puis intégrer (`template.js`) les données dans un cosmoscope ;
- générer des fichiers Markdown formatés (`record.js` et `autorecord.js`) ;
- modifier la configuration (`verifconfig.js`).

La configuration (le contenu du fichier `config.yml` devenu un objet JavaScript) est exportée de manière globale (depuis `verifconfig.js`). Elle peut être appelée comme ci-dessous.

```javascript
const config = require('./verifconfig').config;

const folderToExport = config.export_target;
```

## Lecture des fichiers

Depuis le fichier `modelize.js`, on extrait de chaque fichier Markdown les métadonnées (l'entête YAML) et le contenu (suivant l'entête YAML) (fichier `modelize.js`).

[`catchLinksFromContent()`](./api/cosmographe/global.html#catchLinksFromContent)
: Le contenu est lu une première fois par une série d'expressions régulières pour en extraire les paragraphes, et pour chaque paragraphe les *wikilinks* contenus. Le paragraphe devient le contexte de ses liens et est transpilé en HTML.

[`convertLinks()`](./api/cosmographe/global.html#convertLinks)
: Le contenu du fichier est ensuite transformé pour y transformer les *wikilinks* en liens Markdown

[`cosmoscope()`](./api/cosmographe/global.html#cosmoscope)
: Le contenu du fichier est intégralement transpilé du Markdown à l'HTML.

La première et la troisième fonction font appel à la bibliothèque markdown-it. Elle peut être remplacée.

## Génération du cosmoscope

Le cosmoscope est généré grâce à la fonction [`cosmoscope()`](./api/cosmographe/global.html#cosmoscope).

Celle-ci instancie le modèle Nunjucks `/template/template.njk` et y injecte les données relatives à la configuration, aux fiches et aux entités du graphe ainsi que leurs styles (sérialisés par la fonction [`colors()`](./api/cosmographe/global.html#colors)).

Nunjucks importe par ailleurs dans son `head` les fichiers de style CSS et les bibliothèques JavaScript ainsi que les fonctions JavaScript dans des balises `script` en fin de document. Les données relatives aux fiches et à la configuration sont intégrées via des boucles et autres structures de contrôle de Nunjucks.

Le tout est enregistré dans un fichier `cosmoscope.html` et est [exporté](#export).

## Affichage du graphe

La génération et l'animation du graphe reposent sur la bibliothèque [D3.js](https://d3js.org/). Celle-ci perçoit ses données depuis l'objet global `graph`. Cet object est composé de deux tableaux.

`graph.nodes`
: Ce tableau contient toutes les données relatives aux nœuds, y compris une série de booléens permettant de connaître leur état d'affichage (voir la sérialisation par la fonction [`registerNodes()`](./api/cosmographe/global.html#registerNodes)). Cet état indiqué est actualisé à chaque modification d'affichage.

`graph.links`
: Ce tableau contient toutes les données relatives aux liens (voir la sérialisation par la fonction [`registerLinks()`](./api/cosmographe/global.html#registerLinks)).

## Affichage via d'autres bibliothèques

Les tableaux présentés dans la section précédente peuvent être injectés dans d'autres bibliothèques JavaScript de génération de graphe.

**Exemple 1 :** Vis.js Network ([dépôt](https://github.com/visjs/vis-network), [exemple](https://github.com/visjs/vis-network#example)).

Extrait du fichier `/functions/modelize.js` :

```javascript
function registerLinks(file) {
// ...
  for (const link of file.links) {
  // ...
    entities.links.push({
      // ...
      from: Number(link.source.id),
      to: Number(link.target.id),
      // ...
    });
  }
}
```

Extrait du fichier `/template/scripts/graph.js`

```javascript
const network = new vis.Network(
  document.getElementById('network')
  , data = {
    nodes: new vis.DataSet(graph.nodes),
    edges: new vis.DataSet(graph.links)
  }
  , {  } // options
);
```

**Exemple 2 :** Sigma.js ([dépôt](https://github.com/jacomyal/sigma.js/), [exemple](https://github.com/jacomyal/sigma.js/blob/master/examples/basic.html#L70)).

```javascript
const network = new sigma({
  graph: {
    nodes: graph.nodes,
    edges: graph.links
  },
  container: 'network'
});
```

## Paramètres du graphe

Les paramètres du graphe sont extraits de la partie `graph_config` du fichier de configuration `config.yml`. Elle est injectée dans le modèle Nunjucks `/template/template.njk` via la fonction [`cosmoscope()`](./api/cosmographe/global.html#cosmoscope). Dans le modèle, elle est à la fois utilisée comme valeur par défaut des formulaires du menu « Paramètres du graphe » et implémentée comme objet global JavaScript `graphProperties`.

Ce même objet global est actualisé par les différents formulaires du menu « Paramètres du graphe ». Ils font ensuite appel à la fonction [`updateForces()`](./api/cosmographe/global.html#updateForces) pour relancer l'évaluation de ces paramètres par la bibliothèque de visualisation D3.js.

## Raccourcis clavier

L'ensemble des raccourcis clavier du cosmoscope sont implémentés dans le fichier `/template/scripts/keyboard.js`. L'objet global `pressedKeys` contient la liste des touches surveillées pour modifier un comportement. D'autres touches (des lettres) sont listées pour appeler certaines fonctions et ne sont pas ajoutées à l'objet global `pressedKeys`.

Le booléen global `keyboardShortcutsAreWorking` définit si les raccourcis peuvent être utilisés ou non. Lors de la saisie dans un champ, il ne faut pas que les lettres servent à autre chose qu'écrire.

# Crédits

## Équipe

- [Arthur Perret](https://www.arthurperret.fr/) (porteur du projet)
- [Guillaume Brioudes](https://myllaume.fr/) (développeur)
- [Clément Borel](https://mica.u-bordeaux-montaigne.fr/borel-clement/) (chercheur)
- [Olivier Le Deuff](http://www.guidedesegares.info/) (chercheur)

## Bibliothèques utilisées

Pour améliorer la maintenabilité et la lisibilité du code source, l’équipe de développement a recouru aux bibliothèques suivantes.

- [D3.js](https://d3js.org/) v4.13.0 (BSD 3-Clause) : Génération du graphe
- [Nunjucks](https://mozilla.github.io/nunjucks/) v3.2.3 (BSD 2-Clause) : Génération du template du Cosmoscope
- [Js-yaml](https://github.com/nodeca/js-yaml) v3.14.0 (MIT License) : Lecture du fichier de configuration et écriture des YAML Front Matter
- [Js-yaml-front-matter](https://github.com/dworthen/js-yaml-front-matter) v4.1.0 (MIT License) : Lecture des YAML Front Matter des fichiers Markdown
- [Markdown-it](https://github.com/markdown-it/markdown-it) v12.0.2 (MIT License) : Conversion Markdown → HTML
- [Markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs) v4.0.0  (MIT License) : Traitement des hyperliens Markdown au sein des fiches
- [Citeproc-js](https://github.com/Juris-M/citeproc-js) v2.4.59 (CPAL et AGPL) : Conversion des clés de citation
- [Minify-html](https://github.com/wilsonzlin/minify-html) v0.4.3 (MIT License) : Allègement du Cosmoscope
- [Fuse.js](https://fusejs.io/) v6.4.6 (Apache License 2.0) : Moteur de recherche
- [Moment](https://momentjs.com/) v2.29.1 (MIT License) : Gestion de l'horodatage

## Historique du projet

Août 2020
: Prototypage d'un « Lexicographe » avec l'interface de l'[Otletosphère](https://github.com/hyperotlet/otletosphere).

Décembre 2020
: Début du développement de Cosma avec un nouveau cahier des charges.

Avril 2021
: Finalisation de la première version de Cosma.

