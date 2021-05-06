/**
 * Make search input functional
 */

(function() {

let searchInput = document.querySelector('#search')
    , resultContainer = document.querySelector('#search-result-list')
    , maxResultNb = 5
    , fuse
    , selectedResult = 0
    , resultList = [];

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
        selectedResult = 0;
        resultList = [];

        if (searchInput.value === '') { return; }
        
        resultList = fuse.search(searchInput.value);

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

    document.addEventListener('keydown', keys)
});

function keys(e) {
    if (resultList.length === 0) { return; }

    switch (e.key) {
        case 'ArrowUp':

            if (selectedResult === 0) {
                searchInput.focus();
                return;
            }

            resultContainer.childNodes[selectedResult]
                .style.outline = null;

            selectedResult--;

            console.log(selectedResult);
            resultContainer.childNodes[selectedResult]
                .style.outline = 'var(--cosma-blue) solid 1px';
            break;
        case 'ArrowDown':

            if (selectedResult === maxResultNb - 1 || selectedResult === resultList.length - 1) { return; }

            resultContainer.childNodes[selectedResult]
                .style.outline = null;

            selectedResult++;

            searchInput.blur();
            
            
            console.log(selectedResult);
            resultContainer.childNodes[selectedResult]
                .style.outline = 'var(--cosma-blue) solid 1px';
            break;
        case 'Enter':
            openRecord(resultList[selectedResult].item.id);
            break;
    }
}

})();