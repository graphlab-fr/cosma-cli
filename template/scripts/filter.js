let nodeNetwork = undefined;

(function() {
    const btns = document.querySelectorAll('[data-filter]');

    for (const btn of btns) {
        btn.dataset.active = 'false';

        const nodeIds = btn.dataset.filter.split(',').map(id => Number(id));
        
        btn.addEventListener('click', () => {

            if (btn.dataset.active === 'true') {
                displayNodes(nodeIds);
                view.activeFilters = view.activeFilters.filter(filterName => filterName !== btn.dataset.name);
                btn.dataset.active = 'false';
            } else {
                hideNodes(nodeIds);
                view.activeFilters.push(btn.dataset.name);
                btn.dataset.active = 'true';
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
    displayNodes(toDisplayIds);
}

function getLinksFromNode(nodeId) {
    let links = document.querySelectorAll('[data-source="' + nodeId + '"], [data-target="' + nodeId + '"]');
    return Array.from(links);
}

function hideNodes(nodeIds) {
    const elts = getNodeNetwork(nodeIds);

    // compare already hidden nodes
    nodeIds = nodeIds.filter(id => view.hidenNodes.indexOf(Number(id)) === -1);

    view.hidenNodes = view.hidenNodes.concat(nodeIds);
    

    for (const elt of elts) {
        elt.style.display = 'none';
    }
}

function displayNodes(nodeIds) {
    view.hidenNodes = view.hidenNodes.filter(id => nodeIds.indexOf(id) === -1);
    
    const elts = getNodeNetwork(nodeIds);

    for (const elt of elts) {
        elt.style.display = null;
    }
}

function resetNodes() {
    let nodeIds = document.querySelectorAll('[data-filter][data-active="true"]');
    nodeIds = Array.from(nodeIds)
        .map(filter => filter.dataset.filter.split(',')).flat()
        .map(nodeId => Number(nodeId));

    // const toDisplayIds = allNodeIds.filter(id => toDisplayIds.indexOf(id) === -1);
    const toDisplayIds = allNodeIds.filter(id => nodeIds.indexOf(id) === -1);
    displayNodes(toDisplayIds);
}