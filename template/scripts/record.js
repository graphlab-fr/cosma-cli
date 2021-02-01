let highlightedNode = undefined
    , highlightedEdges = [];

function openRecord(id, history = true) {
    if (id === undefined) {
        return; }

    if (view.openedRecord !== undefined) {
        // hide last record
        document.getElementById(view.openedRecord)
            .style.display = 'none';
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

    highlightNode(id);

    view.openedRecord = id;
    view.register();

    if (history) {
        historique.actualiser(id);}

}

function closeRecord() {
    document.getElementById(view.openedRecord).style.display = 'none';
    view.openedRecord = undefined;
    document.querySelector('#record-container').classList.remove('active')

    unlightNode();
}

(function () {
    document.querySelector('#index-stick').addEventListener('click', () => {
        document.querySelector('#record-list').classList.toggle('active')
        document.querySelector('#index-stick').classList.toggle('active')
        document.querySelector('#sort-box').classList.toggle('active')
    })
})();

function highlightNode(nodeId) {
    unlightNode();

    highlightedEdges = document.querySelectorAll('[data-source="' + nodeId + '"], [data-target="' + nodeId + '"]');
    for (const edge of highlightedEdges) {
        edge.style.stroke = 'var(--highlight)';
    }

    highlightedNode = document.querySelector('[data-node="' + nodeId + '"]');
    highlightedNode.style.fill = 'var(--highlight)';
    highlightedNode.style.stroke = 'var(--highlight)';
}

function unlightNode() {
    if (highlightedNode !== undefined) {
        highlightedNode.style.fill = null;
        highlightedNode.style.stroke = null;
    }

    if (highlightedEdges !== []) {
        for (const edge of highlightedEdges) {
            edge.style.stroke = null;
        }
    }
}