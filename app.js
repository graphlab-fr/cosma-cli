require('./functions/verifconfig');

const args = process.argv.slice(2);

switch (args[0]) {
    case 'modelize':
        require('./functions/modelize');
    break;

    case 'record':
        require('./functions/record');
    break;

    case 'autorecord':
        require('./functions/autorecord').genMdFile(args[1], args[2], args[3]);
    break;

    case 'import':
        require('./functions/verifconfig').modifyImportPath(args[1]);
    break;

    case 'export':
        require('./functions/verifconfig').modifyExportPath(args[1]);
    break;

    case 'import':
        require('./functions/verifconfig').modifyImportPath(args[1]);
    break;

    case 'atype':
        require('./functions/verifconfig').addRecordType(args[1], args[2]);
    break;

    case 'aview':
        require('./functions/verifconfig').addView(args[1], args[2]);
    break;

    case undefined:
        require('./functions/modelize');
    break;

    default:
        console.log('Unknow command "' + args.join(' ') + '"');
    break;
}