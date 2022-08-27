const fs = require('fs')
    , historyPath = require('../functions/history');

const Graph = require('../core/models/graph')
    , Cosmocope = require('../core/models/cosmoscope')
    , Bibliography = require('../core/models/bibliography')
    , Config = require('../core/models/config')
    , Template = require('../core/models/template');

module.exports = function ({config: configPath, ...options}) {
    const time = require('../functions/time');

    const configCustom = Config.get(configPath);
    let config = new Config(configCustom);

    options['publish'] = true;
    options['citeproc'] = (!!options['citeproc'] && config.canCiteproc());
    options['css_custom'] = (!!options['customCss'] && config.canCssCustom());

    options = Object.entries(options)
        .map(([name, value]) => { return { name, value } })
        .filter(({ value }) => value === true);

    const optionsGraph = options
        .filter(({ name }) => Graph.validParams.has(name))
        .map(({ name }) => name);
    const optionsTemplate = options
        .filter(({ name }) => Template.validParams.has(name))
        .map(({ name }) => name);

    if (optionsGraph.includes('sample')) {
        config = new Config(Config.getSampleConfig());
    }

    const {
        files_origin: filesPath,
        export_target: exportPath,
        history
    } = config.opts;
    const files = Cosmocope.getFromPathFiles(filesPath);
    const records = Cosmocope.getRecordsFromFiles(files, config.opts);    
    const graph = new Cosmocope(records, config.opts, optionsGraph);

    require('./log')(graph.report);

    const { html } = new Template(graph, optionsTemplate);

    fs.writeFile(exportPath + 'cosmoscope.html', html, (err) => { // Cosmoscope file for export folder
        if (err) {return console.error('Err.', '\x1b[0m', 'write Cosmoscope file : ' + err)}
        console.log('\x1b[34m', 'Cosmoscope generated', '\x1b[0m', `(${graph.records.length} records)`)
    });

    if (history === false) { return; }

    historyPath.createFolder();
    fs.writeFile(`history/${time}/cosmoscope.html`, html, (err) => { // Cosmoscope file for history
        if (err) { console.error('\x1b[31m', 'Err.', '\x1b[0m', 'can not save Cosmoscope into history : ' + err); }
    });
}