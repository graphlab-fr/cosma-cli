/**
 * @file Generate graph styles from config & cosmoscope from modelling.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const fs = require('fs')
    , nunjucks = require('nunjucks')
    , mdIt = require('markdown-it')()
    , mdItAttr = require('markdown-it-attrs')
    , linksTools = require('./links')
    , quoteTools = require('./quote')
    , moment = require('moment')
    , config = require('./verifconfig').config;

let types = {}
    , tags = {};

// markdown-it plugin
mdIt.use(mdItAttr, {
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: []
});

/**
 * Templating & create the Cosmoscope.html file
 * @param {array} files - All files array, for gen. records
 * @param {object} entities - Nodes and links, for gen graph
 * @param {string} historyPath - History save path
 */

function cosmoscope(files, entities, historyPath) {

    let citeprocMode = quoteTools.citeprocModeIsActive()
        , publishMode = puslishModeIsActive();

    nunjucks.configure('template', { autoescape: true });
    let htmlRender = nunjucks.render('template.njk', {

        publishMode: publishMode,

        // normalize files as records
        records: files.map(function (file) {
            file.content = linksTools.convertLinks(file.content, file);

            let bibliography = false;
            if (citeprocMode === true) {
                file.content = quoteTools.convertQuoteKeys(file.content, file.quoteKeys);
                bibliography = quoteTools.genBibliography(file.quoteKeys);
            }

            registerType(file.metas.type, file.metas.id);
            registerTags(file.metas.tags, file.metas.id);

            return {
                id: file.metas.id,
                title: file.metas.title,
                type: file.metas.type,
                tags: file.metas.tags.join(', '), // array to string
                mtime: file.metas.mtime,
                content: mdIt.render(file.content), // Mardown to HTML
                bibliography: bibliography,
                links: file.links,
                backlinks: file.backlinks
            }
        }).sort(function (a, b) { return a.title.localeCompare(b.title); }),

        // normalize views, tags and types
        views: config.views || [],
        types: Object.keys(types).map(function(type) {
            return { name: type, nodes: types[type] };
        }),
        tags: Object.keys(tags).map(function(tag) {
            return { name: tag, nodes: tags[tag] };
        }).sort(function (a, b) { return a.name.localeCompare(b.name); }),

        // normalize graph data & configuration 
        graph: {
            config: config.graph_config,
            data: JSON.stringify({nodes: entities.nodes, links: entities.links})
        },

        // join CSS global vars from config file
        colors: colors(),
        customCss: config.custom_css,
        
        // join metadatas from config file
        metas: config.metas,

        // if focus mode is active
        focusIsActive: !(config.focus_max <= 0),

        // count links
        nblinks: entities.links.length,

        // creation date
        date: moment().format('YYYY-MM-DD')
    });

    // minify the render, if 'true' from config file
    if (config.minify && config.minify === true) {
        const minifyHtml = require("@minify-html/js");
        htmlRender = minifyHtml.minify(htmlRender, minifyHtml.createConfiguration({ minifyJs: true, minifyCss: true }))
    }

    fs.writeFile(config.export_target + 'cosmoscope.html', htmlRender, (err) => { // Cosmoscope file for export folder
        if (err) {return console.error('Err.', '\x1b[0m', 'write Cosmoscope file : ' + err)}
        console.log('\x1b[34m', 'Cosmoscope generated', '\x1b[0m', `(${files.length} records)`)
    });

    if (!historyPath) { return; }

    fs.writeFile(historyPath + 'cosmoscope.html', htmlRender, (err) => { // Cosmoscope file for history
        if (err) {console.error('Err.', '\x1b[0m', 'save Cosmoscope into history : ' + err)}
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
 * If the prompt command contains flag --publish or -p
 * and the 'metas' from config is not undefined
 * @returns {boolean}
 */

function puslishModeIsActive() {
    const flag = process.argv[3];

    if (flag !== '--publish'
        && flag !== '-p')
    {
        return false;
    }

    if (config.metas !== undefined) {
        return true;
    }

    console.error('\x1b[33m', 'Publish mode off : no metas from config.', '\x1b[0m');
    return false;
}

/**
 * Templating & create stylesheet with types from config
 */

 function colors() {
    // get types from config

    const replacementColor = 'grey';
    let types;

    const typesRecord = Object.keys(config.record_types)
        .map(function(key) { return {prefix: 'n_', name: key, color: config.record_types[key] || replacementColor}; });

    const typesLinks = Object.keys(config.link_types)
        .map(function(key) { return {prefix: 'l_', name: key, color: config.link_types[key].color || replacementColor}; });

    types = typesRecord.concat(typesLinks);

    // map the CSS syntax

    let colorsStyles = types.map(type => `.${type.prefix}${type.name} {color:var(--${type.prefix}${type.name}); fill:var(--${type.prefix}${type.name}); stroke:var(--${type.prefix}${type.name});}`)

    // add specifics parametered colors from config
    types.push({prefix: '', name: 'highlight', color: config.graph_config.highlight_color});

    let globalsStyles = types.map(type => `--${type.prefix}${type.name}: ${type.color};`)

    globalsStyles = globalsStyles.join('\n'); // array to sting…
    colorsStyles = colorsStyles.join('\n'); // …by line breaks

    globalsStyles = ':root {\n' + globalsStyles + '\n}';

    return '\n' + globalsStyles + '\n\n' + colorsStyles;
}