/**
 * Make search input functional
 */

(function() {

let searchInput = document.querySelector('#search')
    , resultContainer = document.querySelector('#search-result-list')
    , maxResultNb = 5
    , fuse;

searchInput.value = ''; // reset at page loading

searchInput.addEventListener('focus', () => {
    // initialize search engine with no hidden nodes
    fuse = new Fuse(index.filter(item => item.hidden === false), {
        includeScore: false,
        keys: ['title']
    });

    searchInput.addEventListener('input', () => {
        // reset search results for each input value modification
        resultContainer.innerHTML = '';

        if (searchInput.value === '') { return; }
        
        const resultList = fuse.search(searchInput.value);

        for (let i = 0; i < maxResultNb; i++) {
            let result = resultList[i];

            if (result === undefined) { break; }
            // include search result element on DOM
            var resultElement = document.createElement('li');
            resultElement.classList.add('search-result', 'id-link');
            resultElement.innerHTML =
            `<span class="type-point n_${result.item.type}">⬤</span>
            <span>${result.item.title}</span>`;
            resultContainer.appendChild(resultElement);
        
            resultElement.addEventListener('click', () => {
                openRecord(result.item.id);
            });
        }
    });
});

})();