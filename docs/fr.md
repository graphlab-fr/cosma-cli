---
title: Documentation de Cosma
author:
  - Guillaume Brioudes <https://myllaume.fr/>
  - Arthur Perret <https://www.arthurperret.fr/>
date: 2021-05-26
lang: fr-FR
---

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

```bash
git clone https://github.com/hyperotlet/cosma.git
```

## Installation des dépendances

Le fonctionnement de Cosma repose sur d'autres programmes qualifiés de dépendances. Cosma utilise le gestionnaire de dépendances NPM qui est installé en même temps que NodeJs. Installez les dépendances nécessaires au bon fonctionnement de l'application avec la commande ci-dessous :

```bash
npm install --only=production
```



# Configuration

Cosma utilise un fichier de configuration au format [YAML](http://yaml.org). C'est une liste hiérarchisée de paramètres dont les valeurs modifient le comportement du logiciel.

::: astuce
Pour une introduction à YAML, [cliquez ici](https://sweetohm.net/article/introduction-yaml.html). Dans le contexte de Cosma, il est notamment important de savoir qu'en YAML la hiérarchie des paramètres est mise en œuvre par l'indentation, c'est-à-dire la présence d'espaces en début de ligne, et que l'utilisation de tabulations pour indenter les lignes est interdite en YAML. Il est recommandé de choisir une unité d'indentation correspondant à un multiple de 2 espaces (2 ou 4) et de s'y tenir pour tout le fichier.
:::

Exécutez la commande suivante pour créer le fichier de configuration (`config.yml`) s'il n'existe pas déjà. Vous pouvez aussi le supprimer et utiliser cette commande pour réinitialiser le fichier. Le fichier généré par cette commande est un modèle des paramètres qui doivent obligatoirement être renseignés pour une configuration valide.

```bash
node app
```

<!-- Renommer la commande `node app config` ? -->

## Paramètres nécessaires

La configuration doit contenir les paramètres suivants.

`files_origin`
: Chemin du répertoire contenant les fichiers Markdown à scanner. La syntaxe dépend du système d'exploitation.
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

Les paramètres suivants définissent la valeur par défaut des paramètres du graphe. La plupart de ces paramètres peuvent être modifiés en direct dans l'interface du cosmoscope. Vous pouvez tester différentes valeurs avant de les reporter dans le fichier `config.yml` ; les valeurs définies dans le fichier sont rétablies à chaque rechargement du cosmoscope.

```yaml
graph_config:
  background_color: white
  highlight_color: red
  highlight_on_hover: true
  text_size: 9
  position:
    x: 0.5
    y: 0.5
  attraction:
    force: -50
    distance_max: 800
    verticale: 0
    verticale: 0
  arrows: false
```

`background_color`
: Couleur de fond du graphe.
: Exemple : `whitesmoke` ,`#ccc`, `rgb(57, 57, 57)`

`highlight_color`
: Couleur de surbrillance des éléments mis en sélection.
: Exemple : `red` ,`#0642ff `, `rgb(207, 52, 118)`

`text_size`
: Taille des étiquettes des nœuds. L'unité implicite est le pixel. La valeur minimale est `5` ; la valeur maximale est `15`.

`position`
: Position horizontale (`x`) et verticale (`y`) du centre du graphe. La valeur doit être comprise entre 0 (tout à gauche) et 1 (tout à droite).

`attraction`
: Paramètres de la simulation de forces entre les nœuds.
: `force` : puissance globale. Plus elle est faible, plus les liens entre les nœuds sont relâchés. Les valeurs supérieures à `-50` tendent à provoquer des collisions incessantes.
: `distance_max` : distance maximum entre les nœuds. Au-delà de `1000`, ce paramètre n'a pas d'effet mesurable.
: `verticale` : force d'attraction vers l'axe vertical. Une valeur de `0` signifie que ce paramètre est désactivée.
: `horizontale` : force d'attraction vers l'axe horizontal. Une valeur de `0` signifie que ce paramètre est désactivée.

`arrows`
: Affichage des flèches. Permet d'obtenir un graphe orienté ou non orienté. Valeur booléenne : `true` ou `false`.

## Paramètres facultatifs

Vous pouvez ajouter au fichier de configuration les paramètres suivants :

`minify`
: Réduit le poids du fichier `cosmoscope.html`, au détriment de la lisibilité du code source. Valeur : `true` ou `false`. Désactivé par défaut.

`custom_css`
: Applique les styles déclarés par l'utilisateur dans le fichier `/template/custom.css`. Valeur : `true` ou `false`. Désactivé par défaut.

`history`
: Exporte une copie du cosmoscope et de ses données dans un sous-dossier horodaté du dossier `history`. Valeur : `true` ou `false`. Activé par défaut.

<!-- Attention je crois qu'il est false par défaut, or ça devrait être l'inverse. -->

`metas`
: Liste de métadonnées ajoutées sous la forme de balises `meta` dans l'en-tête du fichier `cosmoscope.html`.

Exemple :

```yaml
metas:
  author: Prénom Nom
  keywords:
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

Modifier le chemin vers les fichiers sources :

```bash
node app import <chemin>
```

Modifier le chemin d'export du cosmoscope :

```bash
node app export <chemin>
```

Ajouter des types valides :

```bash
node app atype <nom> <couleur>
```

Créer le fichier de style personnalisé `custom.css` dans le répertoire `/template` :

```bash
node app css
```

Ajouter des vues :

```bash
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

<!-- L'indentation des mots-clés est-elle utile ? -->

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

```bash
node app record
```

La seconde est un *one-liner* qui permet de créer une fiche en une seule saisie :

```bash
node app autorecord <titre> <type> <mots-clés>
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

## Export

Pour créer le fichier `cosmoscope.html`, utilisez l'une de ces commandes :

```bash
node app modelize
node app
```

<!-- Quelle différence entre les deux ? -->

Le fichier `cosmoscope.html` est exporté dans le répertoire défini par `export_target` dans la configuration. Si le fichier existe déjà au même emplacement, il est écrasé.

Si le paramètre `history` a pour valeur `true`, un sous-répertoire horodaté est également créé dans le répertoire `/history` avec les contenus suivants :

- une copie du fichier `cosmoscope.html` ;
- un rapport `error.log` sur les erreurs éventuellement survenues durant le processus d'export ;
- un répertoire `data` contenant les fichiers `links.json` et `nodes.json`, respectivement la liste des liens et des nœuds, avec leurs métadonnées respectives.

Cet export facilite le partage des données et leur réutilisation dans d'autres logiciels de visualisation.

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

![](https://i.imgur.com/FZiYK5Y.jpg)

La modification des paramètres du graphe (`graph_config`) permet d'adapter l'affichage à la taille de l'écran.

<!-- Tableau taille écran / paramètres graphe -->

L'affichage est possible sur tous types d'écrans mais n'est pas adapté aux petits écrans (téléphones, petites tablettes).

## Personnalisation de l'interface

L'interface du cosmoscope est conçue à partir des fichiers HTML et CSS présents dans le dossier `/template` du répertoire de Cosma.

L'interface peut être personnalisée via un fichier `custom.css` placé dans ce même dossier. Vous pouvez créer manuellement le fichier ou bien exécuter la commande suivante :

```bash
node app css
```

Le paramètre `custom_css` de la configuration permet d'activer ou désactiver la prise en compte de ce fichier sans avoir à le supprimer.

Les déclarations CSS ajoutées dans `custom.css` remplacent celles présentes dans `/template/styles.css` et `/template/print.css` (pour les styles à l'impression). Elles s'appliquent au fichier `/template/template.njk`. Consultez ces fichiers ou utilisez l'inspecteur de votre navigateur web pour connaître les sélecteurs à utiliser pour telle ou telle déclaration. Les feuilles de style du cosmoscope utilisent notamment des variables CSS pour définir les couleurs et les polices utilisées. Vous pouvez redéfinir uniquement ces variables pour modifier tous les éléments d'interface auxquels elles s'appliquent.

<!-- Exemple -->

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

## Paramètres du graphe

Les contrôles situés dans cette section du panneau latéral gauche permettent de modifier l'affichage du graphe :

- affichage des liens ;
- affichage des étiquettes ;
- animation des nœuds au survol ;
- forces simulées par l'algorithme de dessin du graphe ;
- position du graphe dans l'espace ;
- taille du titre des nœuds.

Les modifications sont effacées à chaque nouveau chargement de la page. Pour les rendre permanentes, modifiez les valeurs par défaut définies sous `graph_config` dans la configuration.

## Graphe

Le graphe située dans la zone centrale de l'interface affiche des nœuds étiquetés et interreliés. Chaque nœud correspond à une fiche ; l'étiquette correspond au titre de la fiche. Les liens correspondent aux liens établis entre les fiches via leur identifiant entre doubles crochets.

Les nœuds sont organisés dans l'espace par un algorithme de simulation de forces. Une barre colorée sous le logo Cosma témoigne de l'état de la simulation. Cliquez dessus (raccourci : touche `Espace`) pour relancer la simulation.

::: astuce
Quelques pressions sur la touche `Espace` permettent de « déplier » progressivement les graphes les plus emmêlés.
:::

Les paramètres de la simulation sont accessibles via le panneau latéral gauche ; leur valeur par défaut peut être modifiée dans le fichier `config.yml`. Le graphe n'est pas figé, les nœuds peuvent donc être déplacés par cliquer-glisser. Mais ils restent soumis en permanence à la simulation de forces, donc il n'est pas possible de les disposer manuellement de manière arbitraire.

Survoler un nœud le met temporairement en surbrillance, ainsi que ses connexions. Cliquer sur un nœud le met en surbrillance, ainsi que ses connexions, et ouvre la fiche correspondante.

Vous pouvez zoomer dans le graphe à la souris, au pavé tactile, en double cliquant sur le fond du graphe ou bien avec les boutons dédiés situés en bas à gauche. Le bouton Recentrer (raccourci : touche `R`) réinitialise le zoom.

## Mode focus

Le bouton Activer le focus (raccourci : touche `F`) situé en bas à gauche du graphe permet de restreindre l'affichage au nœud sélectionné : en mode focus, seules les connexions directes à la fiche sélectionnée sont affichées dans l'interface. Le mode focus ne fonctionne que si vous avez sélectionné une fiche.

Le curseur qui apparaît sous le bouton Activer le focus permet de faire varier la distance d'affichage, jusqu'au maximum permis par le paramètre `focus_max` dans la configuration.

::: astuce
Le curseur du niveau de focus est contrôlable via les flèches du clavier. Vous pouvez enchaîner les raccourcis : `F` pour activer le focus, puis les flèches pour augmenter le niveau de focus.
:::

## Fiches

Les fiches peuvent êtres ouvertes en cliquant sur un nœud, une entrée de l'index, une suggestion du moteur de recherche, ou un lien dans le corps d'une fiche. Ouvrir une fiche affiche son contenu dans le panneau latéral droit. Cela met aussi à jour l'URL de la page avec l'identifiant de la fiche : ceci permet de naviguer entre les fiches visitées via les fonctionnalités Précédent / Suivant du navigateur, mais aussi de les retrouver dans l'historique ou encore d'obtenir un lien direct vers la fiche.

Cliquer sur le bouton « Fermer » referme le volet et désélectionne le nœud correspondant dans le graphe.

Les liens présents dans les fiches sont cliquables. Vous pouvez ouvrir ces liens dans un nouvel onglet via un clic droit. Le titre du lien (affiché en infobulle après 1-2 secondes de survol) est celui de la fiche correspondante.

En bas de la fiche se trouve une liste des fiches vers lesquelles elle renvoie (liens sortants), ainsi que des fiches qui pointent vers elles (liens entrants ou rétroliens). Les liens et rétroliens sont contextualisés : au survol, une infobulle s'affiche, montrant le paragraphe dans lequel ce lien se trouve dans la fiche correspondante.

# Développement

Cette partie de la documentation s'adresse à des développeurs expérimentés en JavaScript. Elle vous présente l'arborescence et les concepts sur lesquels reposent les *deux parties* formant Cosma, le cosmographe et le cosmoscope.

Nous vous recommandons vivement de lire le manuel d'utilisation pour bien saisir l'ensemble des usages en jeu dans le code source qui va vous être présenté ci-dessous.

## Architecture de Cosma

Cosma est principalement implémenté en JavaScript. Le logiciel repose sur deux systèmes distincts, le cosmographe et le cosmoscope.

Le **cosmographe** repose sur l'environnement Node.js. Une série de scripts permettent de :

- vérifier et actualiser le fichier de configuration ;
- générer des fichiers Markdown et leur entête ;
- scanner un répertoire pour en extraire les fichiers Markdown et analyser leur contenu (Markdown, métadonnées YAML et liens *wiki*) afin de générer :
	- des fichiers JSON ;
	- le cosmoscope (ses données et variables CSS).

Le **cosmoscope** est un fichier HTML exécuté sur navigateurs web, créé à partir d'un *template* [Nunjucks](https://mozilla.github.io/nunjucks/) (`template.njk`). Il intègre :

- les métadonnées web et styles issus de la configuration ;
- les scripts et bibliothèques JavaScript ;
- des index (mots-clés, titre de fiche, vues) ;
- les fiches.

Les liens ci-dessous présentent la liste exhaustive des fonctions de ces deux systèmes au sein du code source de Cosma :

- [Consulter l'API du cosmographe](./api/cosmographe/index.html)
- [Consulter l'API du cosmoscope](./api/cosmoscope/index.html)

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

## Le cosmoscope

Le cosmoscope est généré en trois temps, par trois fonctions implémentées dans le fichier `/functions/template.js`. Elles sont appelées au sein du fichier `/functions/modelize.js` d'où proviennent les intrants (données passées en paramètre).

1. La fonction [`jsonData()`](https://hyperotlet.github.io/cosma/api/cosmographe/global.html#jsonData) pour créer le fichier `/template/graph-data.js` contenant les données de modélisation du graphe, sa configuration et l'index des fiches.
2. La fonction [`colors`](https://hyperotlet.github.io/cosma/api/cosmographe/global.html#colors) pour créer le fichier `/template/colors.css` contenant les [variables CSS](https://developer.mozilla.org/fr/docs/Web/CSS/Using_CSS_custom_properties) et les règles associées selon la configuration des couleurs préscrite dans le fichier `config.yml` extraites.
3. La fonction [`cosmoscope`](https://hyperotlet.github.io/cosma/api/cosmographe/global.html#cosmoscope) s'appuyant sur le fichier de construction `/template/template.njk` pour intégrer l'ensemble des données des deux premiers fichiers créés (il inclut `colors.css` et `graph-data.js`) ainsi que des fichiers analysés.

Les données intégrées avec le fichier `graph-data.js` sont déterminantes pour l'ensemble des opérations du cosmoscope. Elles permettent d'abord de générer le graphe en étant affectées dans le fichier `/template/scripts/graph.js`. Elles permettent ensuite de coordonner les filtres et focus sur les nœuds.

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

