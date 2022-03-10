#!/usr/bin/env node

/**
 * @file Addressing of terminal commands.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const commander = require('commander')
    , program = new commander.Command()
    , { version } = require('./package.json');

program.version(version);

program
    .name("cosma")
    .usage("[command] [options]")
    .addHelpText('after',
`
Example call:
  $ cosma modelize --citeproc --custom-css --sample
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
        const Config = require('./core/models/config');
        new Config();
    })

program
    .command('modelize')
    .alias('m')
    .description('Generate a cosmoscope.')
    .option('--config <path>', 'Set config file.')
    .option('-c, --citeproc', 'Process citations.')
    .option('-css, --custom-css', 'Apply custom CSS.')
    .option('--sample', "Generate a sample cosmoscope.")
    .action((options) => {
        require('./functions/modelize')(options);
    })

program
    .command('record')
    .alias('r')
    .description('Create a record (form mode).')
    .action(() => {
        require('./functions/record');
    })

program
    .command('autorecord')
    .alias('a')
    .description('Create a record (one-liner mode).')
    .argument('<title>', '(mandatory) Record title.')
    .argument('[type]', 'Record type (default: undefined).')
    .argument('[tags]', 'List of comma-separated tags.')
    .action((title, type, tags) => {
        require('./functions/autorecord')(title, type, tags);
    })
    .showHelpAfterError('("autorecord --help" for additional information)')

program
    .command('batch')
    .alias('b')
    .description('Create records (batch mode).')
    .argument('<file>', 'List of records to be created (path to JSON data file).')
    .action((file) => {
        require('./functions/batch')(file);
    })
    .showHelpAfterError('("batch --help" for additional information)')

program.showSuggestionAfterError();

program.parse();