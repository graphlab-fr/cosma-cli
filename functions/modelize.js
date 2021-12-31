const fs = require('fs')
    , historyPath = require('../functions/history');

const Graph = require('../cosma-core/models/graph')
    , Config = require('../cosma-core/models/config')
    , Template = require('../cosma-core/models/template');

module.exports = function (graphParams) {
    const configG = new Config();

    const config = require('../functions/verifconfig').config
        , time = require('../functions/time');

    graphParams.push('publish');

    if (config['citeproc'] && config['citeproc'] === true) {
        graphParams.push('citeproc');

        if (configG.canCiteproc() === false) {
            console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Can not process quotes : undefined parameters'); }
    }

    if (config['load_css_custom'] && config['load_css_custom'] === true) {
        graphParams.push('css_custom');

        if (configG.canCssCustom() === false) {
            console.error('\x1b[31m', 'Err.', '\x1b[0m', 'Can not process custom css : undefined parameters'); }
    }

    const graph = new Graph(graphParams)
        , template = new Template(graph);

    require('./log')(graph.report);

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