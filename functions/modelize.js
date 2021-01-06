const fs = require('fs')
    , yamlFrontmatter = require('yaml-front-matter')
    , moment = require('moment')
    , path = require('path')
    , edges = require('./edges')
    , dataGenerator = require('./data')
    , savePath = require('./history').historyPath
    , rand = require('./rand')
    , config = require('./verifconfig').config;

let id = 1
    , fileIds = []
    , errors = []
    , entities = { nodes: [], edges: [], indexEntry: [] }
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
    entities.nodes.push({
        id: Number(file.metas.id),
        label: file.metas.title,
        type: file.metas.type,
        size: Number(size),
        x: Number(rand.randFloat(40, 50)),
        y: Number(rand.randFloat(40, 50))
    });
    // entities.indexEntry.push(jsonify.record(file.metas.id, file.metas.title))

    if (file.links.length !== 0) {
        for (let link of file.links) {
            entities.edges.push({
                id: Number(id++),
                source: Number(file.metas.id),
                target: Number(link)
            });
        }
    }
}

require('./template').cosmoscope(entities.nodes, entities.edges, files, savePath);

dataGenerator.nodes(JSON.stringify(entities.nodes), savePath);
dataGenerator.edges(JSON.stringify(entities.edges), savePath);
// dataGenerator.index(entities.indexEntry, savePath);
// dataGenerator.forSigma(entities.nodes, entities.edges, savePath);
// dataGenerator.forD3(entities.nodes, entities.edges, savePath);

require('./log').register(errors, savePath);