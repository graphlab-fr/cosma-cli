const fs = require('fs')
    , readline = require('readline')
    , config = require('../app').config;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

(async () => {
    let metas = {};
    
    metas.title = await new Promise((resolve, reject) => {
        rl.question('title ? ', (answer) => { resolve(answer) })
    })

    metas.category = await new Promise((resolve, reject) => {
        rl.question('category (default = undefined) ? ', (answer) => { resolve(answer) })
    })

    require('./autorecord').genMdFile(metas.title, metas.category);
    
    rl.close()
})()