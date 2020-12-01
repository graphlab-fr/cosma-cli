const fs = require('fs')
    , yamlReader = require('js-yaml');

const args = process.argv.slice(2)
    , config = yamlReader.safeLoad(fs.readFileSync('config.yml', 'utf8'));

exports.config = config;

switch (args[0]) {
    case 'modelize':
        require('./functions/modelize');
    break;
        
    case 'record':
        require('./functions/record');
    break;

    case undefined:
        console.log('Please, choose an action');
    break;

    default:
        console.log('Unknow command "' + args + '"');
    break;
}