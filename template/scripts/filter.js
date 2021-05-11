let filtersNames = Array.from(document.querySelectorAll('[data-filter]')).map(filter => filter.name)
    , resetIsolateBtn = document.getElementById('reset-isolate'); // anti isolate() function btn

// filters = filters.map(function(btn) {
//     // extract nodes id affected by the filter from the linked button
//     const nodeIds = btn.dataset.filter.split(',').map(id => Number(id));
//     return {btn: btn, nodeIds: nodeIds, name: btn.name};
// });

function filter(isChecked, data) {
    data = parseIdsString(data);

    if (isChecked === true) {
        displayNodes(data);
    } else {
        hideNodes(data);
    }
}

/**
 * Activate filters by their name and if their are not already activated
 * Unsactive others filters if their are not already unactivated
 * @param {array} filtersNamesToActivate - List of filter names
 */

function setFilters(filtersNamesToActivate) {
    filtersToUnactivate = filtersNames.filter(function(filterName) {
        if (filtersNamesToActivate.includes(filterName)) {
            return false; }
        if (getUnactiveFilterNames().includes(filterName)) {
            return false; }

        return true;
    });

    filtersNamesToActivate = filtersNamesToActivate.filter(function(filterName) {
        if (getActiveFilterNames().includes(filterName)) {
            return false; }

        return true;
    });

    for (const filterName of filtersToUnactivate) {
        let filterElt = document.querySelector('[data-filter][name="' + filterName + '"]')
            , data = filterElt.dataset.filter;

        filterElt.checked = false;
        filter(false, data);
    }

    for (const filterName of filtersNamesToActivate) {
        let filterElt = document.querySelector('[data-filter][name="' + filterName + '"]')
            , data = filterElt.dataset.filter;

        filterElt.checked = true;
        filter(true, data);
    }
}

/**
 * Get active filters name
 * @returns {array} - Filter names
 */

function getActiveFilterNames() {
    let filterElts = Array.from(document.querySelectorAll('[data-filter]'))
        .filter(filterElt => filterElt.checked === true)

    return filterElts.map(filterElt => filterElt.name);
}

/**
 * Get unactive filters name
 * @returns {array} - Filter names
 */

function getUnactiveFilterNames() {
    let filterElts = Array.from(document.querySelectorAll('[data-filter]'))
        .filter(filterElt => filterElt.checked === false)

    return filterElts.map(filterElt => filterElt.name);
}

/**
 * Get ids list from hiden (by filter) nodes
 * @returns {array} - Ids list (integer value)
 */

function getFiltedNodes() {
    let nodeIds = document.querySelectorAll('[data-filter][data-active="false"]');
    return nodeIds = Array.from(nodeIds)
        .map(filter => filter.dataset.filter.split(',')).flat()
        .map(nodeId => Number(nodeId));
}

/**
 * Display some nodes, hide all others
 * turn on the 'isolateMode'
 * @param {array} - Ids from nodes to keep displayed
 */

function isolate(nodeIds) {
    view.isolateMode = false;
    resetIsolateBtn.style.display = 'block';

    let idsToHide = [];

    index = index.map(function(item) {
        if (nodeIds.indexOf(item.id) !== -1) {
            // if item is one of the nodeIds
            item.isolated = true;
        } else {
            item.isolated = false;
            idsToHide.push(item.id);
        }
        return item;
    });
    // display nodeIds if their are not filtered
    let idsToDisplay = nodeIds.filter(id => getFiltedNodes().indexOf(id) === -1);

    hideNodes(idsToHide);
    view.isolateMode = true;
    displayNodes(idsToDisplay);
}

/**
 * Launch isolate() from the onclick attribute of an identified element
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
 * Display nodes hidden by isolate(),
 * if their are not filtered
 */

function resetNodes() {
    view.isolateId = undefined;

    const idsToDisplay = index
        .filter(item => item.isolated === false && getFiltedNodes().indexOf(item.id) === -1)
        .map(item => item.id);

    index = index.map(function(item) {
        if (item.isolated === true) {
            item.isolated === false; }

        return item;
    });

    view.isolateMode = false;
    displayNodes(idsToDisplay);

    unactiveFromParent(document.getElementById('views-container'));

    resetIsolateBtn.style.display = null;
}

function parseIdsString(idsString) {
    return idsString.split(',').map(id => Number(id));
}