/**
 * Take 'view' object values & encode them on base64
 * (no ACSII caracters are allowed)
 * @returns {string} - base64 string
 */

function registerView() {
    const activeFiltersNames = getActiveFilterNames();

    const viewObj = {
        recordId: view.openedRecord,
        filters: ((activeFiltersNames.length === 0) ? undefined : activeFiltersNames)
    }

    viewObj.focus = {
        fromRecordId: focus.focusedNodeId,
        level: focus.range.value
    };

    let key = JSON.stringify(viewObj);
    key = window.btoa(key);
    key = encodeURIComponent(key);
    return key;
}

/**
 * Copy registerView() output on clipboard
 */

function saveView() {
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = registerView();
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}

/**
 * Update 'view' object values from a encoded base64 string
 * @param {HTMLElement} viewBtn - The HTML button, container of the view data
 */

function changeView(viewBtn) {
    if (viewBtn.dataset.active === "true") {
        viewBtn.dataset.active = false;
        setFilters(getFilterNames());
        focus.disable();
        return;
    }

    viewBtn.dataset.active = true;

    let key = viewBtn.dataset.view;
    // base64 string contain an encoded image from the 'view' object
    key = decodeURIComponent(key);
    key = window.atob(key);
    key = JSON.parse(key);

    if (key.recordId) {
        openRecord(key.recordId, false); }

    if (key.filters) {
        setFilters(key.filters); }
    
    if (key.focus) {
        focus.init(key.focus.fromRecordId);
        focus.set(key.focus.level);
    }
}