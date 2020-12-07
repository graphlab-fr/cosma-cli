const fs = require('fs')
    , pug = require('pug')
    , mdIt = require('markdown-it')()
    , config = require('./verifconfig').config;

function cosmoscope(d3Data, files, path) {

    const graphScript =
`var svg = d3.select("#my_canvas"),
width = +svg.node().getBoundingClientRect().width,
height = +svg.node().getBoundingClientRect().height;

// svg objects
var link, node;
// the data - an object with nodes and links
var graph;

// load the data
graph = ${d3Data};
initializeDisplay();
initializeSimulation();`;
    
    fs.writeFile('./template/graph-data.js', graphScript, (err) => {
        if (err) { return console.error( 'Err. write graph-data.js file : ' + err) }
        console.log('create graph-data.js file');

        const htmlRender = pug.compileFile('template/scope.pug')({
            index: files.map(file => ({
                id: file.metas.id,
                title: file.metas.title,
                content: mdIt.render(file.content)
            }))
        })

        fs.writeFile(path + 'cosmographe.html', htmlRender, (err) => {
            if (err) { console.error( 'Err. write cosmographe file: ' + err) }
        });

        if (fs.existsSync(config.export_target)) {
            fs.writeFile(config.export_target + 'cosmographe.html', htmlRender, (err) => {
                if (err) { console.error( 'Err. write cosmographe file: ' + err) }
                console.log('create cosmographe.html file');
            });
        } else {
            console.error('You must specify a valid target to export in the configuration.');
        }

    });
}

exports.cosmoscope = cosmoscope;