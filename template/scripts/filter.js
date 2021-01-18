(function() {
    const btns = document.querySelectorAll('[data-filter]');

    for (const btn of btns) {
        btn.dataset.active = 'true';

        btn.addEventListener('click', () => {
            let elts = btn.dataset.filter.split(',');
            elts = elts.map(id => document.querySelector('[data-node="' + id + '"]'))

            elts.forEach(node => {
                elts = elts.concat(
                Array.from(
                    document.querySelectorAll('[data-source="' + node.dataset.node + '"], [data-target="' + node.dataset.node + '"]')
                ) );
            });

            if (btn.dataset.active === 'true') {
                elts.forEach(elt => {
                    elt.style.display = 'none';
                });

                btn.dataset.active = 'false';
            } else {
                elts.forEach(elt => {
                    elt.style.display = null;
                });

                btn.dataset.active = 'true';
            }
        });
    }
})();