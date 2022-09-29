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
    .action(({ createUserDataDir }) => {
        if (createUserDataDir !== true) {
            program.help(); // return full manual if no valid option is input
            return;
        }
        const fs = require('fs');
        if (fs.existsSync(Config.pathConfigDir)) {
            console.log('Cosma user data directory already exists');
        } else {
            fs.mkdir(Config.pathConfigDir, (err) => {
                if (err) {
                    console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'can not make Cosma user data directory : ' + err);
                }
                console.log(['\x1b[32m', 'Cosma user data directory was made', '\x1b[0m'].join(''), `${['\x1b[2m', Config.pathConfigDir, '\x1b[0m'].join('')}`);
            })
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
    .description('Generate the configuration file.')
    .action(() => {
        const fs = require('fs'), path = require('path');
        const configFilePath = Config.getFilePath();
        if (fs.existsSync(configFilePath)) {
            console.log('Config file already exists');
            return;
        }
        new Config();
        const { dir: fileDir, base: fileName } = path.parse(configFilePath);
        console.log(['\x1b[32m', 'Config file created', '\x1b[0m'].join(''), `: ${['\x1b[2m', fileDir, '/', '\x1b[0m', fileName].join('')}`);
        process.exit();
    })

program
    .command('modelize')
    .alias('m')
    .description('Generate a cosmoscope.')
    .option('--config <path>', 'Set config file.')
    .option('-c, --citeproc', 'Process citations.')
    .option('-css, --custom-css', 'Apply custom CSS.')
    .option('--sample', "Generate a sample cosmoscope.")
    .option('--fake', "Generate a fake cosmoscope.")
    .action((options) => {
        require('./controllers/modelize')(options);
    })

program
    .command('record')
    .alias('r')
    .description('Create a record (form mode).')
    .action(() => {
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
    .action((title, type, tags) => {
        console.log(new Config().getConfigConsolMessage());
        require('./controllers/autorecord')(title, type, tags);
    })
    .showHelpAfterError('("autorecord --help" for additional information)')

program
    .command('batch')
    .alias('b')
    .description('Create records (batch mode).')
    .argument('<file>', 'List of records to be created (path to JSON data file).')
    .action((file) => {
        require('./controllers/batch')(file);
    })
    .showHelpAfterError('("batch --help" for additional information)')

program.showSuggestionAfterError();
program.parse();