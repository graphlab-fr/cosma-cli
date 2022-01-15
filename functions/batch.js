/**
 * @file Create several records from a JSON data file
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const fs = require('fs')
    , path = require('path');

const Record = require('../cosma-core/models/record');

module.exports = function (filePath) {
    if (fs.existsSync(filePath) === false) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Data file do not exist.'); }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Can not read data file.'); }

        switch (path.extname(filePath)) {
            case '.json':
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'JSON data file is invalid.');
                }
                break;

                default:
                    return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Data file is not supported.');
        }

        for (const item in data) {
            if (data[item].title === undefined) {
                return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Data schema is invalid'); }
        }

        const result = Record.massSave(data);

        if (result !== true) {
            return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Data file invalid items : ', result.join(',')); }
    })
}