/**
 * Make search input functional
 */

let searchInput = document.querySelector('#search');

(function() {

let resultContainer = document.querySelector('#search-result-list')
    , maxResultNb = 5
    , resultList = []
    , selectedResult = 0
    , fuse;

searchInput.value = ''; // reset at page loading

searchInput.addEventListener('focus', () => {
    keyboardShortcutsAreWorking = false;

    // initialize search engine with no hidden nodes
    fuse = new Fuse(index.filter(item => item.hidden === false), {
        includeScore: false,
        keys: ['title']
    });

    searchInput.addEventListener('input', () => {
        // reset search results for each input value modification
        resultContainer.innerHTML = ''; selectedResult = 0; resultList = [];

        if (searchInput.value === '') { return; }
        
        resultList = fuse.search(searchInput.value);

        for (let i = 0; i < maxResultNb; i++) {
            let result = resultList[i];

            if (result === undefined) { break; }
            // include search result element on DOM
            var resultElement = document.createElement('li');
            resultElement.classList.add('search-result-item');
            resultElement.innerHTML =
            `<span class="record-type-point n_${result.item.type}">⬤</span>
            <span>${result.item.title}</span>`;
            resultContainer.appendChild(resultElement);

            if (i === 0) { activeOutline(resultElement); }
        
            resultElement.addEventListener('click', () => {
                openRecord(result.item.id); });
        }
    });

    document.addEventListener('keydown', keyboardResultNavigation)
});

searchInput.addEventListener('blur', () => {
    keyboardShortcutsAreWorking = true;
})

function keyboardResultNavigation(e) {
    if (resultList.length === 0) { return; }

    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault();

            if (selectedResult === 0) {
                searchInput.focus();
                return;
            }

            removeOutlineElt(resultContainer.childNodes[selectedResult]);
            selectedResult--;
            activeOutline(resultContainer.childNodes[selectedResult]);

            break;
        case 'ArrowDown':
            e.preventDefault();

            if (selectedResult === maxResultNb - 1 || selectedResult === resultList.length - 1) { return; }

            removeOutlineElt(resultContainer.childNodes[selectedResult]);
            selectedResult++;
            activeOutline(resultContainer.childNodes[selectedResult]);

            if (selectedResult === 1) {
                searchInput.blur();
            }

            break;
        case 'Enter':
            e.preventDefault();
            openRecord(resultList[selectedResult].item.id);
            searchInput.blur();
            break;
    }
}

function activeOutline(elt) {
    elt.classList.add('outline');
}

function removeOutlineElt(elt) {
    elt.classList.remove('outline');
}

})();