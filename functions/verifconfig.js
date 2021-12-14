/**
 * @file Generate or check the config file. Contains function to modif the config file.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const validArgs = {
    files_origin: [ '--files_origin', '-f' ],
    export_target: [ '--export_target', '-e' ],
    citeproc: [ '--citeproc', '-c' ],
    load_css_custom: [ '--load_css_custom', '-css' ],
    lang: [ '--lang', '-l' ],
    history: [ '--history', '-h' ]
}

let newConfig = {
    devtools: false
};

const args = process.argv.requestArgs
    .map((arg) => {
        arg = arg.split('=');
        return { cmd: arg[0], value: arg[1] };
    })
    .filter((arg) => {
        for (const option in validArgs) {
            if (validArgs[option].includes(arg.cmd)) {
                return true; }
        }
    })
    .map((arg) => {
        if (arg.value === undefined) {
            arg.value = true;
        }

        if (arg.value === 'true' || arg.value === 'false') {
            arg.value = (arg.value === 'true'); // transform to boolean
        }

        return arg;
    })
    .map((arg) => {
        for (const option in validArgs) {
            if (validArgs[option].includes(arg.cmd)) {
                newConfig[option] = arg.value;
                return { cmd: option, value: arg.value };
            }
        }
    });

const Config = require('../cosma-core/models/config');

const config = new Config(newConfig);

if (config.isValid() === false) {
    console.error('\x1b[31m', 'Err.', '\x1b[0m', config.writeReport());
    process.exit();
}

const mustSave = process.argv.requestArgs
    .filter(arg => arg === '--save' || arg === '-s')
    .length > 0;
if (mustSave === true) { config.save(); }

exports.config = config.opts;