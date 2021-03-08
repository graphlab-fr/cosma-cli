/**
 * Open the record reading panel & show one
 * @param {array} id - Record/node id
 * @param {boolean} history - If history must be actualised, true by default
 */

function openRecord(id, history = true) {
    if (view.openedRecord !== undefined) {
        // hide last record
        document.getElementById(view.openedRecord)
            .style.display = null;
    }

    // open records container
    window['record-container'].classList.add('active');

    // show record
    const recordContent = document.getElementById(id);
    recordContent.style.display = 'block';

    // page's <title> become record's name
    const recordTitle = recordContent.querySelector('h1').textContent;
    document.title = recordTitle + ' - Cosma';

    // adjust record view
    window['record-container'].scrollTo({ top: 0 });


    // reset nodes highlighting
    unlightNodes();
    highlightNodes([id]);

    view.openedRecord = id;

    if (history) {
        historique.actualiser(id);}

}

/**
 * Close the record reading panel & the opended one
 */

function closeRecord() {
    window[view.openedRecord].style.display = null;
    view.openedRecord = undefined;
    document.querySelector('#record-container').classList.remove('active');

    unlightNodes();
}

/**
 * Display/hide lists from a 'data-sort' container
 * and animate the arrow
 */

(function () {
    const sorters = document.querySelectorAll('details[data-sort]');
    for (const sorter of sorters) {
        const sorts = sorter.querySelectorAll('ul.sort');
        sorter.querySelector('.toggle').addEventListener('click', (e) => {
            e.target.classList.toggle('active');
            for (const sort of sorts) {  sort.classList.toggle('active'); }
        });
    }
})();