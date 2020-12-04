const fs = require('fs')
    , yamlFrontmatter = require('yaml-front-matter')
    , path = require('path')
    , edges = require('./edges')
    , jsonify = require('./jsonify')
    , dataGenerator = require('./data')
    , savePath = require('./history').historyPath
    , rand = require('./rand')
    , config = require('./verifconfig').config;

let id = 1
    , fileIds = []
    , errors = []
    , entities = { nodes: [], edges: [] }
    , files = fs.readdirSync(config.files_origin, 'utf8')
        .filter(file_name => path.extname(file_name) === '.md')
        .map(function(file) {
            file = fs.readFileSync(config.files_origin + file, 'utf8')
            file = yamlFrontmatter.loadFront(file);
            let content = file.__content;
            delete file.__content;
            let metas = file;

            return {
                content: content,
                metas: metas,
                links: edges.extractAll(content)
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
            let validLinks = [];

            for (let link of file.links) {
                if (fileIds.indexOf(Number(link)) !== -1 && isNaN(link) === false) {
                    validLinks.push(link);
                } else {
                    let err = 'Link "' + link + '" removed from file "' + file.metas.title + '" : no valid target';
                    errors.push(err); console.log(err);
                }
            }

            return {
                content: file.content,
                metas: file.metas,
                links: validLinks
            };
        })

const ids = files.map(file => file.links).flat();

for (let file of files) {
    let size = edges.getRank(ids, file.metas.id, file.links.length);
    entities.nodes.push(jsonify.node(file.metas.id, file.metas.title, file.metas.type, size * 10, rand.randFloat(40, 50), rand.randFloat(40, 50)));

    if (file.links.length !== 0) {
        for (let link of file.links) {
            entities.edges.push(jsonify.edge(id++, file.metas.id, link));
        }
    }
}

require('./template').cosmoscope(jsonify.d3(entities.nodes,entities.edges), savePath);

dataGenerator.nodes(entities.nodes, savePath);
dataGenerator.edges(entities.edges, savePath);
dataGenerator.forSigma(entities.nodes, entities.edges, savePath);
dataGenerator.forD3(entities.nodes, entities.edges, savePath);

require('./log').register(errors, savePath);