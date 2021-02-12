/**
 * Make tag list functional
 */

(function () {
    const btns = document.querySelectorAll('[data-tag]');

    for (const btn of btns) {
        btn.addEventListener('click', () => {
            let nodeIds = btn.dataset.tag.split(',');
            unlightNodes();
            highlightNodes(nodeIds);
        })
    }
})();