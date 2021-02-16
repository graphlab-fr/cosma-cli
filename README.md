![](CosmaLogo.png)

Cosma est un logiciel de visualisation et de lecture de graphe documentaire. Il permet de représenter des documents interreliés sous la forme d’un réseau interactif dans une interface web.

Il est possible d’utiliser Cosma avec une base documentaire déjà existante, pourvu que les documents contiennent les métadonnées nécessaires, au bon format.

---

On différencie deux logiciels au sein de Cosma :

- Le **Cosmographe** : Logiciel basé sur NodeJs analysant un répertoire contenant des fichiers Markdown pour rendre des fichiers de donneés et générer le Cosmoscope ;
- Le **Cosmoscope** : Fichier HTML à ouvrir avec un navigateur web et contenant la visualisation et une interface de lecture à partir de toutes les fiches analysées et validées par le Cosmographe.

# Installation

Pré-requis : installer [NodeJS](https://nodejs.org/fr/) version 12 ou supérieure.
## Téléchargement

Via la commande Git ci-dessous ou via le lien suivant (fichier à dezipper) : https://github.com/hyperotlet/cosma/archive/master.zip

```bash
git clone https://github.com/hyperotlet/graph-data-generator.git
```

Installer les dépendances nécessaires au bon fonctionnement de l'application :

```bash
cd graph-data-generator
npm i
```

## Configuration

Executer la commande suivante pour créer le fichier de configuration (`config.yml`).

```bash
node app
```

Compléter le fichier de configuration :

- `files_origin` : chemin vers le répertoire des fiches à traiter
- `export_target` : chemin vers le répertoire d'export du Cosmoscope
- `radiusMax` : nombre maximum d'échellons …
- `types` :
    - nom & couleur
    - …
- `hierarchy` : nom des types de liens et leur couleur
    - nom & couleur
    - …
- `graph_params`
    - `center` : position `x` et `y` du graphe dans la page
    - `charge` : s'il est `enabled`, on peut faire varier la distance entre les nœuds (`strength`), les distances minimum (`distanceMin`) et maximum (`distanceMax`)
    - `collide` : s'il est `enabled`, ?
    - `link` : modifier la couleur des liens (`color`) à la normale et quand ils sont mis en surbrillance (`highlightColor`). Aussi, si `enabled`, on peut faire varier la distance entre la longueur des liens (`distance`), le nombre d'itérations pour imposer ce paramètre (`iterations`) les distances minimum (`distanceMin`) et maximum (`distanceMax`)
    - `node` : doubler la taille des nœuds en inscrivant `sizeCoeff: 2`, ou tripler en inscrivant `3`
    - `forceX` & `forceY` : si `enabled`, ?

## Création des fichiers

Une fois le répertoire des fiches défini, vous pouvez y créer des fichiers Mardown avec l'une des commandes suivantes ou bien par tout autre moyen en respectant l'inscription ci-dessous.

```bash
node app record
node app autorecord <titre> <type> <tags>
```

`type` doit correspondre à l'un des types défini dans la liste de la configuration.

```
---
title: Titre du document
id: 20201209111625
type: undefined
tags:
  - tag 1
  - tag 2
---

Contenu du fichier en Mardown…
```

L'`id` doit être une suite de chiffres unique. 

# Graphe

Générez le Cosmoscope avec la commande suivante :

```bash
node app modelize
```

Le fichier `cosmoscope.html` est exporté dans le répertoire défini dans la configuration. Il faut l'ouvrir dans un navigateur web. Il est également placé dans le répertoire `/history` (dans un sous-répertoire portant la date du jour). Sont joints dans ce sous-répertoire des fichiers JSON contenant les données générés.

Dans le volet de gauche vous pourrez trouver :

- le **moteur de recherche**
- les **filtres** (correspondant à la liste des types de fiche) pour cacher tous les nœuds correspondants
- les **tags** (correspondant à l'ensemble des tags trouvés dans les fiches) pour mettre en surbrillance tous les nœuds correspondants
- l'**index** contenant la liste des fiches avec un tri dans l'ordre alphabétique et dans l'ordre de dernière éditon (et leur vers décroissante)
- les **paramètres du graphe** sont une série de leviers pour tester une configuration du graphe en direct
- des boutons pour **réinitialiser** l'affichage du graphe, **sauvegarder la vue** (la fiche activée ainsi que les filtres, l'isolement) sous forme d'une chaine à insérer dans la configuration (voir commandes sur la *vue*) et enfin la liste des *vues*

Ouvrir une fiche (par un clic sur le nœud, un lien via l'index, le moteur de recherche une autre fiche) permet de :

- lire son contenu
- voir la liste des nœuds connectés (graphiquement sur le graphe et sous forme de liste au bas de la fiche)
- isoler le nœud sur plusieurs échelles (dans le maximum prévu par le paramètre `radiusMax` de la configuration)

# Commandes

Modifier le chemin vers les fichiers sources

```bash
node app import <path>
```

Modifier le chemin d'export du Cosmoscope

```bash
node app export <path>
```

Ajouter des types valides

```bash
node app atype <name> <color>
```

Ajouter des vues

```bash
node app aview <name> <key>
```