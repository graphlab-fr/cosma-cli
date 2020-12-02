const fs = require('fs')
    , moment = require('moment')
    , config = require('../app').config;

function genMdFile(title, category) {

    if (category === '') {
        category = 'undefined'; }

    if (category !== 'undefined' && config.categories.indexOf(category) === -1) {
        console.log('Unknown category. Add it to config.yml beforehand. No record was created.');
        return;
    }

    const content =
`---
title: ${title}
id: ${moment().format('YYYYMMDDhmmss')}
category: ${category}
---

`;

    fs.writeFile(config.files_origin + title + '.md', content, (err) => {
        if (err) { return console.error( 'Err. write html file : ' + err) }
        console.log('create ' + title + '.md file');
    });
}

exports.genMdFile = genMdFile;