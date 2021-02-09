const fs = require('fs')
    , yamlFrontmatter = require('yaml-front-matter')
    , moment = require('moment')
    , path = require('path')
    , edges = require('./edges')
    , savePath = require('./history').historyPath
    , config = require('./verifconfig').config;

let fileIds = []
    , logs = { warn: [], err: [] }
    , entities = { nodes: [], links: [] }
    , id = 0
    , files = fs.readdirSync(config.files_origin, 'utf8') // files name list
        .filter(fileName => path.extname(fileName) === '.md') // throw no .md file
        .map(function(file) { // file analysis
            const mTime = fs.statSync(config.files_origin + file).mtime; // last modif date
            const fileName = file;

            file = fs.readFileSync(config.files_origin + file, 'utf8')
            // yamlfontmater extract = file metas
            file = yamlFrontmatter.loadFront(file);
            // file content extract
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
        .filter(function(file) { // throw files with bad metas
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
        .map(function(file) { // normalize metas
            // null or wrong type change to "undefined"
            if (file.metas.type === null || Object.keys(config.types).indexOf(file.metas.type) === -1) {
                file.metas.type = 'undefined';
                logs.warn.push('Type of ' + file.metas.title + ' changed to undefined');
            }

            file.metas.tags = file.metas.tags || [];

            // analysis file content by regex : get links
            file.links = edges.getOutLinks(file.content)
            // throw links from/to unknown file id
                .filter(function(link) {
                    if (fileIds.indexOf(Number(link.aim)) === -1 || isNaN(link.aim) !== false) {
                        let warn = 'A link has been removed from file "' + file.metas.title + '" : no valid target';
                        logs.warn.push(warn);
                        return false;
                    }
                return true;
                });

            registerLinks(file);

            return file;
        });

delete fileIds;
require('./log').register(logs, savePath); // save errors & warnings
delete logs;

files = files.map(function(file) {

    file.links.map(function(link) {
        return link.aimName = findFileName(link.aim)
    });

    file.backlinks = entities.links.filter(function(edge) {
        if (edge.target === file.metas.id) {
            return true;
        }
    }).map(function(edge) {
        return {type: edge.type, aim: edge.source, aimName: findFileName(edge.source)};
    });

    file.radius = getNodeRadius(file.metas.id);

    registerNodes(file);

    return file;
});

// generate the Cosmoscope
require('./template').jsonData(entities.nodes, entities.links);
require('./template').colors();
require('./template').cosmoscope(files, savePath);

// generate data files
fs.writeFile(savePath + 'data/nodes.json', JSON.stringify(entities.nodes), (err) => {
    if (err) {console.error('\x1b[31m', 'Err.', '\x1b[0m', 'write nodes.json file : ' + err) } });
fs.writeFile(savePath + 'data/links.json', JSON.stringify(entities.links), (err) => {
    if (err) {console.error('\x1b[31m', 'Err.', '\x1b[0m', 'write links.json file : ' + err) } });

/**
 * Feed entities.edges object with link object
 * @param {object} file - File after links parsing
 */

function registerLinks(file) {
    if (file.links.length === 0) { return; }

    for (const link of file.links) {
        entities.links.push({
            id: Number(id++),
            type: link.type,
            source: Number(file.metas.id),
            target: Number(link.aim)
        });
    }
}

/**
 * Feed entities.nodes object with node object
 * @param {object} file - File after links & backlinks parsing
 */

function registerNodes(file) {
    const size = edges.getRank(file.links.length, file.backlinks.length);

    entities.nodes.push({
        id: Number(file.metas.id),
        label: file.metas.title,
        type: String(file.metas.type),
        size: Number(size),
        outLink: Number(file.links.length),
        inLink: Number(file.backlinks.length),
        x: Number(randFloat(40, 50)),
        y: Number(randFloat(40, 50))
    });
}

/**
 * Find file title by its id
 * @param {int} fileId - File after links & backlinks parsing
 */

function findFileName(fileId) {
    return title = files.find(function(file) {
        return file.metas.id === fileId;
    }).metas.title;
}

/**
 * Find nodes connected around a single one on several levels
 * @param {int} nodeId - File id
 * @returns {array} - Contain one array per radius level
 */

function getNodeRadius(nodeId) {

    // config.radius.max = number of levels
    if (config.radius.max === 0) { return []; }

    let index = [[nodeId]];
    let idsList = [];

    for (let i = 0 ; i < config.radius.max ; i++) {

        let level = [];
        
        // searching connections for each nodes from the last registred level
        for (const target of index[index.length - 1]) {
            let result = getTargets(target);
            if (result === false) { continue; } // node have not connections

            // throw ids already registered in an other level
            result = result.filter(target => idsList.indexOf(target) === -1);

            level = level.concat(result);
        }

        // stop : current level contain any connection
        if (level.length === 0) { break; }

        // ignore duplicated ids
        level = level.filter((item, index) => {
            return level.indexOf(item) === index
        });

        index.push(level);
        idsList = index.flat();
    }

    return index;
}

/**
 * Get connected links & backlinks from a node
 * @param {int} nodeId - File id
 * @returns {array} - Links and backlinks ids list
 */

function getTargets(nodeId) {
    const links = entities.links;

    let sources = links.filter(edge => edge.source === nodeId).map(edge => edge.target);
    let targets = links.filter(edge => edge.target === nodeId).map(edge => edge.source);

    targets = targets.concat(sources);

    if (targets.length === 0) {
        return false; }

    return targets;
}

/**
 * Get a random decimal number
 * @param {int} max - Number max
 * @param {int} min - Number min
 * @returns {float} - Decimal number
 */

function randFloat(max, min = 0) {
    return Math.random() * (max - min) + min;
}