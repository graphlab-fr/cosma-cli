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
    , errors = []
    , entities = { nodes: [], edges: [] }
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
                metas: metas,
                links: edges.getOutLinks(content)
            }
        })
        .filter(function(file) {
            if (file.metas.id === undefined || isNaN(file.metas.id) === true) {
                let err = 'File ' + file.metas.title + ' throw out : no valid id';
                errors.push(err); console.log(err);
                return false; }

            if (file.metas.title === null) {
                let err = 'File ' + file.metas.fileName + ' throw out : no title';
                errors.push(err); console.log(err);
                return false; }

            fileIds.push(file.metas.id);

            return file;
        })
        .map(function(file) {

            file.metas.type = file.metas.type || 'undefined';

            file.metas.tags = file.metas.tags || [];

            file.links = file.links.filter(function(link) {
                if (fileIds.indexOf(Number(link.aim)) === -1 || isNaN(link.aim) !== false) {
                    let err = 'A link has been removed from file "' + file.metas.title + '" : no valid target';
                    errors.push(err); console.log(err);
                    return false;
                }
                return true;
            })

            return file;
        })

delete fileIds;
require('./log').register(errors, savePath);
delete errors;

(function() {
    let id = 0;
    
    for (let file of files) {
        if (file.links.length === 0) { continue; }
    
        for (let link of file.links) {
            entities.edges.push({
                id: Number(id++),
                type: link.type,
                source: Number(file.metas.id),
                target: Number(link.aim)
            });
        }
    }
})()

files.map(function(file) {
    return file.backlinks = entities.edges.filter(function(edge) {
        if (edge.target === file.metas.id) {
            return true;
        }
    }).map(function(edge) {
        return {type: edge.type, aim: edge.source};
    });
})

let index = [];

for (let file of files) {
    const size = edges.getRank(file.links.length, file.backlinks.length);

    entities.nodes.push({
        id: Number(file.metas.id),
        label: file.metas.title,
        type: String(file.metas.type),
        size: Number(size),
        outLink: Number(file.links.length),
        inLink: Number(file.backlinks.length),
        x: Number(rand.randFloat(40, 50)),
        y: Number(rand.randFloat(40, 50))
    });

    index.push({
        id: Number(file.metas.id),
        title: file.metas.title
    });
}

exports.index = index;

require('./template').jsonData(entities.nodes, entities.edges);
require('./template').colors();
require('./template').cosmoscope(files, savePath);

dataGenerator.nodes(JSON.stringify(entities.nodes), savePath);
dataGenerator.edges(JSON.stringify(entities.edges), savePath);