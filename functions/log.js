const fs = require('fs')
    , moment = require('moment');

function register(errorList, path) {
    if (errorList.length === 0) { return; }

    errorList = errorList.join('\n  - ');
    errorList = '\n  - ' + errorList;

    errorList = moment().format('YYYY-MM-DD_HH-mm-ss') + errorList;

    fs.writeFileSync(path + 'error.log', errorList, (err) => {
        if (err) { return console.error( 'Err. write error.log file : ' + err) }
        console.log('create error.log file');
    });
}

exports.register = register;