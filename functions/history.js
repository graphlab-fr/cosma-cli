const fs = require('fs')
    , moment = require('moment')
    , time = moment().format('YYYY-MM-DD_HH-mm')
    , config = require('./verifconfig').config;

if (config.history === false) {
    exports.historyPath = false;
    return;
}

// create history folder
if (fs.existsSync('history') === false) {
    fs.mkdirSync('history') }

    // create time folder
    if (fs.existsSync('history/' + time) === false) {
        fs.mkdirSync('history/' + time) }

        // create data folder
        if (fs.existsSync('history/' + time + '/data') === false) {
            fs.mkdirSync('history/' + time + '/data') }

// history path during the generation process
const historyPath = 'history/' + time + '/';

exports.historyPath = historyPath;