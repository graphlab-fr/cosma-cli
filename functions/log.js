/**
 * @file Display and write errors & warnings from 'modelize.js'.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const fs = require('fs')
    , historyPath = require('./history')
    , time = require('./time');

const Graph = require('../cosma-core/models/graph');

/**
 * Show report on console and history directory
 * @param {object} graphReport - report prop. from Graph class
 */

module.exports = function (graphReport) {

    let msg = [];

    for (const reportSection in graphReport) {
        if (graphReport[reportSection].length === 0) {
            delete graphReport[reportSection];
            continue;
        }

        msg.push(`${reportSection} (${graphReport[reportSection].length})`);
    }

    if (Object.keys(graphReport).length === 0) { return; }

    historyPath.createFolder();
    fs.writeFile(`history/${time}/error.log`, Graph.reportToSentences(graphReport), (err) => {
        if (err) { return console.error( 'Err. write error.log file : ' + err) }
    });

    console.error('\x1b[33m', 'Warn.', '\x1b[0m', msg.join(', '));
}