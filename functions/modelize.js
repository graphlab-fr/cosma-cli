const fs = require('fs')
    , historyPath = require('../functions/history');

const Graph = require('../core/models/graph')
    , Config = require('../core/models/config')
    , Template = require('../core/models/template');

module.exports = function (options) {
    const time = require('../functions/time');

    const config = new Config();

    options['publish'] = true
    options['citeproc'] = (!!options['citeproc'] && config.canCiteproc());
    options['custom_css'] = (!!options['customCss'] && config.canCssCustom());

    options = Object.keys(options)
        .map((key) => { return { name: key, value: options[key] } })
        .filter(option => option.value === true)
        .map(option => option.name)

    const graph = new Graph(options)
        , template = new Template(graph);

    require('./log')(graph.report);

    if (graph.errors.length > 0) {
        console.error('\x1b[31m', 'Err.', '\x1b[0m', graph.errors.join(', ')); }

    fs.writeFile(config.opts.export_target + 'cosmoscope.html', template.html, (err) => { // Cosmoscope file for export folder
        if (err) {return console.error('Err.', '\x1b[0m', 'write Cosmoscope file : ' + err)}
        console.log('\x1b[34m', 'Cosmoscope generated', '\x1b[0m', `(${graph.files.length} records)`)
    });

    if (config.opts.history === false) { return; }

    historyPath.createFolder();
    fs.writeFile(`history/${time}/cosmoscope.html`, template.html, (err) => { // Cosmoscope file for history
        if (err) { console.error('\x1b[31m', 'Err.', '\x1b[0m', 'can not save Cosmoscope into history : ' + err); }
    });
}