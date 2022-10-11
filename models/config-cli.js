const path = require('path')
    , fs = require('fs');

const Config = require('../core/models/config');

const envPaths = require('env-paths');
const { data: envPathDataDir } = envPaths('cosma-cli', { suffix: '' });

module.exports = class ConfigCli extends Config {
    static pathConfigDir = envPathDataDir;
    static pathConfigFile = {
        fromConfigDir: path.join(ConfigCli.pathConfigDir, 'defaults.yml'),
        fromInstallationDir: path.join(__dirname, '../', 'defaults.yml'),
        fromExecutionDir: path.join(process.env.PWD, 'config.yml')
    }

    /**
     * Get the config file path that contains defaults options value
     * @returns {string}
     * @static
     */

    static getDefaultConfigFilePath() {
        if (fs.existsSync(ConfigCli.pathConfigFile.fromConfigDir)) {
            return ConfigCli.pathConfigFile.fromConfigDir;
        }
        return ConfigCli.pathConfigFile.fromInstallationDir;
    }

    /**
     * Get the config file path that contains options
     * from current dir (if there is a config.yml file) or defaults dir
     * @returns {string}
     * @static
     */

    static getConfigFilePath () {
        if (fs.existsSync(ConfigCli.pathConfigFile.fromExecutionDir)) {
            return configFileInExecutionDir;
        }
        return ConfigCli.getDefaultConfigFilePath();
    }

    /**
     * Get config options from the (config file) path
     * @param {string} configFilePath Path to a config file
     * @return {object} Config option or base config (Config.base) if errors
     * @throws {ErrorConfig} Will throw an error if config file can not be read or parse
     */

    static get(configFilePath) {
        if (configFilePath === undefined || fs.existsSync(configFilePath) === false) {
            configFilePath = ConfigCli.getConfigFilePath();
        }
        return Config.get(configFilePath);
    }

    /**
     * Get config options from the default config file
     * @return {object} Config option or base config (Config.base) if errors
     * @throws {ErrorConfig} Will throw an error if config file can not be read or parse
     */
    
    static getDefaultConfig() {
        return Config.get(ConfigCli.getDefaultConfigFilePath());
    }

    constructor(opts = {}) {
        const configFilePath = ConfigCli.getConfigFilePath();
        let configFromFile = Config.get(configFilePath);
        opts = Object.assign({}, configFromFile, opts);
        super(opts, configFilePath);
    }

    getConfigConsolMessage() {
        const { version } = require('../package.json');
        const messageSections = [
            `[Cosma v.${version}]`,
            (this.opts['name'] ? ['\x1b[4m', this.opts['name'], '\x1b[0m'].join('') : null),
            ['\x1b[2m', this.path, '\x1b[0m'].join('')
        ];
        return messageSections.join(' ');
    }
}