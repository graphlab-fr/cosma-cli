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

    case 'path':
        require('./functions/verifconfig').modifyPath(args[1]);
    break;

    case 'atype':
        require('./functions/verifconfig').addType(args.slice(1));
    break;

    case undefined:
        console.log('Please, choose an action');
    break;

    default:
        console.log('Unknow command "' + args.join(' ') + '"');
    break;
}