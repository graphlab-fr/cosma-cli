/**
 * @file Display and write errors & warnings from 'modelize.js'.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const fs = require('fs')
    , historyPath = require('./history')
    , time = require('./time');

/**
 * Show errors & warnings into terminal (limited lines)
 * @param {object} logs - Objets contain errors & warnings arrays
 */

function show(logs) {

    const errors = logs.err;
    const warnings = logs.warn;

    // if array contain more than 3 errors/warnings : do not list, just note the number of elements

    if (errors.length <= 3) {
        for (const err of errors) {
            console.error('\x1b[31m', 'Err.', '\x1b[0m', err); }
    } else {
        console.error('\x1b[31m', 'Err.', '\x1b[0m', `${errors.length} errors are recorded`);
    }

    if (warnings.length <= 3) {
        for (const warn of warnings) {
            console.error('\x1b[33m', 'Warn.', '\x1b[0m', warn); }
    } else {
        console.error('\x1b[33m', 'Warn.', '\x1b[0m', `${warnings.length} warnings are recorded`);
    }
}

exports.show = show;

/**
 * Templating & create the logs file into history
 * @param {object} logs - Objets contain errors & warnings arrays
 */

function register(logs) {

    if (logs.err.length === 0 && logs.warn.length === 0) { return; }

    logs.err = logs.err.map(err => '\n- Err : ' + err);
    logs.warn = logs.warn.map(warn => '\n- Warn : ' + warn);
    logs = logs.err.concat(logs.warn);

    let content = time;
    content += logs.join('');

    historyPath.createFolder();
    fs.writeFile(`history/${time}/error.log`, content, (err) => {
        if (err) { return console.error( 'Err. write error.log file : ' + err) }
    });
}

exports.register = register;