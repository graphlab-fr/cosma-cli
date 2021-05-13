/**
 * Display some nodes, hide all others
 * turn on the 'focusMode'
 * @param {string} nodeIdsList - List of ids from nodes to keep displayed, separeted by comas
 */

 function nodeFocus(nodeIdsList) {
    nodeIdsList = parseIdsString(nodeIdsList);

    view.focusMode = false; // for reset

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
        .filter(id => !getNodesHideByFilter().includes(id));

    hideNodes(idsToHide);
    view.focusMode = true;
    displayNodes(idsToDisplay);
}

/**
 * Active nodeFocusByDataset() function with information from the view
 * We search the data-focus value from a button, from a record
 * @param {number} recordId - Id of the target record
 * @param {number} focusLevel - Focus level = focus button number - 1
 */

function nodeFocusByView(recordId, focusLevel) {
    const focusRecord = document.getElementById(recordId)
        , focusOutput = focusRecord.querySelector('output')
        , focusCheck = focusRecord.querySelector('input[type="checkbox"]')
        , focusRange = focusRecord.querySelector('input[type="range"]');

    focusRange.value = focusLevel;

    setNodeFocus(focusCheck, focusRange, focusOutput, recordId);

    nodeFocusByDataset(focusRange.dataset);
}

/**
 * Extract string of nodes ids from a dataset list
 * The list is selected by its index, get by 'view.focus.level'
 * @param {DOMStringMap} focusDataset - All data-* from input range focus
 */

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
 * Display the focus range and set the 'view.focus' value
 * for use nodeFocusByDataset() function
 * @param {HTMLElement} checkbox - From focus <form>
 * @param {HTMLElement} range - From focus <form>
 * @param {HTMLElement} output - From focus <form>
 * @param {HTMLElement} recordId - Id of record
 */

function setNodeFocus(checkbox, range, output, recordId) {
    checkbox.checked = true;
    range.parentElement.style.display = 'unset';
    range.focus();

    output.value = range.value;

    view.focus = {
        fromRecordId: recordId,
        level: Number(range.value)
    }
}

/**
 * For each click on form focus checkbox
 * Check if its checked
 * If false : hide focus range and reset focus
 * Else : focus at first level
 * @param {HTMLElement} checkbox - From focus <form>
 * @param {HTMLElement} range - From focus <form>
 * @param {HTMLElement} output - From focus <form>
 * @param {HTMLElement} recordId - Id of record
 */

function checkFocus(checkbox, range, output, recordId) {
    if (checkbox.checked == false) {
        range.value = 0;
        output.value = range.value;
        range.parentElement.style.display = 'none';
        resetFocus();
        return;
    }

    range.value = 1;

    setNodeFocus(checkbox, range, output, recordId);

    nodeFocusByDataset(range.dataset);
}

/**
 * For each value change from the form focus range
 * Check the value
 * If 0 : hide focus range, uncheked checkbox and reset focus
 * Else : focus at value level
 * @param {HTMLElement} range - From focus <form>
 * @param {HTMLElement} checkbox - From focus <form>
 * @param {HTMLElement} output - From focus <form>
 * @param {HTMLElement} recordId - Id of record
 */

function rangeFocus(range, checkbox, output, recordId) {
    const level = range.value;
    output.value = level;
    if (level == 0) {
        checkbox.checked = false;
        range.parentElement.style.display = 'none';
        resetFocus();
        return;
    }

    setNodeFocus(checkbox, range, output, recordId);

    nodeFocusByDataset(range.dataset);
}

/**
 * Display nodes hidden by nodeFocus(),
 * if their are not filtered
 */

 function resetFocus() {
    view.focus = undefined;

    const idsToDisplay = index
        .filter(item => item.isolated === false && !getNodesHideByFilter().includes(item.id))
        .map(item => item.id);

    index = index.map(function(item) {
        item.isolated = false;
        return item;
    });

    view.focusMode = false;
    displayNodes(idsToDisplay);

    unactiveFromParent(document.getElementById('views-container'));
}