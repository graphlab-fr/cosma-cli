const view = {
        highlightedNodes: [],
        activeFilters: [],
        hidenNodes: [],
        isolateId: undefined,
        openedRecord: undefined,
        position: {x: 0, y: 0, zoom: 1}
    }
    , svg = d3.select("#graph_canvas");

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