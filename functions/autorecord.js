const fs = require('fs')
    , moment = require('moment')
    , config = require('../app').config;

function genMdFile(title, type, tags) {

    if (type !== '' && config.types.indexOf(type) === -1) {
        console.log('Unknown type. Add it to config.yml beforehand. No record was created.');
        return;
    }

    if (tags !== '') {
        tags = tags.split(",").join('\n  - ');
        tags = '\n  - ' + tags;
    }

    const content =
`---
title: ${title}
id: ${moment().format('YYYYMMDDhmmss')}
type: ${type || 'undefined'}
tags: ${tags || ''}
---

`;

    fs.writeFile(config.files_origin + title + '.md', content, (err) => {
        if (err) { return console.error( 'Err. write html file : ' + err) }
        console.log('create ' + title + '.md file');
    });
}

exports.genMdFile = genMdFile;