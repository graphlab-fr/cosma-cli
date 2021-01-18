(function() {
    const btns = document.querySelectorAll('[data-filter]');

    for (const btn of btns) {
        btn.dataset.active = 'true';

        btn.addEventListener('click', () => {
            let elts = btn.dataset.filter.split(',');
            elts = elts.map(id => document.querySelector('[data-node="' + id + '"]'))

            elts.forEach(node => {
                let links = Array.from(document.querySelectorAll('[data-source="' + node.dataset.node + '"]'));
                let backLinks = Array.from(document.querySelectorAll('[data-target="' + node.dataset.node + '"]'));
                elts = elts.concat(links, backLinks);
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