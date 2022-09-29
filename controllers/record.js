/**
 * @file Terminal form to ask user about record title, type & tags to create the formated Markdown file.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const Config = require('../models/config-cli');
const readline = require('readline');

(async () => {
    const config = new Config();
    if (config.canSaveRecords() === false) {
        console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'Can not make a record file : files_origin option is not set into config.yml');
        return;
    }

    const recordTypesList = config.getTypesRecords();
    let metas = {};

    // activate terminal questionnaire
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    // questions :
    
    try {
        metas.title = await new Promise((resolve, reject) => {
            rl.question(`${['\x1b[1m', 'title', '\x1b[0m'].join('')} (obligatory) ? `, (answer) => {
                if (answer === '') {
                    reject('Title is obligatory'); }

                resolve(answer);
            })
        })
    
        metas.type = await new Promise((resolve, reject) => {
            rl.question(`${['\x1b[1m', 'type', '\x1b[0m'].join('')} (default = undefined) ? `, (answer) => {
                if (answer === '') { answer = 'undefined'; }
                if (recordTypesList.has(answer) === false && answer !== 'undefined') {
                    reject('Unknown type. Add it to config.yml beforehand.'); }

                resolve(answer);
            })
        })
    
        metas.tags = await new Promise((resolve, reject) => {
            rl.question(`${['\x1b[1m', 'tags', '\x1b[0m'].join('')} (facultative, between comas, no space) ? `, (answer) => { resolve(answer); })
        })

        rl.close();
    
        require('./autorecord')(metas.title, metas.type, metas.tags);
    } catch(err) {
        console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err);
        rl.close();
    }
})()