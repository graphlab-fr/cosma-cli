# Cosma CLI [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.5920616.svg)](https://doi.org/10.5281/zenodo.5920616)

**Cosma** is a document graph visualization tool. It modelizes interlinked Markdown files and renders them as an interactive network in a web interface.

Visit <https://cosma.graphlab.fr/en/about/> to learn more about the project.

This is the command-line interface (CLI) version of Cosma. It requires [NodeJS](https://nodejs.org/fr/) v12 or higher.

Run these commands to clone and edit the repository :

```bash
git clone --recurse-submodules https://github.com/graphlab-fr/cosma-cli cosma-cli
cd cosma-cli
npm i
node app modelize # cmd 'cosma modelize' -> 'node app modelize'
```

## Documentation

User documentation for Cosma CLI can be found at <https://cosma.graphlab.fr/en/docs>.

## History

The first version of Cosma was a CLI prototype developed during late 2020 and early 2021. We then worked on a GUI version with Electron, and in the process much of the code was changed. After publishing the GUI version as Cosma 1.0, we came back to the CLI prototype and worked on integrating all the changes. As a result, Cosma is available again as a CLI tool. Version 2.0 has been released in April 2023.

## What’s new

This section presents condensed notes for the latest release. To check all release notes, visit the [Changelog section of the documentation](https://cosma.graphlab.fr/en/docs/cli/user-manual/#changelog).

Version 2.0.0 adds the following main features:

- Manage multiple configurations (global and local)
- Use alternative syntax for links
- Display nodes in chronological mode
- Use images as thumbnails in the cosmoscope

As well as some improvements:

- Cosma now reads directories recursively (issue [#4](https://github.com/graphlab-fr/cosma/issues/4))
- Links in bibliography are now clickable
- More informative messages and logs
