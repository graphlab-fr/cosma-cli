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
    .description('Generate a cosmocope (visualisation file).')
    .argument('[params]', 'Parameters for generate graph')
    .option('-c, --citeproc', 'Add quotation')
    .option('-css, --custom_css', 'Add cumstom CSS')
    .option('--sample', "Get Cosma's example cosmoscope")
    .action((params, options) => {
        require('./functions/modelize')(options);
    })

program
    .command('record')
    .description('Generate a record file by a form.')
    .action(() => {
        require('./functions/record');
    })

program
    .command('autorecord')
    .description('Generate a record by a oneliner command.')
    .argument('<title>', 'Title and file name of record')
    .argument('[type]', 'Type of record. "undefined" by default')
    .argument('[tags]', 'Tags of record.')
    .action((title, type, tags) => {
        require('./functions/autorecord')(title, type, tags);
    })

program
    .command('batch')
    .description('Generate several records from a data file.')
    .argument('<file>', 'File path to data file')
    .action((file) => {
        require('./functions/batch')(file);
    })

program.parse();