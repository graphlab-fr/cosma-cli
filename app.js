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
    .command('config')
    .description('Generate the configuration file.')
    .action((title, type, tags, options) => {
        const Config = require('./core/models/config');
        new Config();
    })

program
    .command('modelize')
    .description('Generate a cosmoscope.')
    .argument('[params]', 'Parameters for generate graph')
    .option('--citeproc', 'Process citations.')
    .option('--custom-css', 'Apply custom CSS.')
    .option('--sample', "Generate a sample cosmoscope.")
    .action((params, options) => {
        require('./functions/modelize')(options);
    })

program
    .command('record')
    .description('Create a record (form mode).')
    .action(() => {
        require('./functions/record');
    })

program
    .command('autorecord')
    .description('Create a record (one-liner mode).')
    .argument('<title>', '(mandatory) Record title.')
    .argument('<type>', 'Record type (default: undefined).')
    .argument('[tags]', 'List of comma-separated tags.')
    .action((title, type, tags) => {
        require('./functions/autorecord')(title, type, tags);
    })

program
    .command('batch')
    .description('Create records (batch mode).')
    .argument('<file>', 'List of records to be created (path to JSON data file).')
    .action((file) => {
        require('./functions/batch')(file);
    })

program.parse();