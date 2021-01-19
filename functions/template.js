const fs = require('fs')
    , pug = require('pug')
    , mdIt = require('markdown-it')()
    , mdItAttr = require('markdown-it-attrs')
    , edges = require('./edges')
    , config = require('./verifconfig').config
    , index = require('./modelize').index;

mdIt.use(mdItAttr, {
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: []
})

function jsonData(nodes, edges) {

    const graphScript =
`const fuse = new Fuse(${JSON.stringify(index)}, {
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
    let typeColorsGlobal = Object.keys(config.types).map(key => '--' + key + ': ' + config.types[key].color + ';');
    typeColorsGlobal.push(`--highlight: ${config.graph_params.highlightColor};`)
    typeColorsGlobal = ':root {\n' + typeColorsGlobal.join('\n') + '\n}';

    let typeColors = Object.keys(config.types).map(function(key) {
        const v = 'var(--' + key + ')';
        return `.t_${key} {color:${v}; fill:${v}; stroke:${v};}`;
    }).join('\n');

    const content = typeColorsGlobal + '\n\n' + typeColors;

    fs.writeFileSync('./template/colors.css', content, (err) => {
        if (err) { console.error( 'Err. write color style file: ' + err) }
    });
}

exports.colors = colors;

function cosmoscope(files, path) {

    const htmlRender = pug.compileFile('template/scope.pug')({
        index: files.map(function (file) {
            file.content = file.content.replace(/(\[\[\s*).*?(\]\])/g, function(extract) {
                let link = extract.slice(0, -2).slice(2);
                link = edges.analyseLink(link);

                const validLinks = file.links.map(link => link.aim);

                if (validLinks.indexOf(Number(link.aim)) !== -1) {
                    return `[${extract}](#){onclick=openRecord(${link.aim} .id-link .l_${link.type}}`;
                }
                return extract;
            });

            return {
                id: file.metas.id,
                title: file.metas.title,
                type: file.metas.type,
                mtime: file.metas.mtime,
                content: mdIt.render(file.content),
                links: file.links.map(link => findLinkName(link)),
                backlinks: file.backlinks.map(link => findLinkName(link))
            }
        }),
        types: Object.keys(config.types).map(function(key) {
            return {
                name: key,
                nodes: files.filter(file => file.metas.type === key).map(file => file.metas.id).join(',') || null
            }
        })
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

function findLinkName(link) {
    let title = index.find(function(node) {
        return node.id === link.aim;
    }).title;

    return {id: link.aim, title: title, type: link.type};
}