const fs = require('fs')
    , path = require('path')
    , historyPath = require('./history');

const Graph = require('../core/models/graph')
    , Cosmoscope = require('../core/models/cosmoscope')
    , Link = require('../core/models/link')
    , Record = require('../core/models/record')
    , Config = require('../core/models/config')
    , Template = require('../core/models/template')
    , Report = require('../core/models/report');

module.exports = async function ({config: configPath, ...options}) {
    const time = require('./time');

    const configCustom = Config.get(configPath);
    const config = new Config(configCustom);

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
        select_origin: originType,
        files_origin: filesPath,
        nodes_online: nodesUrl,
        links_online: linksUrl,
        export_target: exportPath,
        history
    } = config.opts;

    let {
        nodes_origin: nodesPath,
        links_origin: linksPath
    } = config.opts;

    switch (originType) {
        case 'directory':
            if (config.canModelizeFromDirectory() === false) {
                return console.error('Err.', '\x1b[0m', 'Can not modelize from directory with this config.')
            }
            break;
        case 'csv':
            if (config.canModelizeFromCsvFiles() === false) {
                return console.error('Err.', '\x1b[0m', 'Can not modelize from csv files with this config.')
            }
            break;
        case 'online':
            try {
                await config.canModelizeFromOnline();
            } catch (err) {
                return console.error('Err.', '\x1b[0m', 'Can not modelize from online csv files with this config.')
            }
            break;
    }

    let records;
    switch (originType) {
        case 'directory':
            const files = Cosmoscope.getFromPathFiles(filesPath, config.opts);
            records = Cosmoscope.getRecordsFromFiles(files, config.opts);    
            break;
        case 'online':
            const { downloadFile } = require('../core/utils/misc');
            const { tmpdir } = require('os');
            nodesPath = path.join(tmpdir(), 'cosma-nodes.csv');
            linksPath = path.join(tmpdir(), 'cosma-links.csv');
            await downloadFile(nodesUrl, nodesPath);
            await downloadFile(linksUrl, linksPath);
        case 'csv':
            let [formatedRecords, formatedLinks] = await Cosmoscope.getFromPathCsv(nodesPath, linksPath);
            const links = Link.formatedDatasetToLinks(formatedLinks);
            records = Record.formatedDatasetToRecords(formatedRecords, links, config);
            break;
    }

    const graph = new Cosmoscope(records, config.opts, []);

    const { html } = new Template(graph, optionsTemplate);

    fs.writeFile(exportPath + 'cosmoscope.html', html, (err) => { // Cosmoscope file for export folder
        if (err) {return console.error('Err.', '\x1b[0m', 'write Cosmoscope file : ' + err)}
        const reportMessage = Report.getAsMessage();
        if (reportMessage) {
            console.log(reportMessage);
        }
        console.log('\x1b[34m', 'Cosmoscope generated', '\x1b[0m', `(${graph.records.length} records)`);
    });

    if (history === false) { return; }

    historyPath.createFolder();
    fs.writeFile(`history/${time}/report.html`, Report.getAsHtmlFile(config), (err) => {
        if (err) { console.error('\x1b[31m', 'Err.', '\x1b[0m', 'can not save report into history : ' + err); }
    });

    fs.writeFile(`history/${time}/cosmoscope.html`, html, (err) => { // Cosmoscope file for history
        if (err) { console.error('\x1b[31m', 'Err.', '\x1b[0m', 'can not save Cosmoscope into history : ' + err); }
    });
}