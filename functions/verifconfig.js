const fs = require('fs')
    , yamlEditor = require('js-yaml');

// Write config file if not exist

if (!fs.existsSync('config.yml')){
    let baseConfig = yamlEditor.safeDump({
        files_origin: '',
        export_target: '',
        types: ['undefined']
    });

    console.log('create config.yml file');

    fs.writeFileSync('config.yml', baseConfig, (err) => {
        if (err) { return console.error( 'Err. write config.yml file : ' + err) }
    });
}

// Read and export config

const config = yamlEditor.safeLoad(fs.readFileSync('config.yml', 'utf8'));

exports.config = config;

// Valid config values

if (!fs.existsSync(config.files_origin)) {
    console.error('You must specify a valid file path to your Markdown database file.');
    process.exit();
}

// Function for modify config

function modifyImportPath(path) {
    if (!fs.existsSync(path)) {
        console.log('You must specify a valid file path to your Markdown database file.');
        return;
    }

    config.files_origin = path;

    fs.writeFile('config.yml', yamlEditor.safeDump(config), (err) => {
        if (err) { return console.error( 'Err. update config.yml file : ' + err) }
        console.log('update file path from config.yml file');
    });
}

exports.modifyImportPath = modifyImportPath;

function modifyExportPath(path) {
    if (!fs.existsSync(path)) {
        console.log('You must specify a valid target to export in the configuration.');
        return;
    }

    config.export_target = path;

    fs.writeFile('config.yml', yamlEditor.safeDump(config), (err) => {
        if (err) { return console.error( 'Err. update config.yml file : ' + err) }
        console.log('update file path from config.yml file');
    });
}

exports.modifyExportPath = modifyExportPath;

function addType(types) {
    let newList = [];

    for (let type of types) {
        if (config.types.indexOf(type) !== -1) {
            console.log('Type "' + type + '" already registred');
            continue;
        }
        newList.push(type);
    }

    config.types = config.types.concat(newList);

    fs.writeFile('config.yml', yamlEditor.safeDump(config), (err) => {
        if (err) { return console.error( 'Err. update config.yml file : ' + err) }
        console.log('add ' + (newList.join(', ') || 'anything') + ' config.yml file');
    });
}

exports.addType = addType;