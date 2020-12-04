const fs = require('fs')
    , yamlReader = require('js-yaml');

if (!fs.existsSync('config.yml')){
    let config =
`# Path to your Mardown files base
files_origin:

# List of your valid types
types:
    - undefined`;

    fs.writeFileSync('config.yml', config, (err) => {
        if (err) { return console.error( 'Err. write config.yml file : ' + err) }
        console.log('create config.yml file');
    });
}

const config = yamlReader.safeLoad(fs.readFileSync('config.yml', 'utf8'));

if (!fs.existsSync(config.files_origin)){
    console.error('You must specify a valid file path to your Markdown database file.');
    process.exit();
}

exports.config = config;