const fs = require('fs')
    , moment = require('moment');

if (fs.existsSync('history') === false) {
    fs.mkdirSync('history') }

const time = moment().format('YYYY-MM-DD_HH-mm');

if (fs.existsSync('history/' + time) === false) {
    fs.mkdirSync('history/' + time) }

if (fs.existsSync('history/' + time + '/data') === false) {
    fs.mkdirSync('history/' + time + '/data') }

const historyPath = 'history/' + time + '/';

exports.historyPath = historyPath;