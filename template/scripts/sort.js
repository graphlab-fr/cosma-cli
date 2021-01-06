(function () {
    let activeList = document.querySelector('.record-sorting.active');
    const btns = document.querySelectorAll('[data-sort]');

    for (const btn of btns) {
        const linkedList = document.getElementById(btn.dataset.sort);

        btn.addEventListener('click', () => {
            if (linkedList === activeList) { return; }

            activeList.classList.remove('active');
            linkedList.classList.add('active');

            activeList = linkedList;
        })
    }
})();