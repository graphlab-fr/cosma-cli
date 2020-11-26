const fs = require('fs')
    , yamlFrontmatter = require('yaml-front-matter')
    , yamlReader = require('js-yaml')
    , path = require('path')
    , edges = require('./functions/edges')
    , jsonify = require('./functions/jsonify')
    , rand = require('./functions/rand')
    , config = yamlReader.safeLoad(fs.readFileSync('config.yml', 'utf8'));

let id = 1
    , fileIds = []
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
                console.log('File ' + file.metas.title + ' throw out : no valid id');
                return false; }

            if (file.metas.title === undefined) {
                console.log('File ' + file.metas.title + ' throw out : no title');
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
                    console.log('Link "' + link + '" removed from file "' + file.metas.title + '" : no valid target');
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

if (fs.existsSync('./data') === false) {
    fs.mkdirSync('./data') }

fs.writeFile('./data/nodes.json', '[' + entities.nodes.join(',') + ']', (err) => {
    if (err) { return console.error( 'Err. write html file : ' + err) }
    console.log('create nodes.json file');
});

fs.writeFile('./data/edges.json', '[' + entities.edges.join(',') + ']', (err) => {
    if (err) { return console.error( 'Err. write html file : ' + err) }
    console.log('create edges.json file');
});

fs.writeFile('./data/sigma.json', jsonify.sigma(entities.nodes,entities.edges), (err) => {
    if (err) { return console.error( 'Err. write html file : ' + err) }
    console.log('create sigma.json file');
});