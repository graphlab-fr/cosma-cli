(function() {
    let searchInput = document.querySelector('#search')
    let searchResult = document.querySelector('#search-result-list')

    searchInput.value = '';

    searchInput.addEventListener('input', () => {

        searchResult.innerHTML = '';

        if (searchInput.value === '') { return; }
        
        const resultList = fuse.search(searchInput.value);

        for (let i = 0; i < 9; i++) {
            let result = resultList[i];

            if (result === undefined) { break; }

            var resultElement = document.createElement('li');
            resultElement.classList.add('search-result', 'id-link');
            resultElement.textContent = result.item.title;
            searchResult.appendChild(resultElement);
        
            resultElement.addEventListener('click', () => {
                openRecord(result.item.id);
            });

            // limit to 5 results
            if (i > 5) { break; }
        }
    });
})();