let nodeNetwork = undefined;

(function() {
    const btns = document.querySelectorAll('[data-filter]');

    for (const btn of btns) {
        btn.dataset.active = 'true';

        btn.addEventListener('click', () => {
            let elts = btn.dataset.filter.split(',');
            elts = elts.map(id => document.querySelector('[data-node="' + id + '"]'))

            elts.forEach(node => {
                elts = elts.concat(
                Array.from(
                    document.querySelectorAll('[data-source="' + node.dataset.node + '"], [data-target="' + node.dataset.node + '"]')
                ) );
            });

            if (btn.dataset.active === 'true') {
                elts.forEach(elt => {
                    elt.style.display = 'none';
                });

                btn.dataset.active = 'false';
            } else {
                elts.forEach(elt => {
                    elt.style.display = null;
                });

                btn.dataset.active = 'true';
            }
        });
    }
})();

function isolate(nodeId) {
    nodeNetwork = nodeId;

    const links = document.querySelectorAll('[data-source="' + nodeId + '"]')
    const backlinks = document.querySelectorAll('[data-target="' + nodeId + '"]')
    
    let connectedElements = [document.querySelector('[data-node="' + nodeId + '"]')];
    connectedElements = connectedElements.concat(Array.from(links), Array.from(backlinks));

    for (const link of links) {
        connectedElements = connectedElements.concat(Array.from(document.querySelectorAll('[data-node="' + link.dataset.target + '"]')));
    }

    for (const link of backlinks) {
        connectedElements = connectedElements.concat(Array.from(document.querySelectorAll('[data-node="' + link.dataset.source + '"]')));
    }

    document.querySelectorAll('#graph_canvas line, #graph_canvas circle').forEach(elt => {
        elt.style.display = 'none';
    });

    connectedElements.forEach(elt => {
        elt.style.display = null;
    });
    
}