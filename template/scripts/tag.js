function tag(tagElt) {
    const nodeIds = tagList[tagElt.dataset.tag - 1].nodes // 'tagList' is global var, set from template.njk
        , isActive = tagElt.dataset.active
        // tag brothers from sort div's
        , tagBtns = document.querySelectorAll('[data-tag="' + tagElt.dataset.tag + '"]');

    if (isActive === 'true') {
        tagBtns.forEach(tagBtn => { tagBtn.dataset.active = false; });
        // hide all items from index, then show the highlighted ones or all if there is any highlighted
        hideAllFromIndex(graph.nodes.map(node => node.id));
        labelUnlight(nodeIds);
        let indexItemstoShow = graph.nodes.filter(node => node.highlighted === true).map(node => node.id);
        if (indexItemstoShow.length === 0) { displayAllFromIndex(); }
        else { displayFromIndex(indexItemstoShow); }

        iterateCounter(document.getElementById('tag-counter'), 1);
    } else {
        tagBtns.forEach(tagBtn => { tagBtn.dataset.active = true; });
        // hide all items from index, then show the highlighted ones
        hideAllFromIndex(graph.nodes.map(node => node.id));
        labelHighlight(nodeIds);
        displayFromIndex(graph.nodes.filter(node => node.highlighted === true).map(node => node.id));

        iterateCounter(document.getElementById('tag-counter'), -1);
    }
    
    setCounter(counters.tag
        , document.querySelectorAll('[data-tag][data-active="true"]').length / 2);
}