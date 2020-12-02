const fs = require('fs')
    , yamlReader = require('js-yaml');

require('./functions/dirspace');

const args = process.argv.slice(2)
    , config = yamlReader.safeLoad(fs.readFileSync('config.yml', 'utf8'));

exports.config = config;

require('./functions/verifconfig');

switch (args[0]) {
    case 'modelize':
        require('./functions/modelize');
    break;

    case 'record':
        require('./functions/record');
    break;

    case 'autorecord':
        require('./functions/autorecord').genMdFile(args[1], args[2], args[3]);
    break;

    case undefined:
        console.log('Please, choose an action');
    break;

    default:
        console.log('Unknow command "' + args.join(' ') + '"');
    break;
}