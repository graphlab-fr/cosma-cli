const config = require('./verifconfig').config
    , readline = require('readline');

config.record_types_list = Object.keys(config.record_types);

// activate terminal questionnaire
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

config.record_types_list = Object.keys(config.record_types);
config.link_types_list = Object.keys(config.link_types);

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
                if (answer === '' || !config.record_types_list.includes(answer)) {
                    reject('Unknown type. Add it to config.yml beforehand.'); }

                resolve(answer);
            })
        })
    
        metas.tags = await new Promise((resolve, reject) => {
            rl.question('tags (facultative, between comas, no space) ? ', (answer) => { resolve(answer); })
        })
    
        require('./autorecord').genMdFile(metas.title, metas.type, metas.tags);
    } catch(err) {
        console.error('\x1b[31m', 'Err.', '\x1b[0m', err);
    }
    
    rl.close()
})()