const fs = require('fs')
    , config = require('./verifconfig').config
    , readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout }) // activate terminal questionnaire
    , validTypes = Object.keys(config.types).map(key => key);

(async () => {
    let metas = {};

    // questions :
    
    try {
        metas.title = await new Promise((resolve, reject) => {
            rl.question('title (obligatory) ? ', (answer) => {
                if (answer === '') {
                    reject('Title is obligatory'); }

                resolve(answer);
            })
        })
    
        metas.type = await new Promise((resolve, reject) => {
            rl.question('type (default = undefined) ? ', (answer) => {
                if (answer !== '' && validTypes.indexOf(answer) === -1) {
                    reject('Unknown type. Add it to config.yml beforehand.'); }

                resolve(answer);
            })
        })
    
        metas.tags = await new Promise((resolve, reject) => {
            rl.question('tags (facultative, between comas, no space) ? ', (answer) => { resolve(answer); })
        })

        console.log(metas.title, metas.type, metas.tags);
    
        require('./autorecord').genMdFile(metas.title, metas.type, metas.tags);
    } catch(err) {
        console.error('\x1b[31m', 'Err.', '\x1b[0m', err);
    }
    
    rl.close()
})()