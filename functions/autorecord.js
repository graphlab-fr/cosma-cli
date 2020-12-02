const fs = require('fs')
    , config = require('../app').config;

function genMdFile(title, category) {
    const content =
`---
title: ${title}
category: ${category}
---

`;

    fs.writeFile(config.files_origin + title + '.md', content, (err) => {
        if (err) { return console.error( 'Err. write html file : ' + err) }
        console.log('create ' + title + '.md file');
    });
}

exports.genMdFile = genMdFile;