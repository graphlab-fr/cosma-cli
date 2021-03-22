const indexContainer = document.getElementById('index');

/**
 * Display/hide lists from a 'data-sort' container
 * and animate the arrow
 */

 (function () {
    const sortContainer = document.querySelectorAll('[data-sort]');
    for (const container of sortContainer) {
        const box = container.querySelectorAll('.sort-box')
            , increasing = box[0]
            , decreasing = box[1]
            , btn = container.querySelector('.sort-btn');

        let isIncreasing = true;

        btn.addEventListener('click', () => {
            if (isIncreasing) {
                btn.textContent = 'Z-A';
                increasing.classList.remove('active'); decreasing.classList.add('active');
                isIncreasing = false;
            } else {
                btn.textContent = 'A-Z';
                increasing.classList.add('active'); decreasing.classList.remove('active');
                isIncreasing = true;
            }
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