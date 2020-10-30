function node(id, title, size, x, y) {
    return json = `{
        "id": ${id},
        "label": "${title}",
        "size": ${size},
        "x": ${x},
        "y": ${y}
    }`;
}

exports.node = node;

function edge(id, from, to) {
    return json = `{
        "id": ${id},
        "from": ${from},
        "to": ${to}
    }`;
}

exports.edge = edge;

function sigma(nodes, edges) {
    return json = `{"nodes":[${nodes.join(',')}],"edges": [${edges.join(',')}]}`;
}

exports.sigma = sigma;