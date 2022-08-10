/**
 * @file Analyse data to generate an Opensphère.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const fs = require('fs')
    , path = require('path')
    , { parse } = require("csv-parse/sync");

const Opensphere = require('../core/models/opensphere');

module.exports = function(recordsFilePath, linksFilePath) {
    if (fs.existsSync(recordsFilePath) === false) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'CSV file (records data) does not exist.'); }
    if (fs.existsSync(linksFilePath) === false) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'CSV file (links data) does not exist.'); }

    const recordsFileContent = fs.readFileSync(recordsFilePath, 'utf-8');
    const recordsData = parse(recordsFileContent, { columns: true, skip_empty_lines: true });

    const linksFileContent = fs.readFileSync(linksFilePath, 'utf-8');
    const linksData = parse(linksFileContent, { columns: true, skip_empty_lines: true });
    
    const records = Opensphere.formatArrayRecords(recordsData);
    const links = Opensphere.formatArrayLinks(linksData);
    const opensphere = new Opensphere(records, links);
    // console.log(opensphere.config);
}