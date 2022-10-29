/**
 * @file Create record Mardown file from fields
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const readline = require('readline')
    , path = require('path');

const Record = require('../core/models/record')
    , Config = require('../models/config-cli');

module.exports = function (title = '', type = 'undefined', tags = '') {
    const config = new Config();
    if (config.canSaveRecords() === false) {
        console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'Unable to create record: missing value for files_origin in the configuration file');
        return;
    }

    type = type.split(',').map(t => t.trim());
    tags = tags.split(',').map(t => t.trim());

    const unknowedTypes = [];
    for (const t of type) {
        if (config.getTypesLinks().has(type)) {
            continue;
        }
        config.opts.record_types = { // add unknown type to the config for generate file
            ...config.opts.record_types,
            [t]: config.opts.record_types.undefined
        };
        unknowedTypes.push(t);
    }
    if (unknowedTypes.length > 0) {
        console.log(
            ['\x1b[33m', 'Warn.', '\x1b[0m'].join(''),
            (unknowedTypes.length === 1 ? `type "${unknowedTypes[0]}" is` : `types "${unknowedTypes.join('","')}" are`),
            `not set in the configuration, will treat as "undefined"`
        );
    }

    const record = new Record(undefined, title, type, tags, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, config.opts);
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
                                console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err.message);
                            }
                        }
                        rl.close();
                    })
                    return;
                case 'no dir':
                case 'fs error':
                case 'report':
                default:
                    console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), message);
                    return;
            }
        });

    function logRecordIsSaved() {
        const { dir: fileDir, base: fileName } = path.parse(record.path);
        console.log(['\x1b[32m', 'Record created', '\x1b[0m'].join(''), `: ${['\x1b[2m', fileDir, '/', '\x1b[0m', fileName].join('')}`);
    }
}