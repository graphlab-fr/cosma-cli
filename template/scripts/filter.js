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
                view.activeFilters.push(btn.dataset.name);
            } else {
                displayNodes(nodeIds);
                btn.dataset.active = 'true';
                view.activeFilters = view.activeFilters.filter(filterName => filterName !== btn.dataset.name);
            }
        });
    }
})();

function activeFilter() {
    if (arguments[0].length === 0) { return; }
    let activeFilters = Array.from(arguments);

    activeFilters = activeFilters.map(filterName => document.querySelector('[data-filter][data-name="' + filterName + '"]'));

    for (const btn of activeFilters) {
        btn.dataset.active = 'false';

        const nodeIds = btn.dataset.filter.split(',').map(id => Number(id));

        hideNodes(nodeIds);
        btn.dataset.active = 'false';
        view.activeFilters.push(btn.dataset.name);
    }
}

function isolate() {
    let toDisplayIds = [];

    if (Array.isArray(arguments[0])) {
        toDisplayIds = arguments[0];
    } else {
        toDisplayIds = Array.from(arguments); // nodes to keep displayed
    }

    // get nodes to hide
    let toHideIds = allNodeIds.filter(id => toDisplayIds.indexOf(id) === -1);

    hideNodes(toHideIds);
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