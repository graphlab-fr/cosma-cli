const fs = require('fs')
    , pug = require('pug')
    , mdIt = require('markdown-it')()
    , mdItAttr = require('markdown-it-attrs')
    , linksTools = require('./links')
    , config = require('./verifconfig').config;

let types = {}
    , tags = {};

// markdown-it plugin for convertLinks()
mdIt.use(mdItAttr, {
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: []
})

/**
 * Templating & create mass data & config export for Cosmoscope's JavaScript processing
 * @param {object} nodes - All graph nodes
 * @param {object} links - All graph links
 */

function jsonData(nodes, links) {

    let allNodeIds = [];

    const index = nodes.map(function(node) {
        allNodeIds.push(node.id);
        return {id: node.id, title: node.label};
    });

    const graphScript =
`const allNodeIds = [${allNodeIds.join(',')}];

const fuse = new Fuse(${JSON.stringify(index)}, {
    includeScore: false,
    keys: ['title']
});

const forceProperties = ${JSON.stringify(config.graph_params)}

// load the data
let graph = ${JSON.stringify({nodes: nodes, links: links})};
initializeDisplay();
initializeSimulation();`;

    fs.writeFileSync('./template/graph-data.js', graphScript, (err) => {
        if (err) { return console.error( 'Err. write graph-data.js file : ' + err) }
        console.log('create graph-data.js file');
    });
}

exports.jsonData = jsonData;

/**
 * Templating & create stylesheet with types from config
 */

function colors() {
    // get types from config

    const nodesTypes = Object.keys(config.types).map(function(key) {
        return {prefix: 't_', name: key, color: config.types[key].color}; });

    const linksTypes = Object.keys(config.linkType).map(function(key) {
        return {prefix: 'l_', name: key, color: config.linkType[key].color}; });

    const types = nodesTypes.concat(linksTypes);

    // map the CSS syntax

    let globalsStyles = types.map(type => `--${type.name}: ${type.color};`)
    let colorsStyles = types.map(type => `.${type.prefix}${type.name} {color:var(--${type.name}); fill:var(--${type.name}); stroke:var(--${type.name});}`)

    globalsStyles.push(`--highlight: ${config.graph_params.highlightColor};`);

    globalsStyles = globalsStyles.join('\n'); // array to sting…
    colorsStyles = colorsStyles.join('\n'); // …by line breaks

    globalsStyles = ':root {\n' + globalsStyles + '\n}';

    const content = '\n' + globalsStyles + '\n\n' + colorsStyles;

    fs.writeFileSync('./template/colors.css', content, (err) => {
        if (err) { console.error( 'Err. write color style file: ' + err) }
    });
}

exports.colors = colors;

/**
 * Templating & create the Cosmoscope file
 * @param {array} files - All files array
 * @param {string} path - History save path
 */

function cosmoscope(files, path) {

    const htmlRender = pug.compileFile('template/scope.pug')({

        index: files.map(function (file) { // normalize files as records for Pug templating
            file.content = linksTools.convertLinks(file.content, file);
            registerType(file.metas.type, file.metas.id);
            registerTags(file.metas.tags, file.metas.id);

            return {
                id: file.metas.id,
                title: file.metas.title,
                type: file.metas.type,
                tags: file.metas.tags.join(', '), // array to string
                mtime: file.metas.mtime,
                content: mdIt.render(file.content), // Mardown to HTML
                links: file.links,
                backlinks: file.backlinks,
                radius: ((file.levels === null) ? [] : levelsToRadius(file.levels))
            }
        }),
        views: config.views || [],
        // objects to objects array
        types: Object.keys(types).map(function(type) {
            return { name: type, nodes: types[type].join(',') };
        }),
        tags: Object.keys(tags).map(function(tag) {
            return { name: tag, nodes: tags[tag].join(',') };
        })
    });

    fs.writeFile(path + 'cosmoscope.html', htmlRender, (err) => { // Cosmoscope file for history
        if (err) {console.error('Err.', '\x1b[0m', 'save Cosmoscope into history : ' + err)}
    });

    fs.writeFile(config.export_target + 'cosmoscope.html', htmlRender, (err) => { // Cosmoscope file for export folder
        if (err) {return console.error('Err.', '\x1b[0m', 'write Cosmoscope file : ' + err)}
        console.log('\x1b[34m', 'Cosmoscope generated', '\x1b[0m', `(${files.length} records)`)
    });
}

exports.cosmoscope = cosmoscope;

/**
 * Feed types object with file type
 * @param {array} fileType - File type
 * @param {int} fileId - File id
 */

function registerType(fileType, fileId) {
    // create associate object key for type if not exist
    if (types[fileType] === undefined) {
        types[fileType] = []; }
    // push the file id into associate object key
    types[fileType].push(fileId);
}

/**
 * Feed tags object with file tags
 * @param {array} fileTagList - Tags list
 * @param {int} fileId - File id
 */

function registerTags(fileTagList, fileId) {
    for (const tag of fileTagList) {
        // create associate object key for tag if not exist
        if (tags[tag] === undefined) {
            tags[tag] = []; }
        // push the file id into associate object key
        tags[tag].push(fileId);
    }
}

/**
 * Combining levels down to get radius fields
 * @param {array} levels - Array contain one array per level
 * @returns {array} - Array contain radius fields
 */

function levelsToRadius(levels) {
    for (let i = 1; i < levels.length; i++) {
        // take previous array and concat it with the actual
        levels[i] = levels[i].concat(levels[i - 1]);
    }
    return levels = levels.slice(1); // ignore first level, uncombined
}