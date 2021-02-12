/**
 * Make tag list functional
 */

(function () {
    const btns = document.querySelectorAll('[data-tag]');

    for (const btn of btns) {
        btn.addEventListener('click', () => {
            let elts = btn.dataset.tag.split(',')
                .map(id => document.querySelector('[data-node="' + id + '"]'));

            elts.forEach(node => {
                console.log(node);
            });
        })
    }
})();