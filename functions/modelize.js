const fs = require('fs')
    , yamlFrontmatter = require('yaml-front-matter')
    , moment = require('moment')
    , path = require('path')
    , edges = require('./edges')
    , dataGenerator = require('./data')
    , savePath = require('./history').historyPath
    , rand = require('./rand')
    , config = require('./verifconfig').config;

let fileIds = []
    , logs = { warn: [], err: [] }
    , entities = { nodes: [], edges: [] }
    , id = 0
    , files = fs.readdirSync(config.files_origin, 'utf8')
        .filter(fileName => path.extname(fileName) === '.md')
        .map(function(file) {
            const mTime = fs.statSync(config.files_origin + file).mtime;
            const fileName = file;

            file = fs.readFileSync(config.files_origin + file, 'utf8')
            file = yamlFrontmatter.loadFront(file);
            let content = file.__content;
            delete file.__content;
            let metas = file;

            metas.mtime = moment(mTime).format('YYYY-MM-DD');
            metas.fileName = fileName;

            return {
                content: content,
                metas: metas
            }
        })
        .filter(function(file) {
            if (file.metas.id === undefined || isNaN(file.metas.id) === true) {
                let err = 'File ' + file.metas.title + ' throw out : no valid id';
                logs.err.push(err);
                return false; }

            if (file.metas.title === null) {
                let err = 'File ' + file.metas.fileName + ' throw out : no title';
                logs.err.push(err);
                return false; }

            fileIds.push(file.metas.id);

            return file;
        })
        .map(function(file) {

            if (file.metas.type === null || Object.keys(config.types).indexOf(file.metas.type) === -1) {
                file.metas.type = 'undefined';

                let err = 'Type of ' + file.metas.title + ' changed to undefined';
                logs.warn.push(err);
            }

            file.metas.tags = file.metas.tags || [];

            file.links = edges.getOutLinks(file.content)
                .filter(function(link) {
                    if (fileIds.indexOf(Number(link.aim)) === -1 || isNaN(link.aim) !== false) {
                        let err = 'A link has been removed from file "' + file.metas.title + '" : no valid target';
                        logs.warn.push(err);
                        return false;
                    }
                return true;
                });

            registerLinks(file);

            return file;
        });

delete fileIds;
require('./log').register(logs, savePath);
delete logs;

files = files.map(function(file) {

    file.links.map(function(link) {
        return link.aimName = findLinkName(link.aim)
    });

    file.backlinks = entities.edges.filter(function(edge) {
        if (edge.target === file.metas.id) {
            return true;
        }
    }).map(function(edge) {
        return {type: edge.type, aim: edge.source, aimName: findLinkName(edge.source)};
    });

    registerNodes(file);

    file.radius = getNodeRadius(file.metas.id);

    return file;
});

function registerLinks(file) {
    if (file.links.length === 0) { return; }

    for (const link of file.links) {
        entities.edges.push({
            id: Number(id++),
            type: link.type,
            source: Number(file.metas.id),
            target: Number(link.aim)
        });
    }
}

function registerNodes(file) {
    const size = edges.getRank(file.links.length, file.backlinks.length);
    const radius = 8;

    entities.nodes.push({
        id: Number(file.metas.id),
        label: file.metas.title,
        type: String(file.metas.type),
        size: Number(size),
        outLink: Number(file.links.length),
        inLink: Number(file.backlinks.length),
        radius: Number(radius),
        x: Number(rand.randFloat(40, 50)),
        y: Number(rand.randFloat(40, 50))
    });
}

function findLinkName(linkAim) {
    return title = files.find(function(file) {
        return file.metas.id === linkAim;
    }).metas.title;
}

function getNodeRadius(nodeId) {

    let result = getTargets(nodeId);

    if (result === false) { return []; }

    let index = [result];
    let flatIndex = [];

    for (let i = 0; ; i++) {

        let niv = [];
        
        for (const target of index[index.length - 1]) {

            result = getTargets(target);

            if (result === false) { continue; }
            result = result.filter(target => flatIndex.indexOf(target) === -1)

            niv = niv.concat(result);
        }

        if (niv.length === 0 ) { break; }

        index.push(niv);
        flatIndex = index.flat();
    }

    return index;
}

function getTargets(nodeId) {
    const edges = entities.edges;

    let targets = edges.filter(edge => edge.source === nodeId).map(edge => edge.target);

    if (targets.length === 0) {
        return false; }

    return targets;
}

require('./template').jsonData(entities.nodes, entities.edges);
require('./template').colors();
require('./template').cosmoscope(files, savePath);

dataGenerator.nodes(JSON.stringify(entities.nodes), savePath);
dataGenerator.edges(JSON.stringify(entities.edges), savePath);