let nodeNetwork = undefined;

(function() {
    const btns = document.querySelectorAll('[data-filter]');

    for (const btn of btns) {
        btn.dataset.active = 'true';

        const nodesIds = btn.dataset.filter.split(',');
        
        btn.addEventListener('click', () => {
            
            const elts = getNodeNetwork(nodesIds);

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

function isolate() {
    const ids = Array.from(arguments);
    const nodes = ids.map(function(nodeId) {
        return document.querySelector('[data-node="' + nodeId + '"]');
    });

    let elts = nodes;

    for (const node of nodes) {
        const links = document.querySelectorAll('[data-source="' + node.dataset.node + '"]')
        const backlinks = document.querySelectorAll('[data-target="' + node.dataset.node + '"]')
        
        elts = elts.concat(Array.from(links), Array.from(backlinks));

        for (const link of links) {
            elts.push(document.querySelector('[data-node="' + link.dataset.target + '"]'));
        }

        for (const link of backlinks) {
            elts.push(document.querySelector('[data-node="' + link.dataset.source + '"]'));
        }
    }

    document.querySelectorAll('#graph_canvas line, #graph_canvas circle').forEach(elt => {
        elt.style.display = 'none';
    });

    elts = elts.filter((item, index) => {
        return elts.indexOf(item) === index
    });

    elts.forEach(elt => {
        elt.style.display = null;
    });
}

function getLinksFromNode(nodeId) {
    let links = document.querySelectorAll('[data-source="' + nodeId + '"], [data-target="' + nodeId + '"]');
    return Array.from(links);
}