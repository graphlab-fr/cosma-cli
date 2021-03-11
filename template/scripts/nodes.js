/**
 * Apply highlightColor (from config) to somes nodes and their links
 * @param {array} nodeIds - List of nodes ids
 */

function highlightNodes(nodeIds) {

    const elts = getNodeNetwork(nodeIds);

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

    const diplayedNodes = index.filter(function(item) {
        if (item.hidden === true) {
            return false; }

        return item;
    }).map(item => item.id);

    for (const nodeId of nodeIds) {
        // get nodes DOM element
        var node = document.querySelector('[data-node="' + nodeId + '"]');
        if (!node) { continue; }

        nodes.push(node);

        // get links DOM element from nodes, if their target is not hidden
        let tempSources = document.querySelectorAll('[data-source="' + nodeId + '"]');
        tempSources = Array.from(tempSources);
        tempSources = tempSources.filter(function(source) {
            if (diplayedNodes.indexOf(Number(source.dataset.target)) !== -1) {
                return true;
            }
        })

        // get links DOM element to nodes, if their source is not hidden
        let tempTargets = document.querySelectorAll('[data-target="' + nodeId + '"]');
        tempTargets = Array.from(tempTargets);
        tempTargets = tempTargets.filter(function(source) {
            if (diplayedNodes.indexOf(Number(source.dataset.source)) !== -1) {
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
    let nodesToHide = index.filter(function(item) {
        if (!view.isolateMode && (nodeIds.indexOf(item.id) !== -1) && (item.hidden === false)) {
            return true;
        }
        if (view.isolateMode && (nodeIds.indexOf(item.id) !== -1) && (item.hidden === false) && (item.isolated === true)) {
            return true;
        }
        return false;
    }).map(item => item.id);

    hideFromIndex(nodesToHide);
    const elts = getNodeNetwork(nodesToHide);

    for (const elt of elts) {
        elt.style.display = 'none';
    }

    index = index.map(function(item) {
        if (nodesToHide.indexOf(item.id) !== -1) {
            item.hidden = true;
        }
        return item;
    });

}

/**
 * Display some nodes & their links, by their id
 * @param {array} nodeIds - List of nodes ids
 */

function displayNodes(nodeIds) {
    // si mode isolé, n'agir que sur les noeuds isolés
    let nodesToDisplay = [];

    index = index.map(function(item) {
        if (!view.isolateMode && (nodeIds.indexOf(item.id) !== -1) && (item.hidden === true)) {
            item.hidden = false;
            nodesToDisplay.push(item.id);
        }
        if (view.isolateMode && (nodeIds.indexOf(item.id) !== -1) && (item.hidden === true) && (item.isolated === true)) {
            item.hidden = false;
            nodesToDisplay.push(item.id);
        }
        return item;
    });
    // remove id to display from the hidden nodes list
    view.hidenNodes = view.hidenNodes.filter(id => nodeIds.indexOf(id) === -1);
    
    displayFromIndex(nodesToDisplay);
    const elts = getNodeNetwork(nodesToDisplay);

    for (const elt of elts) {
        elt.style.display = null;
    }
}