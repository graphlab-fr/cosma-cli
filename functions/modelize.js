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
        .filter(file_name => path.extname(file_name) === '.md')
        .map(function(file) {
            const mTime = fs.statSync(config.files_origin + file).mtime;

            file = fs.readFileSync(config.files_origin + file, 'utf8')
            file = yamlFrontmatter.loadFront(file);
            let content = file.__content;
            delete file.__content;
            let metas = file;

            metas.mtime = moment(mTime).format('YYYY-MM-DD');

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

            if (file.metas.title === undefined) {
                let err = 'File ' + file.metas.title + ' throw out : no title';
                errors.push(err); console.log(err);
                return false; }

            fileIds.push(file.metas.id);

            return file;
        })
        .map(function(file) {

            return {
                content: file.content,
                metas: file.metas,
                links: file.links.filter(function(link) {
                    if (fileIds.indexOf(Number(link.aim)) === -1 || isNaN(link.aim) !== false) {
                        let err = 'Link "' + link.aim + '" removed from file "' + file.metas.title + '" : no valid target';
                        errors.push(err); console.log(err);
                        return false;
                    }
                    return true;
                })
            };
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