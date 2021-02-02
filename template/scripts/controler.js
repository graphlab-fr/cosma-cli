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
    openedRecord: undefined,
    position: {x: 0, y: 0, zoom: 1},
    register: function() {
        const viewObj = {
            recordId: this.openedRecord,
            pos : this.position
        }

        return window.btoa(JSON.stringify(viewObj));
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

function changeView(viewString) {
    let viewSet = viewString;
    viewSet = window.atob(viewSet);
    viewSet = JSON.parse(viewSet);

    openRecord(viewSet.recordId, false);
    view.position = viewSet.pos;
    translate();
}