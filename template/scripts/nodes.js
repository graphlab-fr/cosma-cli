/**
 * Hide some nodes & their links, by their id
 * @param {array} nodeIds - List of nodes ids
 */

function hideNodes(nodeIds) {
    const nodesToHideType = {};
    let nodesToHideIds = graph.nodes.filter(function(item) {
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

    setTypesCounter(nodesToHideType);

    hideFromIndex(nodesToHideIds);

    hideNodeNetwork(nodesToHideIds);

    graph.nodes = graph.nodes.map(function(item) {
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

    function addAsDisplayType(itemType) {
        if (!nodesToDisplayType[itemType]) { nodesToDisplayType[itemType] = 0; }
        nodesToDisplayType[itemType] += 1;
    }

    let nodesToDisplayIds = [];

    graph.nodes = graph.nodes.map(function(item) {
        if (nodeIds.includes(item.id) && item.hidden === true) {
            // push on nodesToDisplayIds nodes are not yet displayed…
            if (view.focusMode) {
                if (item.isolated === true) { // … and part of the isolated ones
                    item.hidden = false;
                    nodesToDisplayIds.push(item.id);
                    addAsDisplayType(item.type);
                }
            } else {
                item.hidden = false;
                nodesToDisplayIds.push(item.id);
                addAsDisplayType(item.type);
            }
        }
        return item;
    });

    setTypesCounter(nodesToDisplayType);

    displayFromIndex(nodesToDisplayIds);

    displayNodeNetwork(nodesToDisplayIds);
}