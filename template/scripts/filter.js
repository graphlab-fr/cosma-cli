let nodeNetwork = undefined;

(function() {
    const btns = document.querySelectorAll('[data-filter]');

    for (const btn of btns) {
        btn.dataset.active = 'true';

        const nodeIds = btn.dataset.filter.split(',').map(id => Number(id));
        
        btn.addEventListener('click', () => {

            if (btn.dataset.active === 'true') {
                hideNodes(nodeIds);
                btn.dataset.active = 'false';
            } else {
                displayNodes(nodeIds);
                btn.dataset.active = 'true';
            }
        });
    }
})();

function isolate() {
    let nodeIds = Array.from(arguments); // nodes to keep displayed

    // get nodes to hide
    let hiddenNodes = allNodeIds.filter(id => nodeIds.indexOf(id) === -1);

    hideNodes(hiddenNodes);
}

function getLinksFromNode(nodeId) {
    let links = document.querySelectorAll('[data-source="' + nodeId + '"], [data-target="' + nodeId + '"]');
    return Array.from(links);
}

function hideNodes(nodeIds) {
    // compare already hidden nodes
    nodeIds = nodeIds.filter(id => view.hidenNodes.indexOf(Number(id)) === -1);
    
    const elts = getNodeNetwork(nodeIds);

    for (const elt of elts) {
        elt.style.display = 'none';
    }

    view.hidenNodes = view.hidenNodes.concat(nodeIds);
}

function displayNodes(nodeIds) {
    const elts = getNodeNetwork(nodeIds);

    for (const elt of elts) {
        elt.style.display = null;
    }

    view.hidenNodes = view.hidenNodes.filter(id => nodeIds.indexOf(id) === -1);
}