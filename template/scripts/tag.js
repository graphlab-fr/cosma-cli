function tag(tagElt) {
    const tagNumber = tagElt.dataset.tag
        , nodeIds = tagList[tagNumber - 1].nodes
        , isActive = tagElt.dataset.active
        , tagBtns = document.querySelectorAll('[data-tag="' + tagNumber + '"]');

    if (isActive === 'true') {
        tagBtns.forEach(tagBtn => { tagBtn.dataset.active = false; });
        labelUnlight(nodeIds);
        setCounter(document.getElementById('tag-counter'), 1);
    } else {
        tagBtns.forEach(tagBtn => { tagBtn.dataset.active = true; });
        labelHighlight(nodeIds);
        setCounter(document.getElementById('tag-counter'), -1);
    }
}