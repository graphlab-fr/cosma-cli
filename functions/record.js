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
                    reject('Unknown category. Add it to config.yml beforehand. No record was created.'); }

                resolve(answer);
            })
        })

        createRecord(metas.title, metas.category);
    } catch(error) {
        console.log(error);
    }
    
    rl.close()
})()

require('./autorecord').genMdFile(title, category);