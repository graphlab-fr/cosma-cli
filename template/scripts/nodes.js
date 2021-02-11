function highlightNodes(nodeIds) {

    const elts = getNodeNetwork(nodeIds);

    for (const elt of elts) {
        elt.style.stroke = 'var(--highlight)';
        elt.style.fill = 'var(--highlight)';
    }

    view.highlightedNodes = view.highlightedNodes.concat(nodeIds);
}

function unlightNodes() {
    if (view.highlightedNodes.length === 0) { return; }


    const elts = getNodeNetwork(view.highlightedNodes);

    for (const elt of elts) {
        elt.style.stroke = null;
        elt.style.fill = null;
    }
}

function getNodeNetwork(nodeIds) {

    let nodes = [], edges = [];

    for (const nodeId of nodeIds) {
        nodes.push(document.querySelector('[data-node="' + nodeId + '"]'));

        let tempSources = document.querySelectorAll('[data-source="' + nodeId + '"]');
        tempSources = Array.from(tempSources);
        tempSources = tempSources.filter(function(source) {
            if (view.hidenNodes.indexOf(Number(source.dataset.target)) === -1) {
                return true;
            }
        })

        let tempTargets = document.querySelectorAll('[data-target="' + nodeId + '"]');
        tempTargets = Array.from(tempTargets);
        tempTargets = tempTargets.filter(function(source) {
            if (view.hidenNodes.indexOf(Number(source.dataset.source)) === -1) {
                return true;
            }
        })

        edges = edges.concat(tempSources, tempTargets);
    }

    // delete duplicated elts
    edges = edges.filter((item, index) => {
        return edges.indexOf(item) === index
    });

    return nodes.concat(edges);
}

function hideNodes(nodeIds) {
    const elts = getNodeNetwork(nodeIds);

    // compare already hidden nodes
    nodeIds = nodeIds.filter(id => view.hidenNodes.indexOf(Number(id)) === -1);

    view.hidenNodes = view.hidenNodes.concat(nodeIds);

    for (const elt of elts) {
        elt.style.display = 'none';
    }
}

function displayNodes(nodeIds) {
    view.hidenNodes = view.hidenNodes.filter(id => nodeIds.indexOf(id) === -1);
    
    const elts = getNodeNetwork(nodeIds);

    for (const elt of elts) {
        elt.style.display = null;
    }
}