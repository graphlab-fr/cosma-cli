/**
 * Make search input functional
 */

(function() {
    let searchInput = document.querySelector('#search')
        , resultContainer = document.querySelector('#search-result-list')
        , maxResultNb = 5

    searchInput.value = ''; // reset at page loading

    searchInput.addEventListener('input', () => {
        // reset for each input valut modification
        resultContainer.innerHTML = '';

        if (searchInput.value === '') { return; }
        
        const resultList = fuse.search(searchInput.value);

        for (let i = 0; i < maxResultNb; i++) {
            let result = resultList[i];

            if (result === undefined) { break; }

            var resultElement = document.createElement('li');
            resultElement.classList.add('search-result', 'id-link');
            resultElement.textContent = result.item.title;
        
            resultElement.addEventListener('click', () => {
                openRecord(result.item.id);
            });

            resultContainer.appendChild(resultElement);
        }
    });
})();