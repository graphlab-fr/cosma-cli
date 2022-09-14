/**
 * @file Terminal form to ask user about record title, type & tags to create the formated Markdown file.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const Config = require('../core/models/config');
const readline = require('readline');

// activate terminal questionnaire
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

(async () => {
    const config = new Config();
    const recordTypesList = config.getTypesRecords();

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
                if (answer === '') { answer = 'undefined'; }
                if (recordTypesList.has(answer) === false && answer !== 'undefined') {
                    reject('Unknown type. Add it to config.yml beforehand.'); }

                resolve(answer);
            })
        })
    
        metas.tags = await new Promise((resolve, reject) => {
            rl.question('tags (facultative, between comas, no space) ? ', (answer) => { resolve(answer); })
        })

        rl.close();
    
        require('./autorecord')(metas.title, metas.type, metas.tags);
    } catch(err) {
        console.error('\x1b[31m', 'Err.', '\x1b[0m', err);
    }
})()