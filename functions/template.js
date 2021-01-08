const fs = require('fs')
    , pug = require('pug')
    , mdIt = require('markdown-it')()
    , mdItAttr = require('markdown-it-attrs')
    , config = require('./verifconfig').config;

mdIt.use(mdItAttr, {
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: []
})

function jsonData(nodes, edges) {
    const recordIndex = nodes.map(node => ({ id: node.id, title: node.label }));

    const graphScript =
`const fuse = new Fuse(${JSON.stringify(recordIndex)}, {
    includeScore: false,
    keys: ['title']
});

const forceProperties = ${JSON.stringify(config.graph_params)}

// load the data
let graph = ${JSON.stringify({nodes: nodes, links: edges})};
initializeDisplay();
initializeSimulation();`;

    fs.writeFileSync('./template/graph-data.js', graphScript, (err) => {
        if (err) { return console.error( 'Err. write graph-data.js file : ' + err) }
        console.log('create graph-data.js file');
    });
}

exports.jsonData = jsonData;

function colors() {
    let typeColors = Object.keys(config.types).map(key => '--' + key + ': ' + config.types[key].color + ';');
    typeColors = ':root {\n' + typeColors.join('\n') + '\n}';

    fs.writeFileSync('./template/colors.css', typeColors, (err) => {
        if (err) { console.error( 'Err. write color style file: ' + err) }
    });
}

exports.colors = colors;

function cosmoscope(files, path) {

    const htmlRender = pug.compileFile('template/scope.pug')({
        index: files.map(function (file) {
            file.content = file.content.replace(/(\[\[\s*).*?(\]\])/g, function(extract) {
                let id = extract.slice(0, -2); id = id.slice(2);
                return '[' + extract + '](#){onclick=openRecord(' + id + ') .id-link}';
            });

            return {
                id: file.metas.id,
                title: file.metas.title,
                type: file.metas.type,
                mtime: file.metas.mtime,
                content: mdIt.render(file.content),
                links: file.links,
                backlinks: file.backlinks
            }
        }),
        types: Object.keys(config.types).map(key => key)
    })

    fs.writeFile(path + 'cosmoscope.html', htmlRender, (err) => {
        if (err) { console.error( 'Err. write cosmographe file: ' + err) }
    });

    if (fs.existsSync(config.export_target)) {
        fs.writeFile(config.export_target + 'cosmoscope.html', htmlRender, (err) => {
            if (err) { console.error( 'Err. write cosmographe file: ' + err) }
            console.log('create cosmoscope.html file');
        });
    } else {
        console.error('You must specify a valid target to export in the configuration.');
    }
}

exports.cosmoscope = cosmoscope;