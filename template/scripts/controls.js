(function () {
    document.querySelector('#control-stick').addEventListener('click', () => {
        document.querySelector('#control-list').classList.toggle('active');
        document.querySelector('#control-stick').classList.toggle('active');
    })
})();