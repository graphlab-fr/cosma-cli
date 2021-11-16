/**
 * @file Addressing of terminal commands.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

require('./functions/verifconfig');

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

switch (process.argv.requestName) {

    /** Actions
    --------------------*/

    // config generation

    case 'c': break; // shortcut
    case 'config': break;

    // cosmoscope generation

    case 'm': require('./functions/modelize')(); break;
    case 'modelize': require('./functions/modelize')(); break;

    // add a record

    case 'r': require('./functions/record'); break;
    case 'record': require('./functions/record'); break;
        
    case 'a': require('./functions/autorecord')(arg[0], arg[1], arg[2]); break;
    case 'autorecord': require('./functions/autorecord')(arg[0], arg[1], arg[2]); break;

    /** Configuration
    --------------------*/

    case 'import':
        require('./functions/verifconfig').modifyImportPath(arg[0]);
    break;

    case 'export':
        require('./functions/verifconfig').modifyExportPath(arg[0]);
    break;

    case 'css':
        require('./functions/verifconfig').addCustomCSS();
    break;

    case 'atype':
        require('./functions/verifconfig').addRecordType(arg[0], arg[1]);
    break;

    case 'aview':
        require('./functions/verifconfig').addView(arg[0], arg[1]);
    break;

    /** Defaults
    --------------------*/

    case undefined:
        require('./functions/modelize');
    break;

    default:
        console.log('Unknow command "' + requestName + '"');
    break;
}