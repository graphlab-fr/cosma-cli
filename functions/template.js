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

function cosmoscope(nodes, edges, files, path) {

    const d3Data = JSON.stringify({nodes: nodes, links: edges});

    let recordIndex = nodes.map(node => ({ id: node.id, title: node.label }));

    let typeColors = Object.keys(config.types).map(key => '--' + key + ': ' + config.types[key].color + ';');
    typeColors = ':root {\n' + typeColors.join('\n') + '\n}';
    
    fs.writeFileSync('./template/colors.css', typeColors, (err) => {
        if (err) { console.error( 'Err. write color style file: ' + err) }
    });

    const graphScript =
`const fuse = new Fuse(${JSON.stringify(recordIndex)}, {
    includeScore: false,
    keys: ['title']
});

const forceProperties = ${JSON.stringify(config.graph_params)}

// load the data
let graph = ${d3Data};
initializeDisplay();
initializeSimulation();`;
    
    fs.writeFile('./template/graph-data.js', graphScript, (err) => {
        if (err) { return console.error( 'Err. write graph-data.js file : ' + err) }
        console.log('create graph-data.js file');

        const htmlRender = pug.compileFile('template/scope.pug')({
            index: files.map(function (file) {
                let links = [];

                if (file.links.length !== 0) {
                    
                    for (let linkId of file.links) {
                        
                        for (var i = 0; i < recordIndex.length; i++) {
                            if (recordIndex[i].id !== Number(linkId)) { continue; }
                            links.push({id: linkId, title: recordIndex[i].title})
                        }
                    }
                }

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
                    links: links
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

    });
}

exports.cosmoscope = cosmoscope;