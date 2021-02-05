const historique = {
    actualiser: function(recordId) {
        if (history.state == null) { this.init(recordId); }
        else {
            var timeline = history.state.hist;
            timeline.push(recordId);
            history.pushState({hist : timeline}, 'record ' + recordId);
        }
    },
    init: function(recordId) {
        history.pushState({hist : [recordId]}, 'record ' + recordId);
    }
}

window.onpopstate = function(e) {
    if (e.state === null) { return; }

    var timeline = e.state.hist;

    var recordId = timeline[timeline.length - 1];

    openRecord(recordId, false);
};

const view = {
    highlightedNodes: [],
    activeFilters: [],
    hidenNodes: [],
    isolateId: undefined,
    openedRecord: undefined,
    position: {x: 0, y: 0, zoom: 1}
};

function registerView() {
    const viewObj = {
        recordId: view.openedRecord,
        pos : view.position,
        filters : ((view.activeFilters.length === 0) ? undefined : view.activeFilters),
        isolateId : view.isolateId
    }

    let key = JSON.stringify(viewObj);
    console.log(key);
    console.log('REGISTER');
    key = window.btoa(key);
    key = encodeURIComponent(key);
    return key;
}

function saveView() {
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = registerView();
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}

function changeView(key) {
    key = decodeURIComponent(key);
    key = window.atob(key);
    key = JSON.parse(key);

    view.position = key.pos;
    translate();

    if (key.recordId) {
        openRecord(key.recordId, false);
    }

    if (key.filters) {
        activeFilter(key.filters);
    }
    
    if (key.isolateId) {
        let nodeIds = document.getElementById(key.isolateId);
        nodeIds = nodeIds.getAttribute('onclick');
        nodeIds = nodeIds.split('(', 2)[1].split(')', 1)[0];
        nodeIds = nodeIds.split(',');
        nodeIds = nodeIds.map(id => Number(id));
        isolate(nodeIds);
    }
}