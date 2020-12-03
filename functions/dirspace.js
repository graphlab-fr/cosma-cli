const fs = require('fs');

if (!fs.existsSync('data')){
    fs.mkdirSync('data');
}

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