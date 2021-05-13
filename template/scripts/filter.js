let filtersNames = Array.from(document.querySelectorAll('[data-filter]'))
    .map(filter => filter.name);

/**
 * Toggle filter from his checkbox or manually
 * @param {bool} isChecked - Checkbox boolean : checked or not
 * @param {string} nodeIdsList - List of node ids, separeted by comas
 */

function filter(isChecked, nodeIdsList) {
    nodeIdsList = parseIdsString(nodeIdsList);

    if (isChecked === true) {
        displayNodes(nodeIdsList);
    } else {
        hideNodes(nodeIdsList);
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
 * Get nodes ids list from a string list
 * @returns {array} - Ids list (integer value)
 */

function parseIdsString(idsString) {
    return idsString.split(',').map(id => Number(id));
}