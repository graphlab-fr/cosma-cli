/**
 * Make zoom functionnal
 */

(function () {

    const zoomInterval = 0.3 // interval between two (de)zoom
        , zoomMax = 3
        , zoomMin = 0.6;
    
    svg.call(d3.zoom().on('zoom', function () {
        // for each move one the SVG
        if (d3.event.sourceEvent.type === 'wheel') {
            // by mouse wheel
            if (d3.event.sourceEvent.deltaY >= 0) {
                zoomLess();
            } else {
                zoomMore();
            }
        }
    
        if (d3.event.sourceEvent.type === 'mousemove') {
            // by drag and move with mouse
            view.position.x += d3.event.sourceEvent.movementX;
            view.position.y += d3.event.sourceEvent.movementY;
    
            translate();
        }
    }));

    function zoomMore() {
        view.position.zoom += zoomInterval;
    
        if (view.position.zoom >= zoomMax) {
            view.position.zoom = zoomMax; }
    
        translate();
    }
    
    function zoomLess() {
        view.position.zoom -= zoomInterval;
    
        if (view.position.zoom <= zoomMin) {
            view.position.zoom = zoomMin; }
    
        translate();
    }
    
    function zoomReset() {
        view.position.zoom = 1;
        view.position.x = 0;
        view.position.y = 0;
    
        translate();
    }
    
    // export functions on global name space
    window.zoomMore = zoomMore;
    window.zoomLess = zoomLess;
    window.zoomReset = zoomReset;
    
})();

/**
 * Change 'style' attribute of SVG to change view
 */
    
function translate() {
    if (!view.position.x || !view.position.y || !view.position.zoom) { return; }

    document.querySelector('#graph_canvas')
        .setAttribute('style', `transform:translate(${view.position.x}px, ${view.position.y}px) scale(${view.position.zoom});`);
}