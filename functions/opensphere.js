/**
 * @file Analyse data to generate an Opensphère.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const fs = require('fs')
    , path = require('path')
    , { parse } = require("csv-parse/sync");

const Opensphere = require('../core/models/opensphere');

module.exports = function(nodesFilePath, linksFilePath) {
    if (fs.existsSync(nodesFilePath) === false) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'CSV file (nodes data) does not exist.'); }
    if (fs.existsSync(linksFilePath) === false) {
        return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'CSV file (links data) does not exist.'); }

    const nodesFileContent = fs.readFileSync(nodesFilePath, 'utf-8');
    const nodesData = parse(nodesFileContent, { columns: true, skip_empty_lines: true });

    const linksFileContent = fs.readFileSync(linksFilePath, 'utf-8');
    const linksData = parse(linksFileContent, { columns: true, skip_empty_lines: true });
    
    const nodes = Opensphere.formatArrayNodes(nodesData);
    const links = Opensphere.formatArrayLinks(linksData);
    const opensphere = new Opensphere(nodes, links);
    // console.log(opensphere.config);
}