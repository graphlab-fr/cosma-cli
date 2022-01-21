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
    .action((title, type, tags, options) => {
        const Config = require('./core/models/config');
        new Config();
    })

program
    .command('modelize')
    .argument('[params]', 'Parameters for generate graph')
    .option('-c, --citeproc', 'Add quotation')
    .option('-css, --custom_css', 'Add cumstom CSS')
    .option('--sample', "Get Cosma's example cosmoscope")
    .action((params, options) => {
        require('./functions/modelize')(options);
    })

program
    .command('record')
    .action((title, type, tags) => {
        require('./functions/record');
    })

program
    .command('autorecord')
    .argument('<title>', 'Title and file name of record')
    .argument('[type]', 'Type of record. "undefined" by default')
    .argument('[tags]', 'Tags of record.')
    .option('-c, --citeproc', 'Add quotation')
    .action((title, type, tags, options) => {
        console.log(title, type, tags);
        console.log(options);
    })

program.parse();