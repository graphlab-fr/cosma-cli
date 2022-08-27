/**
 * @file Analyse data to generate an Opensphère.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const fs = require('fs')
    , { parse } = require("csv-parse/sync");

const Opensphere = require('../core/models/opensphere')
    , Template = require('../core/models/template')
    , Config = require('../core/models/config');

module.exports = function(recordsFilePath, linksFilePath, options) {
    if (fs.existsSync(recordsFilePath) === false) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'CSV file (records data) does not exist.'); }
    if (fs.existsSync(linksFilePath) === false) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'CSV file (links data) does not exist.'); }

    let recordsData, linksData;
    try {
        const recordsFileContent = fs.readFileSync(recordsFilePath, 'utf-8');
        recordsData = parse(recordsFileContent, { columns: true, skip_empty_lines: true });

        const linksFileContent = fs.readFileSync(linksFilePath, 'utf-8');
        linksData = parse(linksFileContent, { columns: true, skip_empty_lines: true });
    } catch (error) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'read / parse CSV files : ' + error);
    }

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
    
    const links = Opensphere.formatArrayLinks(linksData);
    const records = Opensphere.formatArrayRecords(recordsData, links);
    const opensphere = new Opensphere(records);
    const { html } = new Template(opensphere, optionsTemplate);

    fs.writeFile(exportPath + 'opensphere.html', html, (err) => { // Opensphere file for export folder
        if (err) {return console.error('Err.', '\x1b[0m', 'write Cosmoscope file : ' + err)}
    });
}