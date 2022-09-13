/**
 * @file Create several records from a JSON data file
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const fs = require('fs')
    , path = require('path')
    , { parse } = require("csv-parse/sync");

const Cosmoscope = require('../core/models/cosmoscope')
    , Record = require('../core/models/record');

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

            case '.csv':
                try {
                    data = parse(data, {
                        columns: true,
                        skip_empty_lines: true
                    }).map(line => Record.getFormatedDataFromCsvLine(line));
                } catch (error) {
                    return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'CSV data file is invalid.');
                }
                break;

                default:
                    return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Data file is not supported.');
        }

        const index = Cosmoscope.getIndexToMassSave();
        Record.massSave(data, index)
            .then(() => {
                return console.log('\x1b[34m', 'Records generated', '\x1b[0m', `(${data.length})`)
            })
            .catch((err) => {
                return console.error('\x1b[31m', 'Err.', '\x1b[0m', err);
            });
    })
}