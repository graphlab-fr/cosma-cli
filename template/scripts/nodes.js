const resetHighlightBtn = document.getElementById('reset-highlight'); // anti highlightNodes() function btn

/**
 * Apply highlightColor (from config) to somes nodes and their links
 * @param {array} nodeIds - List of nodes ids
 */

function highlightNodes(nodeIds) {

    let elts = getNodeNetwork(nodeIds);
    if (elts.length === 0) { return; }

    elts = explodeNode(elts);

    for (const elt of elts) {

        switch (elt.tagName) {
            case 'circle':
                elt.style.stroke = 'var(--highlight)';
                elt.style.fill = 'var(--highlight)';
                break;
                
            case 'text':
                elt.style.fill = 'var(--highlight)';
                break;

            case 'line':
                elt.style.stroke = 'var(--highlight)';
                break;
        }
    }

    view.highlightedNodes = view.highlightedNodes.concat(nodeIds);
    resetHighlightBtn.style.display = 'block';
}

/**
 * remove highlightColor (from config) from all highlighted nodes and their links
 */

function unlightNodes() {
    if (view.highlightedNodes.length === 0) { return; }

    let elts = getNodeNetwork(view.highlightedNodes);
    if (elts.length === 0) { return; }

    elts = explodeNode(elts);

    for (const elt of elts) {
        elt.style.stroke = null;
        elt.style.fill = null;
    }

    if (view.activeTag !== undefined) {
        // if there is an active tag, remove the highlight of its button
        document.querySelectorAll('[data-tag="' + view.activeTag + '"]')
            .forEach(button => { button.classList.remove('active'); });
    }

    view.highlightedNodes = [];
    resetHighlightBtn.style = null;
}

/**
 * Get 'circle' & 'text' elts from a 'g' one
 * @param {array} nodeNetworkElts - List of elts from getNodeNetwork()
 */

function explodeNode(nodeNetworkElts) {
    for (let i = 0; i < nodeNetworkElts.length; i++) {
        if (nodeNetworkElts[i].tagName === 'g') {
            nodeNetworkElts = nodeNetworkElts
                .concat(Array.from(nodeNetworkElts[i].childNodes));
        }
    }
    return nodeNetworkElts;
}

/**
 * Get nodes
 * Get links of nodes if their source and their target are not hidden
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
        let sources = document.querySelectorAll('[data-source="' + nodeId + '"]');
        sources = Array.from(sources);
        sources = sources.filter(function(source) {
            if (diplayedNodes.includes(Number(source.dataset.target))) {
                return true;
            }
        })

        // get links DOM element to nodes, if their source is not hidden
        let targets = document.querySelectorAll('[data-target="' + nodeId + '"]');
        targets = Array.from(targets);
        targets = targets.filter(function(source) {
            if (diplayedNodes.includes(Number(source.dataset.source))) {
                return true;
            }
        })

        links = links.concat(sources, targets);
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
    const nodesToHideType = {};
    let nodesToHideIds = index.filter(function(item) {
        if (nodeIds.includes(item.id) && item.hidden === false) {
            // return nodes are not yet hidden…
            if (view.focusMode) {
                if (item.isolated === true) { return true; } // … and part of the isolated ones
            } else {
                return true;
            }
        }
        return false;
    }).map(function(item) {
        if (!nodesToHideType[item.type]) { nodesToHideType[item.type] = 0; }
        nodesToHideType[item.type] -= 1;

        return item.id;
    });

    setTypesConters(nodesToHideType);

    hideFromIndex(nodesToHideIds);
    const elts = getNodeNetwork(nodesToHideIds);
    if (elts.length === 0) { return; }

    for (const elt of elts) {
        elt.style.display = 'none';
    }

    index = index.map(function(item) {
        if (nodesToHideIds.includes(item.id)) {
            item.hidden = true; // for each nodesToHideIds
        }
        return item;
    });
}

/**
 * Display some nodes & their links, by their id
 * @param {array} nodeIds - List of nodes ids
 */

function displayNodes(nodeIds) {
    const nodesToDisplayType = {};
    let nodesToDisplayIds = [];

    index = index.map(function(item) {
        if (nodeIds.includes(item.id) && item.hidden === true) {
            // push on nodesToDisplayIds nodes are not yet displayed…
            if (view.focusMode) {
                if (item.isolated === true) { // … and part of the isolated ones
                    item.hidden = false;
                    nodesToDisplayIds.push(item.id);

                    if (!nodesToDisplayType[item.type]) { nodesToDisplayType[item.type] = 0; }
                    nodesToDisplayType[item.type] += 1;
                }
            } else {
                item.hidden = false;
                nodesToDisplayIds.push(item.id);

                if (!nodesToDisplayType[item.type]) { nodesToDisplayType[item.type] = 0; }
                    nodesToDisplayType[item.type] += 1;
            }
        }
        return item;
    });

    setTypesConters(nodesToDisplayType);

    displayFromIndex(nodesToDisplayIds);
    const elts = getNodeNetwork(nodesToDisplayIds);
    if (elts.length === 0) { return; }

    for (const elt of elts) {
        elt.style.display = null;
    }
}

/**
 * Toggle display/hide nodes links
 * @param {bool} isChecked - 'checked' value send by a checkbox input
 */

function linksDisplayToggle(isChecked) {
    const lines = document.querySelectorAll('line');
    if (isChecked) {
        lines.forEach(line => { line.style.display = null });
    } else {
        lines.forEach(line => { line.style.display = 'none' });
    }
}

/**
 * Toggle display/hide nodes label
 * @param {bool} isChecked - 'checked' value send by a checkbox input
 */

function labelDisplayToggle(isChecked) {
    const texts = document.querySelectorAll('text');
    if (isChecked) {
        texts.forEach(text => { text.style.display = null });
    } else {
        texts.forEach(text => { text.style.display = 'none' });
    }
}