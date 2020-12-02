const fs = require('fs')
    , config = require('../app').config;

if (!fs.existsSync(config.files_origin)){
    console.error('You must specify a valid file path to your Markdown database file.');
    process.exit();
}