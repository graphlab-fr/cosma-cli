const fs = require('fs')
    , path = require('path')
    , readline = require('readline');

const ConfigCli = require('../models/config-cli'),
    Config = require('../core/models/config');

module.exports = function(title, { global: isGlobal }) {
    if (fs.existsSync(ConfigCli.pathConfigFile.fromInstallationDir) === false) {
        const isOk = new Config(undefined, ConfigCli.pathConfigFile.fromInstallationDir).save();
        if (isOk === false) { log(isOk); }
    }
    if (isGlobal && fs.existsSync(ConfigCli.pathConfigDir) === false) {
        return console.log(
            ['\x1b[33m', 'Warn.', '\x1b[0m'].join(''),
            "Please make a user data directory with command",
            ['\x1b[1m', 'cosma --create-user-data-dir', '\x1b[0m'].join(''),
            "before make a global config file."
        );
    }
    if (ConfigCli.pathConfigFile.fromExecutionDir === ConfigCli.pathConfigFile.fromConfigDir) {
        isGlobal = true;
    }

    const isGlobalDefaultConfig = isGlobal && !title;
    let configFilePath, opts = Object.assign({}, ConfigCli.getDefaultConfig(), { name: title || '' });
    if (isGlobal) {
        configFilePath = path.join(ConfigCli.pathConfigDir, `${title || 'defaults'}.yml`);
    } else {
        configFilePath = ConfigCli.pathConfigFile.fromExecutionDir;
    }
    const { dir: configFileDir, base: configFileName } = path.parse(configFilePath);

    if (isGlobalDefaultConfig) { opts = Config.base; }

    if (fs.existsSync(configFilePath)) {
        rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question(`Do you want to overwrite '${configFileName}' ? (y/n) `, async (answer) => {
            if (answer === 'y') {
                const isOk = new Config(opts, configFilePath).save();
                log(isOk)
            }
            rl.close();
        })
    } else {
        const isOk = new Config(opts, configFilePath).save();
        log(isOk)
    }
    
    function log(isOk) {
        if (isOk) {
            console.log(['\x1b[32m', 'Config file created', '\x1b[0m'].join(''), `: ${['\x1b[2m', configFileDir, '/', '\x1b[0m', configFileName].join('')}`);
        } else {
            console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'can not save config file');
        }
    }
}