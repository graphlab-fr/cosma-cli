const fs = require('fs')
    , moment = require('moment')
    , config = require('./verifconfig').config
    , yamlEditor = require('js-yaml');

function genMdFile(title, type, tags) {

    const validTypes = Object.keys(config.types).map(key => key);

    if (type !== '' && validTypes.indexOf(type) === -1) {
        console.log('Unknown type. Add it to config.yml beforehand.');
        return;
    }

    if (tags !== '') {
        tags = tags.split(",");
    } else {
        tags =  undefined;
    }

    let content = yamlEditor.safeDump({
        title: title,
        id: Number(moment().format('YYYYMMDDHHmmss')),
        type: type || 'undefined',
        tags: tags || ''
    });

    content = '---\n' + content + '---\n\n';

    fs.writeFile(config.files_origin + title + '.md', content, (err) => {
        if (err) { return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'register record file : ' + err) }
        console.log('\x1b[32m', 'record saved', '\x1b[0m', `: ${title}.md`)
    });
}

exports.genMdFile = genMdFile;