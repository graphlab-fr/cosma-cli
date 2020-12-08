const fs = require('fs')
    , path = require('./modelize').historyPath;

if (fs.existsSync('./data') === false) {
    fs.mkdirSync('./data') }

function nodes(nodeList, path) {
    fs.writeFile(path + 'data/nodes.json', nodeList, (err) => {
        if (err) { return console.error( 'Err. write nodes.json file : ' + err) }
        console.log('create nodes.json file');
    });
}

exports.nodes = nodes;

function edges(edgeList, path) {
    fs.writeFile(path + 'data/edges.json', edgeList, (err) => {
        if (err) { return console.error( 'Err. write edges.json file : ' + err) }
        console.log('create edges.json file');
    });
}

exports.edges = edges;

// function forSigma(nodeList, edgeList, path) {
//     fs.writeFile(path + 'data/sigma.json', jsonify.sigma(nodeList, edgeList), (err) => {
//         if (err) { return console.error( 'Err. write sigma.json file : ' + err) }
//         console.log('create sigma.json file');
//     });
// }

// exports.forSigma = forSigma;

// function forD3(nodeList, edgeList, path) {
//     fs.writeFile(path + 'data/d3.json', jsonify.d3(nodeList, edgeList), (err) => {
//         if (err) { return console.error( 'Err. write d3.json file : ' + err) }
//         console.log('create d3.json file');
//     });
// }

// exports.forD3 = forD3;