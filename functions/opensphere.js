/**
 * @file Analyse data to generate an Opensphère.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const fs = require('fs')
    , path = require('path')
    , { parse } = require("csv-parse/sync");

const Opensphere = require('../core/models/opensphere')
    , Template = require('../core/models/template');

module.exports = function(recordsFilePath, linksFilePath) {
    if (fs.existsSync(recordsFilePath) === false) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'CSV file (records data) does not exist.'); }
    if (fs.existsSync(linksFilePath) === false) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'CSV file (links data) does not exist.'); }

    const recordsFileContent = fs.readFileSync(recordsFilePath, 'utf-8');
    const recordsData = parse(recordsFileContent, { columns: true, skip_empty_lines: true });

    const linksFileContent = fs.readFileSync(linksFilePath, 'utf-8');
    const linksData = parse(linksFileContent, { columns: true, skip_empty_lines: true });
    
    const links = Opensphere.formatArrayLinks(linksData);
    const records = Opensphere.formatArrayRecords(recordsData, links);
    const opensphere = new Opensphere(records, links, undefined);
    const { html } = new Template(opensphere);

    fs.writeFile('./cosmoscope.html', html, (err) => { // Cosmoscope file for export folder
        if (err) {return console.error('Err.', '\x1b[0m', 'write Cosmoscope file : ' + err)}
        // console.log('\x1b[34m', 'Cosmoscope generated', '\x1b[0m', `(${graph.files.length} records)`)
    });
}