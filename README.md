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
Les fichiers JSON sont générés dans le répertoire `/data`.

### Générer une nouvelle fiche

```bash
$ node app record
```
