const view = {
        // actualised from nodes.js
        highlightedNodes: [],
        isolateMode: false,
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
    actualiser: function(recordId, recordTitle) {
        // add opened record id to history
        if (history.state == null) { this.init(recordId, recordTitle); }
        else {
            const timeline = history.state.hist;
            timeline.push(recordId);
            history.pushState({hist : timeline}, recordTitle);
        }

        // change page title
        document.title = recordTitle + ' - Cosma';
        window.location.hash = recordId;
    },
    init: function(recordId, recordTitle) {
        history.pushState({hist : [recordId]}, recordTitle);
    }
}

window.onpopstate = function(e) {
    if (e.state === null) { return; }
    // update opened record at history backward
    const timeline = e.state.hist
        , recordId = timeline[timeline.length - 1];

    openRecord(recordId, false);
};