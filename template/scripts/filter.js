let filters = Array.from(document.querySelectorAll('[data-filter]')) // filter btns
    , resetBtn = document.getElementById('reset-nodes'); // anti isolate() function btn

filters = filters.map(function(btn) {
    // extract nodes id affected by the filter from the linked button
    const nodeIds = btn.dataset.filter.split(',').map(id => Number(id));
    return {btn: btn, nodeIds: nodeIds, name: btn.dataset.name};
});

/**
 * Make filters functional
 */

(function() {
    for (const filter of filters) {
        const btn = filter.btn;
        btn.dataset.active = 'false';

        btn.addEventListener('click', () => {
            if (btn.dataset.active === 'true') {
                filterOff(filter); }
            else {
                filterOn(filter); }
        });
    }
})();

/**
 * Activate filters by their name
 * @param {array} filtersToActivate - List of filter names
 */

function setFilters(filtersToActivate) {
    for (const filter of filters) {
        if (filtersToActivate.indexOf(filter.name) !== -1) {
            // if filter is "ToActivate"
            filterOn(filter); }
        else {
            filterOff(filter); }
    }
}

/**
 * Activate a filter
 * @param {object} filterObj - Filter's btn, nodesIds linked & name
 */

function filterOn(filterObj) {
    hideNodes(filterObj.nodeIds);
    view.activeFilters.push(filterObj.name);
    filterObj.btn.dataset.active = 'true';
}

/**
 * Desactivate a filter
 * @param {object} filterObj - Filter's btn, nodesIds linked & name
 */

function filterOff(filterObj) {
    displayNodes(filterObj.nodeIds);
    view.activeFilters = view.activeFilters.filter(activeFilterName => activeFilterName !== filterObj.name);
    filterObj.btn.dataset.active = 'false';
}

/**
 * Get ids list from hiden (by filter) nodes
 * @returns {array} - Ids list (integer value)
 */

function getFiltedNodes() {
    let nodeIds = document.querySelectorAll('[data-filter][data-active="true"]');
    return nodeIds = Array.from(nodeIds)
        .map(filter => filter.dataset.filter.split(',')).flat()
        .map(nodeId => Number(nodeId));
}

/**
 * Display some nodes, hide others
 * @param {array} - Ids from nodes to keep displayed
 */

function isolate(nodeIds) {
    view.isolateMode = false;
    resetBtn.style.display = 'block';

    let toHideIds = [];

    index = index.map(function(item) {
        if (nodeIds.indexOf(item.id) !== -1) {
            item.isolated = true;
        } else {
            item.isolated = false;
            toHideIds.push(item.id);
        }
        return item;
    });

    let toDisplayIds = nodeIds.filter(id => getFiltedNodes().indexOf(id) === -1);

    hideNodes(toHideIds);
    view.isolateMode = true;
    displayNodes(toDisplayIds);
}

/**
 * Launch isolate() from the onclick value of an identified element
 * @param {string} - Id of the element for extract nodes ids
 */

function isolateByElement(eltId) {
    if (eltId === undefined) { return; }

    let nodeIds = window[eltId];
    nodeIds = nodeIds.getAttribute('onclick');
    nodeIds = nodeIds.split('([', 2)[1].split('])', 1)[0];
    nodeIds = nodeIds.split(',');
    nodeIds = nodeIds.map(id => Number(id));
    isolate(nodeIds);

    view.isolateId = eltId;
}

/**
 * Display all nodes, except filtered ones
 */

function resetNodes() {
    view.isolateId = undefined;
    const toDisplayIds = index.filter(item => item.isolated === false && getFiltedNodes().indexOf(item.id) === -1)
        .map(item => item.id);

    view.isolateMode = false;
    index = index.map(function(item) {
        if (item.isolated === true) {
            item.isolated === false; }

        return item;
    });

    displayNodes(toDisplayIds);

    resetBtn.style.display = null;
}