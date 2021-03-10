const indexContainer = document.getElementById('index');

/**
 * Display/hide lists from a 'data-sort' container
 * and animate the arrow
 */

 (function () {
    const sorters = document.querySelectorAll('details[data-sort]');
    for (const sorter of sorters) {
        const sorts = sorter.querySelectorAll('.sort');
        sorter.querySelector('.toggle').addEventListener('click', (e) => {
            e.target.classList.toggle('active');
            for (const sort of sorts) {  sort.classList.toggle('active'); }
        });
    }
})();

/**
 * Hide items from the index list that correspond to the nodes ids
 * @param {array} nodeIds - List of nodes ids
 */

function hideFromIndex(nodesIds) {
    for (const indexItem of nodesIds) {
        indexContainer.querySelector('[data-index="' + indexItem + '"]')
            .style.display = 'none';
    }
}

/**
 * Display items from the index list that correspond to the nodes ids
 * @param {array} nodeIds - List of nodes ids
 */

function displayFromIndex(nodesIds) {
    for (const indexItem of nodesIds) {
        indexContainer.querySelector('[data-index="' + indexItem + '"]')
            .style.display = null;
    }
}