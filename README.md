# graph-data-generator

Pré-requis : installer [NodeJS](https://nodejs.org/fr/) version 12 ou supérieure.

## Téléchargement

```bash
$ git clone https://github.com/hyperotlet/graph-data-generator.git
```

## Configuration

Installer les dépendances nécessaires au bon fonctionnement de l'application :

```bash
$ cd graph-data-generator
$ npm i
```

Dans le fichier `config.yml`, remplacer la valeur de `files_origin` par le chemin du répertoire de fiches à traiter.

## Utilisation

### Générer le graphe

```bash
$ node app modelize
```

Le fichier `cosmographe.html` contient la visualisation. Il faut l'ouvrir dans un navigateur web.
Il est placé dans le répertoire `/history` (dans un sous-répertoire portant la date du jour).
Sont joints dans ce sous-répertoire des fichiers JSON contenant les données générés.

### Générer une nouvelle fiche

```bash
$ node app record
```

```bash
$ node app autorecord <titre> <categorie> <tags>
```