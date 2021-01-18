let openedRecord = undefined
    , highlightedNode = undefined
    , highlightedEdges = [];

function openRecord(id) {
    if (openedRecord !== undefined) {
        openedRecord.style.display = 'none'; }

    const recordContainer = document.querySelector('#record-container');
    recordContainer.classList.add('active');

    const elt = document.getElementById(id)
    elt.style.display = 'unset';

    recordContainer.scrollTo({ top: 0 });

    highlightNode(id);

    historique.actualiser(id);

    openedRecord = elt
}

function closeRecord() {
    openedRecord.style.display = 'none';
    openedRecord = undefined;
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
        edge.style.stroke = 'var(--underline)';
    }

    highlightedNode = document.querySelector('[data-node="' + nodeId + '"]');
    highlightedNode.style.fill = 'var(--underline)';
    highlightedNode.style.stroke = 'var(--underline)';
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