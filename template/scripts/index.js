const indexContainer = document.getElementById('index');

/**
 * Display/hide lists from a 'data-sort' container
 * and animate the arrow
 */

 (function () {
    const sortContainer = document.querySelectorAll('[data-sort]');
    for (const container of sortContainer) {
        const box = container.querySelectorAll('.sort-box')
            , increasing = box[0]
            , decreasing = box[1]
            , btn = container.querySelector('.sort-btn');

        let isIncreasing = true;

        btn.addEventListener('click', () => {
            if (isIncreasing) {
                btn.textContent = 'Z-A';
                increasing.classList.remove('active'); decreasing.classList.add('active');
                isIncreasing = false;
            } else {
                btn.textContent = 'A-Z';
                increasing.classList.add('active'); decreasing.classList.remove('active');
                isIncreasing = true;
            }
        });
    }
})();

/**
 * Highligth clicked tag button
 * @param {HTMLElement} button - clicked tag button
 */

 function activeTagButton(button) {
    const tagName = button.dataset.tag;

    document.querySelectorAll('[data-tag="' + tagName + '"]')
        .forEach(button => { button.classList.add('active'); });

    view.activeTag = tagName;
}

/**
 * Highligth clicked element and unlighligth the others from the same parent
 * @param {HTMLElement} child - clicked element
 */

function activeFromParent(child) {
    const activeElt = child.parentNode.querySelector(child.tagName + '.active');

    if (activeElt) {
        activeElt.classList.remove('active')
        activeElt.style.borderColor = null;
    }

    child.classList.add('active')
}

/**
 * Unlighligth all activated elements from parent
 * @param {HTMLElement} parent - parent of elements
 */

function unactiveFromParent(parent) {
    const activeElt = parent.querySelector('.active');

    if (activeElt) {
        activeElt.classList.remove('active');
    }
}

/**
 * Unlighligth all activated tag buttons from parent
 */

function unactiveTagsButton() {
    unactiveFromParent(document.getElementById('tags-container'));
}

/**
 * Hide items from the index list that correspond to the nodes ids
 * @param {array} nodeIds - List of nodes ids
 */

function hideFromIndex(nodesIds) {
    for (const indexItem of nodesIds) {
        indexContainer.querySelectorAll('[data-index="' + indexItem + '"]')
            .forEach(elt => {
                elt.style.display = 'none';
            });
    }

    setCounter(document.getElementById('index-counter'), -Math.abs(nodesIds.length));
}

/**
 * Display items from the index list that correspond to the nodes ids
 * @param {array} nodeIds - List of nodes ids
 */

function displayFromIndex(nodesIds) {
    for (const indexItem of nodesIds) {
        indexContainer.querySelector('[data-index="' + indexItem + '"]')
            .style.display = null;
    }

    setCounter(document.getElementById('index-counter'), nodesIds.length);
}

 function setCounter(counterElt, value) {
    let counterNumber = counterElt.textContent.split('/', 2);

    if (counterNumber.length === 1) { // if there is a '/' into counter text content
        counterElt.textContent = (Number(counterNumber[0]) + value) + '/' + counterNumber[0]
    } else if (Number(counterNumber[0]) + value === Number(counterNumber[1])) {
        counterElt.textContent = counterNumber[1];
    } else {
        counterElt.textContent = (Number(counterNumber[0]) + value) + '/' + counterNumber[1]
    }
}