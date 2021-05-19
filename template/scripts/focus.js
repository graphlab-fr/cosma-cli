/**
 * Display some nodes, hide all others
 * turn on the 'focusMode'
 * @param {string} nodeIdsList - List of ids from nodes to keep displayed, separeted by comas
 */

 function nodeFocus(nodeIdsList) {
    // nodeIdsList = parseIdsString(nodeIdsList);

    view.focusMode = false; // for reset

    let idsToHide = [];

    index = index.map(function(item) {
        if (nodeIdsList.includes(item.id)) {
            // if item comes from the nodeIdsList
            item.isolated = true;
        } else {
            item.isolated = false;
            idsToHide.push(item.id);
        }
        return item;
    });
    // display nodeIds if their are not filtered
    let idsToDisplay = nodeIdsList
        .filter(id => !getNodesHideByFilter().includes(id));

    hideNodes(idsToHide);
    view.focusMode = true;
    displayNodes(idsToDisplay);
}

const focus = {
    checkbox: document.getElementById('focus-check'),
    range: document.getElementById('focus-range'),
    isActive: false,
    focusedNodeId: undefined,
    focusedNode: undefined,
    levels: [],
    display : function() {
        // displaying
        this.checkbox.checked = true;
        this.range.classList.add('active');
        this.range.value = 1;
        // get infos about the focused node
        focusedNodeId = Number(view.openedRecordId);
        focusedNode = document.querySelector('[data-node="' + focusedNodeId + '"]');
        focusedNode.classList.add('focus');
        // get focus levels and limit it
        this.levels = graph.nodes.find(i => i.id === focusedNodeId).focus;
        this.range.setAttribute('max', this.levels.length)
        // launch use
        this.range.focus();
        this.set(1);
    },
    hide : function() {
        // displaying
        this.checkbox.checked = false;
        this.range.classList.remove('active');
        this.range.value = 1;
        // throw infos about the focuse
        focusedNode.classList.remove('focus');
        focusedNode = undefined;
        focusedNodeId = undefined;
        levels = [];
    },
    set: function(level) {
        this.isActive = true;

        // cut the levels array to keep the targeted level and others before
        level = this.levels.slice(0, level);
        level.push([focusedNodeId]); // add the node id as a level
        level = level.flat(); // merge all levels as one focus

        nodeFocus(level);
    },
    disable : function() {
        this.isActive = false;

        this.hide();
        resetFocus();
    }
}

focus.checkbox.addEventListener('change', () => {
    if (focus.checkbox.checked == true) {
        focus.display();
    } else {
        focus.disable();
    }
});

focus.range.addEventListener('change', () => {
    if (focus.range.value <= 1) {
        focus.range.value = 1; }

    focus.set(focus.range.value);
});

/**
 * Display nodes hidden by nodeFocus(),
 * if their are not filtered
 */

 function resetFocus() {
    view.focus = undefined;

    const idsToDisplay = index
        .filter(item => item.isolated === false && !getNodesHideByFilter().includes(item.id))
        .map(item => item.id);

    index = index.map(function(item) {
        item.isolated = false;
        return item;
    });

    view.focusMode = false;
    displayNodes(idsToDisplay);

    unactiveFromParent(document.getElementById('views-container'));
}