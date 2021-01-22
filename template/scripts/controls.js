(function () {
    document.querySelector('#control-stick').addEventListener('click', () => {
        document.querySelector('#control-list').classList.toggle('active');
        document.querySelector('#control-stick').classList.toggle('active');
    })
})();

(function () {
    const zoomInterval = 0.3
        , zoomMax = 3
        , zoomMin = 0.6;

    let zoom = 1,
        x = 0,
        y = 0;

    svg.call(d3.zoom().on('zoom', function () {

        if (d3.event.sourceEvent.type === 'wheel') {

            if (d3.event.sourceEvent.deltaY >= 0) {
                zoomLess();
            } else {
                zoomMore();
            }
        }

        if (d3.event.sourceEvent.type === 'mousemove') {
            
            x += d3.event.sourceEvent.movementX;
            y += d3.event.sourceEvent.movementY;
    
            translate(zoom, x, y);
        }
    }));

    document.querySelector('#zoom-more')
        .addEventListener('click', zoomMore);

    document.querySelector('#zoom-less')
        .addEventListener('click', zoomLess);

    document.querySelector('#zoom-reset')
        .addEventListener('click', () => {
            zoom = 1;
            x = 0;
            y = 0;

            translate(zoom, x, y);
        });

    function zoomMore() {
        zoom += zoomInterval;

        if (zoom >= zoomMax) {
            zoom = zoomMax; }

        translate(zoom, x, y);
    }

    function zoomLess() {
        zoom -= zoomInterval;

        if (zoom <= zoomMin) {
            zoom = zoomMin; }

        translate(zoom, x, y);
    }

    function translate(zoom, x, y) {
        document.querySelector('#graph_canvas')
            .setAttribute('transform', `translate(${x}, ${y}) scale(${zoom})`);
    }
})();