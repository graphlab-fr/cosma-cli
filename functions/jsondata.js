/**
 * @file Create several records from a JSON data file
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const fs = require('fs');

const Record = require('../cosma-core/models/record');

module.exports = function (filePath) {
    if (fs.existsSync(filePath) === false) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'JSON data file do not exist.'); }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Can not read JSON data file.'); }

        try {
            data = JSON.parse(data);
        } catch (error) {
            return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'JSON data file is invalid.');
        }

        for (const item in data) {
            if (data[item].title === undefined) {
                return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'JSON file data schema is invalid'); }
        }

        const result = Record.massSave(data);

        if (result !== true) {
            return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'JSON file data invalid items : ', result.join(',')); }
    })
}

let file, data;

