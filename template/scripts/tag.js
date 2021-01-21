(function () {
    document.querySelector('#tag-stick').addEventListener('click', () => {
        document.querySelector('#tag-list').classList.toggle('active');
        document.querySelector('#tag-stick').classList.toggle('active');
    })
})();

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