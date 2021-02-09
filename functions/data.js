const fs = require('fs');

function nodes(nodesList, path) {
    fs.writeFile(path + 'data/nodes.json', nodesList, (err) => {
        if (err) {console.error('\x1b[31m', 'Err.', '\x1b[0m', 'write nodes.json file : ' + err)}
    });
}

exports.nodes = nodes;

function links(linksList, path) {
    fs.writeFile(path + 'data/links.json', linksList, (err) => {
        if (err) {console.error('\x1b[31m', 'Err.', '\x1b[0m', 'write links.json file : ' + err)}
    });
}

exports.links = links;