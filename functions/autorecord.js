const fs = require('fs')
    , moment = require('moment')
    , config = require('./verifconfig').config
    , yamlEditor = require('js-yaml');

/**
 * Generate Mardown record
 * @param {string} title - Record title.
 * @param {string} type - Record type.
 * @param {string} tags - Record tags, seperated by comas witout spaces.
 */

config.record_types_list = Object.keys(config.record_types);
config.link_types_list = Object.keys(config.link_types);

function genMdFile(title, type, tags) {

    if (!title) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Enter a record title.'); }

    if (!type) {
        type = ''
    } else if (config.record_types_list.indexOf(type) === -1) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Unknown type. Add it to config.yml beforehand.');
    }

    if (!tags) {
        tags = '';
    } else {
        tags = tags.split(",");
    }

    // write yamlfrontmatter

    let content = yamlEditor.safeDump({
        title: title,
        id: Number(moment().format('YYYYMMDDHHmmss')),
        type: type,
        tags: tags
    });

    content = '---\n' + content + '---\n\n';

    fs.writeFile(config.files_origin + title + '.md', content, (err) => {
        if (err) { return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'register record file : ' + err) }
        console.log('\x1b[32m', 'record saved', '\x1b[0m', `: ${title}.md`)
    });
}

exports.genMdFile = genMdFile;