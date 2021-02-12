/**
 * Take 'view' object values & encode them on base64
 * (no ACSII caracters are allowed)
 * @returns {string} - base64 string
 */

function registerView() {
    const viewObj = {
        recordId: view.openedRecord,
        pos : view.position,
        filters : ((view.activeFilters.length === 0) ? undefined : view.activeFilters),
        isolateId : view.isolateId
    }

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
 * @param {string} key - base64 string contain an encoded image from the 'view' object
 */

function changeView(key) {
    key = decodeURIComponent(key);
    key = window.atob(key);
    key = JSON.parse(key);

    view.position = key.pos;
    translate();

    if (key.recordId) {
        openRecord(key.recordId, false); }

    if (key.filters) {
        setFilters(key.filters); }
    
    if (key.isolateId) {
        isolateByElement(key.isolateId); }
}