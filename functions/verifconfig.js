const fs = require('fs')
    , yamlEditor = require('js-yaml');

// Write config file if not exist

if (!fs.existsSync('config.yml')){
    let baseConfig = yamlEditor.safeDump({
        files_origin: '',
        export_target: '',
        types: {'undefined': {'color': 'grey'}},
        linkType: {'undefined': {'color': 'grey'}},
        graph_params: {
            center: { x: 0.5, y: 0.5 },
            charge: { enabled: true, strength: -50, distanceMin: 1, distanceMax: 500 },
            collide: { enabled: true, strength: 0.7, iterations: 1, radius: 5 },
            link: { enabled: true, distance: 1, iterations: 1 },
            node: { sizeCoeff: 1 },
            forceX: { enabled: true, strength: 0.1, x: 0.5 },
            forceY: { enabled: true, strength: 0.1, y: 0.5 },
            highlightColor: 'red'
        }
    });

    console.log('create config.yml file');

    fs.writeFileSync('config.yml', baseConfig, (err) => {
        if (err) { return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'write config.yml file : ' + err) }
    });
}

// Read config

const config = yamlEditor.safeLoad(fs.readFileSync('config.yml', 'utf8'));

// Valid & export config values

if (config.files_origin === undefined
    || config.export_target === undefined
    || config.types === undefined
    || config.graph_params === undefined) {

    console.error('\x1b[31m', 'Err.', '\x1b[0m', 'The config is not complete. Check it, or reboot.')
    process.exit();
}

if (!fs.existsSync(config.files_origin)) {
    console.error('\x1b[31m', 'Err.', '\x1b[0m', 'You must specify a valid file path to your Markdown database file.');
    process.exit();
}

exports.config = config;

// Function for modify config

function modifyImportPath(path) {
    if (!fs.existsSync(path)) {
        console.error('\x1b[31m', 'Err.', '\x1b[0m', 'You must specify a valid file path to your Markdown database file.');
        return;
    }

    config.files_origin = path;

    fs.writeFile('config.yml', yamlEditor.safeDump(config), (err) => {
        if (err) { return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'update config.yml file : ' + err); }
        console.log('\x1b[32m', 'config updated', '\x1b[0m', ': import path')
    });
}

exports.modifyImportPath = modifyImportPath;

function modifyExportPath(path) {
    if (!fs.existsSync(path)) {
        console.error('\x1b[31m', 'Err.', '\x1b[0m', 'You must specify a valid target to export in the configuration.');
        return;
    }

    config.export_target = path;

    fs.writeFile('config.yml', yamlEditor.safeDump(config), (err) => {
        if (err) { return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'update config.yml file : ' + err); }
        console.log('\x1b[32m', 'config updated', '\x1b[0m', ': export path')
    });
}

exports.modifyExportPath = modifyExportPath;

function addType(name, color) {

    for (const yetType in config.types) {
        if (name === yetType) {
            console.error('\x1b[31m', 'Err.', '\x1b[0m', `Type "${yetType}" already registred`);
            return;
        }
    }

    config.types[name] = {color: color};

    fs.writeFile('config.yml', yamlEditor.safeDump(config), (err) => {
        if (err) { return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'update config.yml file : ' + err); }
        console.log('add "' + name + '" type into config.yml file');
        console.log('\x1b[32m', 'config updated', '\x1b[0m', ': type ' + name)
    });
}

exports.addType = addType;