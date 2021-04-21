/**
 * Open the record reading panel & show one
 * @param {array} id - Record/node id
 * @param {boolean} history - If history must be actualised, true by default
 */

function openRecord(id, history = true) {
    const recordContent = document.getElementById(id);

    if (!recordContent) { return; }

    if (view.openedRecord !== undefined) {
        // hide last record
        document.getElementById(view.openedRecord)
            .style.display = null;
    }

    // open records container
    window['record-container'].classList.add('active');
    // adjust record view
    window['record-container'].scrollTo({ top: 0 });

    // show record
    recordContent.style.display = 'block';

    // reset nodes highlighting
    unlightNodes();
    highlightNodes([id]);

    view.openedRecord = id;

    if (history) {
        // page's <title> become record's name
        const recordTitle = recordContent.querySelector('h1').textContent;
        historique.actualiser(id, recordTitle);
    }

}

/**
 * Close the record reading panel & the opended one
 */

function closeRecord() {
    document.querySelector('#record-container').classList.remove('active');
    window[view.openedRecord].style.display = null;
    view.openedRecord = undefined;

    unlightNodes();
}

/**
 * Open a record at page load if his id follow a '#' as '#20200801210302'
 */

window.addEventListener("DOMContentLoaded", () => {
    const hash = window.location.hash.substr(1);
    openRecord(hash);
});