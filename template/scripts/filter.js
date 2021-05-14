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
        setCounter(document.getElementById('types-counter'), 1)
    } else {
        hideNodes(nodeIdsList);
        setCounter(document.getElementById('types-counter'), -1)
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
 * Get nodes ids array hiden by filters
 * @returns {array} - Ids list (integer value)
 */

function getNodesHideByFilter() {
    let filtersIds = Array.from(document.querySelectorAll('[data-filter]'))
        .filter(filterElt => filterElt.checked === false)
        .map(filterElt => filterElt.dataset.filter.split(',')).flat()
        .map(nodeId => Number(nodeId));

    return filtersIds;
}

/**
 * For each type in list, find the counter and addition his value
 * @param {object} types - List of types to change, with pos. or neg. number as value
 */

function setTypesConters(types) {
    for (const typeName in types) {
        const filterLabel = document.querySelector('[data-filter][name="' + typeName +'"]').parentElement;
        setCounter(filterLabel.querySelector('.badge'), types[typeName]);
    }
}

/**
 * Get nodes ids list from a string list
 * @returns {array} - Ids list (integer value)
 */

function parseIdsString(idsString) {
    return idsString.split(',').map(id => Number(id));
}