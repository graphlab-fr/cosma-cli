const fs = require('fs')
    , Graph = require('graphology')
    , forceAtlas2 = require('graphology-layout-forceatlas2')
    , yamlFrontmatter = require('yaml-front-matter')
    , yamlReader = require('js-yaml')
    , path = require('path')
    , edges = require('./functions/edges')
    , jsonify = require('./functions/jsonify')
    , rand = require('./functions/rand')
    , config = yamlReader.safeLoad(fs.readFileSync('config.yml', 'utf8'));

let id = 1
    , graph = new Graph()
    , entities = { nodes: [], edges: [] }
    , files = fs.readdirSync(config.files_origin, 'utf8')
        .filter(file_name => path.extname(file_name) === '.md')
        .map(function(file) {
            file = fs.readFileSync(config.files_origin + file, 'utf8')
            file = yamlFrontmatter.loadFront(file);
            let content = file.__content;
            delete file.__content;
            let metas = file;

            return file = {
                content: content,
                metas: metas,
                links: edges.extractAll(content)
            }
        })

for (let file of files) {
    let size = edges.getRank(files.map(file => file.links).flat(), file.metas.id, file.links.length);
    entities.nodes.push({id: file.metas.id, label: file.metas.title, size: size * 10, x: rand.randFloat(40, 50), y: rand.randFloat(40, 50)});

    graph.addNode(file.metas.id, {
        label: file.metas.title,
        size: size * 10,
        x: rand.randFloat(10, 20),
        y: rand.randFloat(10, 20)
    });

    if (file.links.length !== 0) {
        for (let link of file.links) {
            entities.edges.push(jsonify.edge(id++, file.metas.id, link));
        }
    }
}

const cardinalNodes = forceAtlas2(graph, {
    iterations: 50,
    settings: {
      gravity: 10
    }
});

let ix = 0;
for (let prop in cardinalNodes) {
    // console.log(`${property}: ${cardinalNodes[property]}`);
    let x = cardinalNodes[prop]['x']
        , y = cardinalNodes[prop]['y']

    console.log(entities.nodes[ix]);

    entities.nodes[ix] = jsonify.node(entities.nodes[ix].id, entities.nodes[ix].label, entities.nodes[ix].size, x, y)

    ix++;
}



if (fs.existsSync('./data') === false) {
    fs.mkdirSync('./data') }

    console.log(entities.nodes);

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