const fs = require('fs')
    , readline = require('readline')
    , config = require('../app').config;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

(async () => {
    let metas = {};
    
    try {
        metas.title = await new Promise((resolve, reject) => {
            rl.question('title ? ', (answer) => { resolve(answer) })
        })

        metas.category = await new Promise((resolve, reject) => {
            rl.question('category (default = undefined) ? ', (answer) => {
                if (answer === '') {
                    resolve('undefined'); }

                if (config.categories.indexOf(answer) === -1) {
                    reject('Unknow category, add it in config'); }

                resolve(answer);
            })
        })

        createRecord(metas.title, metas.category);
    } catch(error) {
        console.log(error);
    }
    
    rl.close()
})()

function createRecord(title, category) {
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