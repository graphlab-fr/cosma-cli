const fs = require('fs')
    , pug = require('pug');

function consmographe(d3Data) {

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

        const htmlRender = pug.compileFile('template/scope.pug')({})

        fs.writeFile('cosmographe.html', htmlRender, (err) => {
            if (err) { console.error( 'Err. write home index file: ' + err) }
            console.log('create cosmographe.html file');
        });
    });
}

exports.consmographe = consmographe;