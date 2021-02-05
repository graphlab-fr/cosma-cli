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
    openedRecord: undefined,
    position: {x: 0, y: 0, zoom: 1},
    register: function() {
        const viewObj = {
            recordId: this.openedRecord,
            pos : this.position,
            filters : this.activeFilters
        }

        let key = JSON.stringify(viewObj);
        key = window.btoa(key);
        key = encodeURIComponent(key);
        return key;
    }
};

function saveView() {
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = view.register();
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}

function changeView(key) {
    key = decodeURIComponent(key);
    key = window.atob(key);
    key = JSON.parse(key);

    openRecord(key.recordId, false);
    view.position = key.pos;
    translate();
    activeFilter(key.filters);
}