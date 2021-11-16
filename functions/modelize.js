const fs = require('fs')
    , historyPath = require('../functions/history');

const Graph = require('../template/models/graph')
    , Template = require('../template/models/template');

module.exports = function (graphParams = []) {

    const config = require('../functions/verifconfig').config
        , time = require('../functions/time');

    const graph = new Graph(graphParams)
        , template = new Template(graph);

    require('./log')(graph.reportToSentences());

    fs.writeFile(config.export_target + 'cosmoscope.html', template.html, (err) => { // Cosmoscope file for export folder
        if (err) {return console.error('Err.', '\x1b[0m', 'write Cosmoscope file : ' + err)}
        console.log('\x1b[34m', 'Cosmoscope generated', '\x1b[0m', `(${graph.files.length} records)`)
    });

    if (config.history === false) { return; }

    historyPath.createFolder();
    fs.writeFile(`history/${time}/cosmoscope.html`, template.html, (err) => { // Cosmoscope file for history
        if (err) {console.error('Err.', '\x1b[0m', 'save Cosmoscope into history : ' + err)}
    });
}