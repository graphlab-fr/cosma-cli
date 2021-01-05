let openedRecord = undefined;

function openRecord(id) {
    if (openedRecord !== undefined) {
        openedRecord.style.display = 'none'; }

    const recordContainer = document.querySelector('#record-container');
    recordContainer.classList.add('active');

    const elt = document.getElementById(id)
    elt.style.display = 'unset';

    recordContainer.scrollTo({ top: 0 });

    historique.actualiser(id);

    openedRecord = elt
}

function closeRecord() {
    openedRecord.style.display = 'none';
    openedRecord = undefined;
    document.querySelector('#record-container').classList.remove('active')
}

(function () {
    document.querySelector('#index-stick').addEventListener('click', () => {
        document.querySelector('#record-list').classList.toggle('active')
        document.querySelector('#index-stick').classList.toggle('active')
    })
})();