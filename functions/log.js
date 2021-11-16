/**
 * @file Display and write errors & warnings from 'modelize.js'.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const fs = require('fs')
    , historyPath = require('./history')
    , time = require('./time');

/**
 * Show report on console and history directory
 * @param {object} graphReport - report prop. from Graph class
 */

module.exports = function (graphReport) {

    let msg = []
        , file = [];

    for (const reportSection in graphReport) {
        if (graphReport[reportSection].length === 0) { continue; }

        msg.push(`${reportSection} (${graphReport[reportSection].length})`);

        file = file.concat(graphReport[reportSection]);
    }

    file = file.map(msg => `\n- ${msg}`);
    file.unshift(`${time}\n`);
    file = file.join('');

    historyPath.createFolder();
    fs.writeFile(`history/${time}/error.log`, file, (err) => {
        if (err) { return console.error( 'Err. write error.log file : ' + err) }
    });

    console.error('\x1b[33m', 'Warn.', '\x1b[0m', msg.join(', '));
}