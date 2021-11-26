const fs = require('fs')
    , historyPath = require('../functions/history');

const Graph = require('../cosma-core/models/graph')
    , Template = require('../cosma-core/models/template');

module.exports = function (graphParams) {

    graphParams = graphParams
        .filter(parm => ['-c', '--citeproc'].includes(parm))
        .map(parm => 'citeproc');

    graphParams.push('publish');

    const config = require('../functions/verifconfig').config
        , time = require('../functions/time');

    const graph = new Graph(graphParams, config)
        , template = new Template(graph, config);

    require('./log')(graph.reportToSentences());

    if (graph.errors.length > 0) {
        console.error('\x1b[31m', 'Err.', '\x1b[0m', graph.errors.join(', ')); }

    fs.writeFile(config.export_target + 'cosmoscope.html', template.html, (err) => { // Cosmoscope file for export folder
        if (err) {return console.error('Err.', '\x1b[0m', 'write Cosmoscope file : ' + err)}
        console.log('\x1b[34m', 'Cosmoscope generated', '\x1b[0m', `(${graph.files.length} records)`)
    });

    if (config.history === false) { return; }

    historyPath.createFolder();
    fs.writeFile(`history/${time}/cosmoscope.html`, template.html, (err) => { // Cosmoscope file for history
        if (err) { console.error('\x1b[31m', 'Err.', '\x1b[0m', 'can not save Cosmoscope into history : ' + err); }
    });
}