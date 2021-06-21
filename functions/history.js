/**
 * @file Create folders for save the export.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const fs = require('fs')
    , time = require('./time');

/**
 * Create history folder for current process
 */

function createFolder() {
    if (fs.existsSync('history') === false) {
        fs.mkdirSync('history') }

        // create time folder
        if (fs.existsSync('history/' + time) === false) {
            fs.mkdirSync('history/' + time) }
}

exports.createFolder = createFolder;

/**
 * Create data (JSON files) history folder for current process
 */

function createFolderData() {

    createFolder();

    // create data folder
    if (fs.existsSync('history/' + time + '/data') === false) {
        fs.mkdirSync('history/' + time + '/data') }
}

exports.createFolderData = createFolderData;