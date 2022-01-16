/**
 * @file Create record Mardown file from fields
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const Record = require('../core/models/record');

module.exports = function (title = '', type = 'undefined', tags = '') {
    const record = new Record(title, type, tags);

    const result = record.save();

    switch (result) {
        case true:
            console.log('\x1b[32m', 'record saved', '\x1b[0m', `: ${record.title}.md`);
            break;

        case false:
            console.error('\x1b[31m', 'Err.', '\x1b[0m');
            break;

        case 'overwriting':
            const readline = require('readline')
                , rl = readline.createInterface({ input: process.stdin, output: process.stdout });

            (async () => {
                new Promise((resolve, reject) => {
                    rl.question(`Do you want to overwrite '${record.title}.md' ? (y/n) `, (answer) => {
                        if (answer === 'y') { record.save(true); }
                        rl.close();
                    })
                })
            })();

            break;

        default:
            console.error('\x1b[31m', 'Err.', '\x1b[0m', result.join(' '));
            break;
    }

}