/**
 * @file Analyse data to generate an Opensphère.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const fs = require('fs')
    , path = require('path')
    , { parse } = require("csv-parse/sync");

const Cosmoscope = require('../core/models/cosmoscope')
    , Record = require('../core/models/record')
    , Link = require('../core/models/link')
    , Template = require('../core/models/template')
    , Config = require('../core/models/config');

module.exports = function(recordsFilePath, linksFilePath, options) {
    let testExtname = new Set();
    for (const filePath of [recordsFilePath, linksFilePath]) {
        if (fs.existsSync(filePath) === false) {
            return console.error('\x1b[31m', 'Err.', '\x1b[0m', `Data file ${path.basename(filePath)} do not exist.`); }
        testExtname.add(path.extname(filePath))
    }

    if (testExtname.size !== 1) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', `Data files need the same extension.`); }

    const config = new Config();
    const {
        export_target: exportPath
    } = config.opts;

    options['citeproc'] = (!!options['citeproc'] && config.canCiteproc());
    options = Object.entries(options)
        .map(([name, value]) => { return { name, value } })
        .filter(({ value }) => value === true);
    const optionsTemplate = options
        .filter(({ name }) => Template.validParams.has(name))
        .map(({ name }) => name);

    switch (path.extname(recordsFilePath)) {
        case '.csv':
            try {
                Cosmoscope.getFromPathCsv(recordsFilePath, linksFilePath)
                    .then(([records, links]) => {
                        links = Link.formatedDatasetToLinks(links);
                        records = Record.formatedDatasetToRecords(records, links, config);

                        const graph = new Cosmoscope(records);
                        const { html } = new Template(graph, optionsTemplate);

                        fs.writeFile(exportPath + 'cosmoscope.html', html, (err) => {
                            if (err) {return console.error('Err.', '\x1b[0m', 'write Cosmoscope file : ' + err)}
                            console.log('\x1b[34m', 'Cosmoscope generated', '\x1b[0m', `(${graph.records.length} records)`)
                        });
                    })
                    .catch((err) => { throw err })
            } catch (error) {
                return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'CSV data file is invalid.');
            }
            break;

            default:
                return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Data file is not supported.');
    }
}