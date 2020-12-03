function node(id, title, type, size, x, y) {
    return json = `{
        "id": ${id},
        "label": "${title}",
        "type": "${type}",
        "size": ${size},
        "x": ${x},
        "y": ${y}
    }`;
}

exports.node = node;

function edge(id, from, to) {
    return json = `{
        "id": ${id},
        "source": ${from},
        "target": ${to}
    }`;
}

exports.edge = edge;

function sigma(nodes, edges) {
    return json = `{"nodes":[${nodes.join(',')}],"edges": [${edges.join(',')}]}`;
}

exports.sigma = sigma;

function d3(nodes, edges) {
    return json = `{"nodes":[${nodes.join(',')}],"links": [${edges.join(',')}]}`;
}

exports.d3 = d3;