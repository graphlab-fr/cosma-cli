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
    const elt = window[id];
    elt.style.display = 'unset';

    // page's <title> become record's name
    const recordTitle = elt.querySelector('h1').textContent;
    document.title = recordTitle + ' - Cosma';

    // adjust record view
    recordContainer.scrollTo({ top: 0 });

    unlightNodes();
    highlightNodes([id]);

    view.openedRecord = id;

    if (history) {
        historique.actualiser(id);}

}

function closeRecord() {
    window[view.openedRecord].style.display = 'none';
    view.openedRecord = undefined;
    document.querySelector('#record-container').classList.remove('active');

    unlightNodes();
}