const view = {
        // actualised from nodes.js
        highlightedNodes: [],
        hidenNodes: [],
        // actualised from filter.js
        activeFilters: [],
        isolateId: undefined, 
        // actualised from record.js
        openedRecord: undefined,
        // actualised from zoom.js
        position: {x: 0, y: 0, zoom: 1}
    }
    , svg = d3.select("#graph_canvas");

const historique = {
    actualiser: function(recordId) {
        // add opened record id to history
        if (history.state == null) { this.init(recordId); }
        else {
            const timeline = history.state.hist;
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
    // update opened record at history backward
    const timeline = e.state.hist
        , recordId = timeline[timeline.length - 1];

    openRecord(recordId, false);
};