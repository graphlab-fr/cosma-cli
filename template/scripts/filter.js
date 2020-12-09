(function() {
    const btns = document.querySelectorAll('[data-filter]');
    for (const btn of btns) {
        console.log(btn);

        btn.addEventListener('click', () => {
            if (btn.dataset.filter === 'reset') {
                initializeDisplay();
            }
            initializeDisplay(btn.dataset.filter);
        });
    }
})();