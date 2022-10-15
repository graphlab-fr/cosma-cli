const fs = require('fs');

const Config = require('../models/config-cli');

module.exports = function() {
    if (fs.existsSync(Config.pathConfigDir)) {
        console.log('Cosma user data directory already exists at', ['\x1b[2m', Config.pathConfigDir, '\x1b[0m'].join(''));
    } else {
        fs.mkdir(Config.pathConfigDir, (err) => {
            if (err) {
                console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'can not make Cosma user data directory : ' + err);
            }
            console.log(['\x1b[32m', 'Cosma user data directory was made at', '\x1b[0m'].join(''), ['\x1b[2m', Config.pathConfigDir, '\x1b[0m'].join(''));
        })
    }
}
