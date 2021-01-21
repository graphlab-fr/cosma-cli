const fs = require('fs')
    , moment = require('moment');

function show(logs) {

    const errors = logs.err;
    const warnings = logs.warn;

    if (errors.length <= 3) {
        for (const err of errors) {
            console.error('\x1b[31m', 'Err.', '\x1b[0m', err);
        }
    } else {
        console.error('\x1b[31m', 'Err.', '\x1b[0m', `${errors.length} are recorded`);
    }

    if (warnings.length <= 3) {
        for (const warn of warnings) {
            console.error('\x1b[33m', 'Warn.', '\x1b[0m', warn);
        }
    } else {
        console.error('\x1b[33m', 'Warn.', '\x1b[0m', `${errors.length} are recorded`);
    }

}

function register(logs, path) {
    
    show(logs);

    logs.err = logs.err.map(err => 'Err : ' + err);
    logs.warn = logs.warn.map(warn => 'Warn : ' + warn);

    let content = logs.err.concat(logs.warn);
    content = content.join('\n  - ');
    content = '\n  - ' + content;

    content = moment().format('YYYY-MM-DD_HH-mm-ss') + content;

    fs.writeFileSync(path + 'error.log', content, (err) => {
        if (err) { return console.error( 'Err. write error.log file : ' + err) }
        console.log('create error.log file');
    });
}

exports.register = register;