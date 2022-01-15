/**
 * @file Addressing of terminal commands.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

/**
 * command sample :
 * node app <command name> <argument1 argument2 …>
 */

const cmdEntries = process.argv.slice(2);

process.argv = {
    requestName: cmdEntries[0], // = "command name"
    requestArgs: cmdEntries.slice(1) // = ["argument1", "argument2", …]
}

const arg = process.argv.requestArgs;

require('./functions/verifconfig'); // config generation & verif

switch (process.argv.requestName) {

    /** Actions
    --------------------*/

    // config generation

    case 'c': break; // shortcut
    case 'config': break;

    // cosmoscope generation

    case 'm': require('./functions/modelize')(arg); break;
    case 'modelize': require('./functions/modelize')(arg); break;

    // add a record

    case 'r': require('./functions/record'); break;
    case 'record': require('./functions/record'); break;
        
    case 'a': require('./functions/autorecord')(arg[0], arg[1], arg[2]); break;
    case 'autorecord': require('./functions/autorecord')(arg[0], arg[1], arg[2]); break;
        
    case 'json': require('./functions/jsondata')(arg[0]); break;
    case 'jsondata': require('./functions/jsondata')(arg[0]); break;

    /** Defaults
    --------------------*/

    case undefined:
        require('./functions/modelize');
    break;

    default:
        console.log('Unknow command "' + requestName + '"');
    break;
}