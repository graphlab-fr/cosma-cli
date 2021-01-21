const fs = require('fs');

if (fs.existsSync('./data') === false) {
    fs.mkdirSync('./data') }

function nodes(nodeList, path) {
    fs.writeFile(path + 'data/nodes.json', nodeList, (err) => {
        if (err) {console.error('\x1b[31m', 'Err.', '\x1b[0m', 'write nodes.json file : ' + err)}
    });
}

exports.nodes = nodes;

function edges(edgeList, path) {
    fs.writeFile(path + 'data/edges.json', edgeList, (err) => {
        if (err) {console.error('\x1b[31m', 'Err.', '\x1b[0m', 'write edges.json file : ' + err)}
    });
}

exports.edges = edges;