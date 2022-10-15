#!/usr/bin/env node

/**
 * @file Addressing of terminal commands.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const commander = require('commander')
    , program = new commander.Command()
    , { version, description } = require('./package.json');

const Config = require('./models/config-cli');

program.version(version);

program
    .name("cosma")
    .description(description)
    .usage("[command] [options]")
    .option('--create-user-data-dir', 'Set config file.')
    .option('-ls --list-projects', 'Get config files list.')
    .option('--use', 'Use config file from list.')
    .action(({ createUserDataDir, listProjects }) => {
        if (createUserDataDir) {
            require('./controllers/user-data-dir')();
        } else if (listProjects) {
            try {
                const list = Config.getConfigFileListFromConfigDir();
                console.table(list);
            } catch (err) {
                console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err.message);
            }
        } else {
            program.help(); // return full manual if no valid option is input
        }
    })
    .addHelpText('after',
`
Example call:
  $ cosma modelize --citeproc --custom-css
  $ cosma autorecord "My record" "concept" "tag 1,tag 2"
  $ cosma batch ~/Documents/data.json

For more information:
  $ cosma [command] --help`
)

program
    .command('config')
    .alias('c')
    .description('Generate configuration files.')
    .argument('[title]', 'Configuration name.')
    .option('-g --global', 'Set config file.')
    .action((title, options) => {
        require('./controllers/config')(title, options);
    })

program
    .command('modelize')
    .alias('m')
    .description('Generate a cosmoscope.')
    .option('-c, --config <name>', 'Set config file.')
    .option('-c, --citeproc', 'Process citations.')
    .option('-css, --custom-css', 'Apply custom CSS.')
    .option('--sample', "Generate a sample cosmoscope.")
    .option('--fake', "Generate a fake cosmoscope.")
    .action(({ config: configName, ...rest }) => {
        if (configName) {
            try {
                Config.setCurrentUsedConfigFileName(configName);
            } catch (err) {
                console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err.message);
            }
        }
        require('./controllers/modelize')(rest);
    })

program
    .command('record')
    .alias('r')
    .description('Create a record (form mode).')
    .option('-c, --config <name>', 'Set config file.')
    .action(({ config: configName }) => {
        if (configName) {
            try {
                Config.setCurrentUsedConfigFileName(configName);
            } catch (err) {
                console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err.message);
            }
        }
        console.log(new Config().getConfigConsolMessage());
        require('./controllers/record');
    })

program
    .command('autorecord')
    .alias('a')
    .description('Create a record (one-liner mode).')
    .argument('<title>', '(mandatory) Record title.')
    .argument('[type]', 'Record type (default: undefined).')
    .argument('[tags]', 'List of comma-separated tags.')
    .option('-c, --config <name>', 'Set config file.')
    .action((title, type, tags, { config: configName }) => {
        if (configName) {
            try {
                Config.setCurrentUsedConfigFileName(configName);
            } catch (err) {
                console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err.message);
            }
        }
        console.log(new Config().getConfigConsolMessage());
        require('./controllers/autorecord')(title, type, tags);
    })
    .showHelpAfterError('("autorecord --help" for additional information)')

program
    .command('batch')
    .alias('b')
    .description('Create records (batch mode).')
    .argument('[used-config]', 'Configuration name.')
    .argument('<file>', 'List of records to be created (path to JSON data file).')
    .option('-c, --config <name>', 'Set config file.')
    .action((filePath, { config: configName }) => {
        if (configName) {
            try {
                Config.setCurrentUsedConfigFileName(configName);
            } catch (err) {
                console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err.message);
            }
        }
        require('./controllers/batch')(filePath);
    })
    .showHelpAfterError('("batch --help" for additional information)')

program.showSuggestionAfterError();
program.parse();