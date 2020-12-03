const fs = require('fs')
    , jsonify = require('./jsonify');

if (fs.existsSync('./data') === false) {
    fs.mkdirSync('./data') }

function nodes(nodeList) {
    fs.writeFile('./data/nodes.json', '[' + nodeList.join(',') + ']', (err) => {
        if (err) { return console.error( 'Err. write nodes.json file : ' + err) }
        console.log('create nodes.json file');
    });
}

exports.nodes = nodes;

function edges(edgeList) {
    fs.writeFile('./data/edges.json', '[' + edgeList.join(',') + ']', (err) => {
        if (err) { return console.error( 'Err. write edges.json file : ' + err) }
        console.log('create edges.json file');
    });
}

exports.edges = edges;

function forSigma(nodeList, edgeList) {
    fs.writeFile('./data/sigma.json', jsonify.sigma(nodeList, edgeList), (err) => {
        if (err) { return console.error( 'Err. write sigma.json file : ' + err) }
        console.log('create sigma.json file');
    });
}

exports.forSigma = forSigma;

function forD3(nodeList, edgeList) {
    fs.writeFile('./data/d3.json', jsonify.d3(nodeList, edgeList), (err) => {
        if (err) { return console.error( 'Err. write d3.json file : ' + err) }
        console.log('create d3.json file');
    });
}

exports.forD3 = forD3;