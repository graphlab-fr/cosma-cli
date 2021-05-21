/**
 * Toggle filter from his checkbox or manually
 * @param {bool} isChecked - Checkbox boolean : checked or not
 * @param {string} nodeIdsList - List of node ids, separeted by comas
 */

 function filter(isChecked, nodeIdsList, name = undefined) {

    if (name && pressedKeys.Alt) {
        setFilters([name]);
        return;
    }

    nodeIdsList = parseIdsString(nodeIdsList);

    if (isChecked === true) {
        displayNodes(nodeIdsList);
    } else {
        hideNodes(nodeIdsList);
    }
}

/**
 * Activate filters by their name and if their are not already activated
 * Unactive others filters if their are not already unactivated
 * @param {array} filtersNamesToActivate - List of filter names
 */

function setFilters(filtersNamesToActivate) {
    let filtersNames = Array.from(document.querySelectorAll('[data-filter]'))
        .map(filter => filter.name);

    let filtersToUnactivate = filtersNames.filter(function(filterName) {
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
 * Get all filters name
 * @returns {array} - Filter names
 */

function getFilterNames() {
    return filterElts = Array.from(document.querySelectorAll('[data-filter]'))
        .map(filterElt => filterElt.name);
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
        const number = types[typeName];
        const filterLabel = document.querySelector('[data-filter][name="' + typeName +'"]').parentElement;
        iterateCounter(filterLabel.querySelector('.badge'), number);
    }
}

/**
 * Get nodes ids list from a string list
 * @returns {array} - Ids list (integer value)
 */

function parseIdsString(idsString) {
    return idsString.split(',').map(id => Number(id));
}