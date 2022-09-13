/**
 * @file Create record Mardown file from fields
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const readline = require('readline');

const Record = require('../core/models/record');

module.exports = function (title = '', type = 'undefined', tags = '') {
    const record = new Record(undefined, title, type, tags);

    record.saveAsFile()
        .then(() => {
            logRecordIsSaved();
        })
        .catch((err) => {
            const { message, type } = err;
            switch (type) {
                case 'overwriting':
                    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
                    rl.question(`Do you want to overwrite '${record.title}.md' ? (y/n) `, async (answer) => {
                        if (answer === 'y') {
                            try {
                                await record.saveAsFile(true);
                                logRecordIsSaved();
                            } catch (err) {
                                console.error('\x1b[31m', 'Err.', '\x1b[0m', err.message);
                            }
                        }
                        rl.close();
                    })
                    return;
                case 'fs error':
                case 'report':
                default:
                    console.error('\x1b[31m', 'Err.', '\x1b[0m', message);
                    return;
            }
        });

    function logRecordIsSaved() {
        console.log('\x1b[32m', 'record saved', '\x1b[0m', `: ${record.title}.md`);
    }
}