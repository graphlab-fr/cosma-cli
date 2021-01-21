const fs = require('fs')
    , pug = require('pug')
    , mdIt = require('markdown-it')()
    , mdItAttr = require('markdown-it-attrs')
    , edges = require('./edges')
    , config = require('./verifconfig').config;

let types = {}
    , tags = {};

mdIt.use(mdItAttr, {
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: []
})

function jsonData(nodes, edges) {

    const index = nodes.map(function(node) {
        return {id: node.id, title: node.label};
    })

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
    const nodesTypes = Object.keys(config.types).map(function(key) {
        return {prefix: 't_', name: key, color: config.types[key].color}; });

    const linksTypes = Object.keys(config.linkType).map(function(key) {
        return {prefix: 'l_', name: key, color: config.linkType[key].color}; });

    const types = nodesTypes.concat(linksTypes);

    let globals = types.map(type => `--${type.name}: ${type.color};`)
    let colors = types.map(type => `.${type.prefix}${type.name} {color:var(--${type.name}); fill:var(--${type.name}); stroke:var(--${type.name});}`)

    globals.push(`--highlight: ${config.graph_params.highlightColor};`);

    globals = globals.join('\n');
    colors = colors.join('\n');

    globals = ':root {\n' + globals + '\n}';

    const content = '\n' + globals + '\n\n' + colors;

    fs.writeFileSync('./template/colors.css', content, (err) => {
        if (err) { console.error( 'Err. write color style file: ' + err) }
    });
}

exports.colors = colors;

function cosmoscope(files, path) {

    const htmlRender = pug.compileFile('template/scope.pug')({
        index: files.map(function (file) {

            file.content = convertLinks(file.content, file);
            registerType(file.metas.type, file.metas.id);
            registerTags(file.metas.tags, file.metas.id);

            return {
                id: file.metas.id,
                title: file.metas.title,
                type: file.metas.type,
                tags: file.metas.tags.join(', '),
                mtime: file.metas.mtime,
                content: mdIt.render(file.content),
                links: file.links,
                backlinks: file.backlinks
            }
        }),
        types: Object.keys(types).map(function(type) {
            return {name: type, nodes: types[type].join(',')};
        }),
        tags: Object.keys(tags).map(function(tag) {
            return {name: tag, nodes: tags[tag].join(',')};
        })
    });

    fs.writeFile(path + 'cosmoscope.html', htmlRender, (err) => {
        if (err) {console.error('Err.', '\x1b[0m', 'write Cosmoscope file : ' + err)}
    });

    if (fs.existsSync(config.export_target)) {
        fs.writeFile(config.export_target + 'cosmoscope.html', htmlRender, (err) => {
            if (err) {return console.error('Err.', '\x1b[0m', 'write Cosmoscope file : ' + err)}
            console.log('\x1b[34m', 'Cosmoscope generated', '\x1b[0m', `(${files.length} records)`)
        });
    } else {
        console.error('You must specify a valid target to export in the configuration.');
    }
}

exports.cosmoscope = cosmoscope;

function registerType(type, id) {
    if (types[type] === undefined) {
        types[type] = []; }

    types[type].push(id);
}

function registerTags(tagList, id) {
    for (const tag of tagList) {
        if (tags[tag] === undefined) {
            tags[tag] = []; }
    
        tags[tag].push(id);
    }
}

function convertLinks(content, file) {
    return content.replace(/(\[\[\s*).*?(\]\])/g, function(extract) {
        let link = extract.slice(0, -2).slice(2);
        link = edges.analyseLink(link);

        const validLinks = file.links.map(link => link.aim);

        if (validLinks.indexOf(Number(link.aim)) !== -1) {
            return `[${extract}](#){onclick=openRecord(${link.aim}) .id-link .l_${link.type}}`;
        }
        return extract;
    });
}