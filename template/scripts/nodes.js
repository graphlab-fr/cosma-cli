/**
 * Apply highlightColor (from config) to somes nodes and their links
 * @param {array} nodeIds - List of nodes ids
 */

function highlightNodes(nodeIds) {

    const elts = getNodeNetwork(nodeIds);
    console.log(elts);

    for (const elt of elts) {
        elt.style.stroke = 'var(--highlight)';
        elt.style.fill = 'var(--highlight)';
    }

    view.highlightedNodes = view.highlightedNodes.concat(nodeIds);
}

/**
 * remove highlightColor (from config) from all highlighted nodes and their links
 */

function unlightNodes() {
    if (view.highlightedNodes.length === 0) { return; }

    const elts = getNodeNetwork(view.highlightedNodes);

    for (const elt of elts) {
        elt.style.stroke = null;
        elt.style.fill = null;
    }

    view.highlightedNodes = [];
}

/**
 * Get the valid link network for some nodes
 * @param {array} nodeIds - List of nodes ids
 * @returns {array} - DOM elts : nodes and their links
 */

function getNodeNetwork(nodeIds) {

    let nodes = [], links = [];

    for (const nodeId of nodeIds) {
        // get nodes DOM element
        var node = document.querySelector('[data-node="' + nodeId + '"]');
        if (!node) { continue; }

        nodes.push(toto);

        // get links DOM element from nodes, if their target is not hidden
        let tempSources = document.querySelectorAll('[data-source="' + nodeId + '"]');
        tempSources = Array.from(tempSources);
        tempSources = tempSources.filter(function(source) {
            if (view.hidenNodes.indexOf(Number(source.dataset.target)) === -1) {
                return true;
            }
        })

        // get links DOM element to nodes, if their source is not hidden
        let tempTargets = document.querySelectorAll('[data-target="' + nodeId + '"]');
        tempTargets = Array.from(tempTargets);
        tempTargets = tempTargets.filter(function(source) {
            if (view.hidenNodes.indexOf(Number(source.dataset.source)) === -1) {
                return true;
            }
        })

        links = links.concat(tempSources, tempTargets);
    }

    // delete duplicated links DOM element
    links = links.filter((item, index) => {
        return links.indexOf(item) === index
    });

    return nodes.concat(links);
}

/**
 * Hide some nodes & their links, by their id
 * @param {array} nodeIds - List of nodes ids
 */

function hideNodes(nodeIds) {
    const elts = getNodeNetwork(nodeIds);

    // compare already hidden nodes
    nodeIds = nodeIds.filter(id => view.hidenNodes.indexOf(Number(id)) === -1);

    view.hidenNodes = view.hidenNodes.concat(nodeIds);

    for (const elt of elts) {
        elt.style.display = 'none';
    }
}

/**
 * Display some nodes & their links, by their id
 * @param {array} nodeIds - List of nodes ids
 */

function displayNodes(nodeIds) {
    view.hidenNodes = view.hidenNodes.filter(id => nodeIds.indexOf(id) === -1);
    
    const elts = getNodeNetwork(nodeIds);

    for (const elt of elts) {
        elt.style.display = null;
    }
}