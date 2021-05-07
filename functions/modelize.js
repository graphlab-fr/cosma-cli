const fs = require('fs')
    , yamlFrontmatter = require('yaml-front-matter')
    , moment = require('moment')
    , path = require('path')
    , linksTools = require('./links')
    , logTools = require('./log')
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
            if (!file.metas.id || isNaN(file.metas.id) === true) {
                logs.err.push(`File ${file.metas.fileName} throw out : no valid id`);
                return false; }

            if (!file.metas.title) {
                logs.err.push(`File ${file.metas.fileName} throw out : no valid title`);
                return false; }

            if (fileIds.indexOf(file.metas.id) !== -1) {
                logs.err.push(`File ${file.metas.fileName} uses an identifier common to another file`); }

            fileIds.push(file.metas.id);

            return true;
        })
        .map(function(file) { // normalize metas
            // null or no registered types changed to "undefined"
            if (file.metas.type === null || config.record_types_list.indexOf(file.metas.type) === -1) {
                file.metas.type = 'undefined';
                logs.warn.push(`Type of file ${file.metas.fileName} changed to undefined : no registered type`);
            }

            file.metas.tags = file.metas.tags || [];

            // analysis file content by regex : get links target id
            file.links = linksTools.catchLinksFromContent(file.content)
            // throw links from/to unknown file id
                .filter(function(link) {
                    if (fileIds.indexOf(link.target.id) === -1 || isNaN(link.target.id) !== false) {
                        logs.warn.push(`The link "${link.target.id}" from file ${file.metas.fileName} has been ignored : no valid target`);
                        return false;
                    }

                    if (link.type !== 'undefined' && config.link_types_list.indexOf(link.type) === -1) {
                        logs.warn.push(`The link "${link.target.id}" type "${link.type}" from file ${file.metas.fileName} has been ignored : no registered type`);
                    }

                    return true;
                }).map(function(link) {
                    link.source = { id: file.metas.id };
                    return link
                });

            registerLinks(file);

            return file;
        });

delete fileIds;
// save & show : errors & warnings
logTools.show(logs);
logTools.register(logs, savePath);
delete logs;

files = files.map(function(file) {

    file.links = file.links.map(function(link) {
        const targetMetas = findFileMeta(link.target.id);
        return {
            type: link.type,
            context: link.context,
            target: {
                id: link.target.id,
                title: targetMetas.title,
                type: targetMetas.type
            },
            source: {
                id: link.source.id,
                title: file.metas.title,
                type: file.metas.type
            }
        };
    });

    file.backlinks = entities.links.filter(link => link.target === file.metas.id)
        .map(function(link) {
            const targetMetas = findFileMeta(link.source);
            return {
                type: link.type,
                context: link.context,
                target: {
                    id: link.source,
                    title: targetMetas.title,
                    type: targetMetas.type
                },
                source: {
                    id: link.target,
                    title: file.metas.title,
                    type: file.metas.type
                }
            };
        });

    file.focusLevels = ((config.focus_max === 0) ? null : getConnectionLevels(file.metas.id, config.focus_max));

    registerNodes(file);

    return file;
});

entities.links = entities.links.map(function(link) {
    delete link.context; return link;
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
        const style = getLinkStyle(link.type);

        entities.links.push({
            id: Number(id++),
            type: link.type,
            shape: style.shape,
            color: style.color,
            source: Number(link.source.id),
            target: Number(link.target.id),
            context: link.context
        });
    }
}

/**
 * Feed entities.nodes object with node object
 * @param {object} file - File after links & backlinks parsing
 */

function registerNodes(file) {
    const size = linksTools.getRank(file.links.length, file.backlinks.length);

    entities.nodes.push({
        id: Number(file.metas.id),
        label: file.metas.title,
        type: String(file.metas.type),
        size: Number(size),
        outLink: Number(file.links.length),
        inLink: Number(file.backlinks.length)
    });
}

/**
 * Find file metas by its id
 * @param {int} fileId - File after links & backlinks parsing
 */

function findFileMeta(fileId) {
    return title = files.find(function(file) {
        return file.metas.id === fileId;
    }).metas;
}

/**
 * Get dash/dotted values according to the link type
 * @param {string} linkType - Link type extract from his registration
 * @returns {object} - Dash/dotted values or null value
 */

function getLinkStyle(linkType) {
    const linkTypeConfig = config.link_types[linkType];
    let stroke, color;

    if (linkTypeConfig) {
        stroke = config.link_types[linkType].stroke;
        color = config.link_types[linkType].color;
    } else {
        stroke = 'simple';
        color = null;
    }

    switch (stroke) {
        case 'simple':
            return { shape: { stroke: stroke, dashInterval: null }, color: color };
            
        case 'double':
            return { shape: { stroke: stroke, dashInterval: null }, color: color };

        case 'dash':
            return { shape: { stroke: stroke, dashInterval: '4, 5' }, color: color };

        case 'dotted':
            return { shape: { stroke: stroke, dashInterval: '1, 3' }, color: color };
    }

    return { shape: { stroke: 'simple', dashInterval: null }, color: color };
}

/**
 * Find nodes connected around a single one on several levels
 * @param {int} nodeId - File id
 * @returns {array} - Contain one array per connection level
 */

function getConnectionLevels(nodeId, maxLevel) {

    let index = [[nodeId]];
    let idsList = [];

    for (let i = 0 ; i < maxLevel ; i++) {

        let level = [];
        
        // searching connections for each nodes from the last registred level
        for (const target of index[index.length - 1]) {
            let result = getConnectedIds(target);
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

function getConnectedIds(nodeId) {
    const links = entities.links;

    let sources = links.filter(edge => edge.source === nodeId).map(edge => edge.target);
    let targets = links.filter(edge => edge.target === nodeId).map(edge => edge.source);

    targets = targets.concat(sources);

    if (targets.length === 0) {
        return false; }

    return targets;
}