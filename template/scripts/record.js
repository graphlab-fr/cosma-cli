let openedRecord = undefined;
let highlightedNode = undefined;

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

    highlightedNode.style.fill = null;
    highlightedNode = undefined;
}

(function () {
    document.querySelector('#index-stick').addEventListener('click', () => {
        document.querySelector('#record-list').classList.toggle('active')
        document.querySelector('#index-stick').classList.toggle('active')
    })
})();

function highlightNode(nodeId) {
    if (highlightedNode !== undefined) {
        highlightedNode.style.fill = null; }

    highlightedNode = document.querySelector('[data-node="' + nodeId + '"]');
    highlightedNode.style.fill = 'red';
}