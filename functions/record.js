const fs = require('fs')
    , readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

(async () => {
    let metas = {};
    
    try {
        metas.title = await new Promise((resolve, reject) => {
            rl.question('title (obligatory) ? ', (answer) => {
                if (answer === '') {
                    reject('Title is obligatory'); }

                resolve(answer);
            })
        })
    
        metas.type = await new Promise((resolve, reject) => {
            rl.question('type (default = undefined) ? ', (answer) => { resolve(answer); })
        })
    
        metas.tags = await new Promise((resolve, reject) => {
            rl.question('tags (facultative, between comas, no space) ? ', (answer) => { resolve(answer); })
        })
    
        require('./autorecord').genMdFile(metas.title, metas.type, metas.tags);
    } catch(error) {
        console.log(error);
    }
    
    rl.close()
})()