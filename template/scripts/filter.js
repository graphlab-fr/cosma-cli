let filtersNames = Array.from(document.querySelectorAll('[data-filter]')).map(filter => filter.name)
    , resetIsolateBtn = document.getElementById('reset-isolate'); // anti isolate() function btn

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
 * Display some nodes, hide all others
 * turn on the 'focusMode'
 * @param {string} nodeIdsList - List of ids from nodes to keep displayed, separeted by comas
 */

function nodeFocus(nodeIdsList) {
    nodeIdsList = parseIdsString(nodeIdsList);

    view.focusMode = false; // for reset
    resetIsolateBtn.style.display = 'block';

    let idsToHide = [];

    index = index.map(function(item) {
        if (nodeIdsList.includes(item.id)) {
            // if item comes from the nodeIdsList
            item.isolated = true;
        } else {
            item.isolated = false;
            idsToHide.push(item.id);
        }
        return item;
    });
    // display nodeIds if their are not filtered
    let idsToDisplay = nodeIdsList
        .filter(id => !getFiltedNodes().includes(id));

    hideNodes(idsToHide);
    view.focusMode = true;
    displayNodes(idsToDisplay);
}

/**
 * Active Isolate function with information from the view
 * We search the data-focus value from a button, from a record
 * @param {number} recordId - Id of the target record
 * @param {number} focusLevel - Focus level = focus button number - 1
 */

function nodeFocusByView(recordId, focusLevel) {
    const focusRecord = document.getElementById(recordId)
        , focusOutput = focusRecord.querySelector('output')
        , focusRange = focusRecord.querySelector('input[type="range"]');

    view.focus = {
        fromRecordId: recordId,
        level: focusLevel
    }

    focusOutput.value = focusLevel;
    focusRange.value = focusLevel;

    nodeFocusByDataset(focusRange.dataset);
}

function nodeFocusByDataset(focusDataset) {
    let i = 1, data;
    for (const dataset in focusDataset) {
        if (i++ === Number(view.focus.level)) {
            data = focusDataset[dataset]; break;
        }
    }
    nodeFocus(data);
}

/**
 * Display nodes hidden by isolate(),
 * if their are not filtered
 */

function resetNodes() {
    view.focus = undefined;

    const idsToDisplay = index
        .filter(item => item.isolated === false && !getFiltedNodes().includes(item.id))
        .map(item => item.id);

    index = index.map(function(item) {
        item.isolated = false;
        return item;
    });

    view.focusMode = false;
    displayNodes(idsToDisplay);

    unactiveFromParent(document.getElementById('views-container'));

    resetIsolateBtn.style.display = null;
}

function parseIdsString(idsString) {
    return idsString.split(',').map(id => Number(id));
}