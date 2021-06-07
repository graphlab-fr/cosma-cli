require('./functions/verifconfig');

const cmdEntries = process.argv.slice(2)
    , requestName = cmdEntries[0]
    , requestArgs = cmdEntries.slice(1);

switch (requestName) {

    /** Actions
    --------------------*/

    // config

    case 'c': break;
    case 'config': break;

    // cosmoscope genetration

    case 'm': require('./functions/modelize'); break;
    case 'modelize': require('./functions/modelize'); break;

    // add a record

    case 'r': require('./functions/record'); break;
    case 'record': require('./functions/record'); break;

    case 'a': require('./functions/autorecord').genMdFile(requestArgs[0], requestArgs[1], requestArgs[2]); break;
    case 'autorecord': require('./functions/autorecord').genMdFile(requestArgs[0], requestArgs[1], requestArgs[2]); break;

    /** Configuration
    --------------------*/

    case 'import':
        require('./functions/verifconfig').modifyImportPath(requestArgs[0]);
    break;

    case 'export':
        require('./functions/verifconfig').modifyExportPath(requestArgs[0]);
    break;

    case 'css':
        require('./functions/verifconfig').addCustomCSS();
    break;

    case 'atype':
        require('./functions/verifconfig').addRecordType(requestArgs[0], requestArgs[1]);
    break;

    case 'aview':
        require('./functions/verifconfig').addView(requestArgs[0], requestArgs[1]);
    break;

    /** Errors
    --------------------*/

    case undefined:
        require('./functions/modelize');
    break;

    default:
        console.log('Unknow command "' + requestArgs.join(' ') + '"');
    break;
}