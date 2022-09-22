#!/usr/bin/env node

/**
 * @file Addressing of terminal commands.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const commander = require('commander')
    , program = new commander.Command()
    , { version } = require('./package.json');

const Config = require('./core/models/config');

program.version(version);

program
    .name("cosma")
    .usage("[command] [options]")
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
            console.log('Config file already exists')
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


const { name: projectName } = new Config().opts;
if (projectName) {
    console.log(`[Cosma v.${version}]`, ['\x1b[4m', projectName, '\x1b[0m'].join(''), ['\x1b[2m', Config.getFilePath(), '\x1b[0m'].join(''));
} else {
    console.log(`[Cosma v.${version}]`, ['\x1b[2m', Config.getFilePath(), '\x1b[0m'].join(''));
}

program.showSuggestionAfterError();
program.parse();