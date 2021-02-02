function openRecord(id, history = true) {
    if (view.openedRecord !== undefined) {
        // hide last record
        document.getElementById(view.openedRecord)
            .style.display = 'none';
    }

    if (id === undefined) {
        document.querySelector('#record-container').classList.remove('active');
        return;
    }

    // open records container
    const recordContainer = document.querySelector('#record-container');
    recordContainer.classList.add('active');

    // show record
    const elt = document.getElementById(id);
    elt.style.display = 'unset';

    // page's <title> become record's name
    const recordTitle = elt.querySelector('h1').textContent;
    document.title = recordTitle + ' - Cosma';

    // adjust record view
    recordContainer.scrollTo({ top: 0 });

    unlightNodes();
    highlightNodes([id]);

    view.openedRecord = id;
    view.register();

    if (history) {
        historique.actualiser(id);}

}

function closeRecord() {
    document.getElementById(view.openedRecord).style.display = 'none';
    view.openedRecord = undefined;
    document.querySelector('#record-container').classList.remove('active');

    unlightNodes();
}

(function () {
    document.querySelector('#index-stick').addEventListener('click', () => {
        document.querySelector('#record-list').classList.toggle('active')
        document.querySelector('#index-stick').classList.toggle('active')
        document.querySelector('#sort-box').classList.toggle('active')
    })
})();

function highlightNodes(nodeIds) {

    const elts = getNodeNetwork(nodeIds);

    for (const elt of elts) {
        elt.style.stroke = 'var(--highlight)';
        elt.style.fill = 'var(--highlight)';
    }

    view.highlightedNodes = view.highlightedNodes.concat(nodeIds);
}

function unlightNodes() {
    if (view.highlightedNodes.length === 0) { return; }


    const elts = getNodeNetwork(view.highlightedNodes);

    for (const elt of elts) {
        elt.style.stroke = null;
        elt.style.fill = null;
    }
}

function getNodeNetwork(nodeIds) {

    let nodes = [], edges = [];

    for (const nodeId of nodeIds) {
        nodes.push(document.querySelector('[data-node="' + nodeId + '"]'));

        let tempEdges = document.querySelectorAll('[data-source="' + nodeId + '"], [data-target="' + nodeId + '"]');
        tempEdges = Array.from(tempEdges);
        edges = edges.concat(tempEdges);
    }

    // delete duplicated elts
    edges = edges.filter((item, index) => {
        return edges.indexOf(item) === index
    });

    return nodes.concat(edges);
}