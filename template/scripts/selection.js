const selectionMenu = document.querySelector('.menu-selection')
    , selectionList = selectionMenu.querySelector('div')
    , selectionCounter = selectionMenu.querySelector('.badge');

/**
 * Manage display of selected nodes
 * A node is selected from openRecord() and at click on node
 */

class Selection {

    constructor(title, id) {
        this.id = Number(id);
        this.title = title;
        this.isHighlighted = false;
        this.focusLevel = false;
        // selection container into menu
        this.container = document.createElement('fieldset');
        // selection title into menu
        this.header = document.createElement('legend');
        this.highlightCheckbox = document.createElement('input');
        this.focusRange = document.createElement('input');
    }

    /**
     * Empty selection lists, virtual and display
     */

    static clear() {
        selectionList.innerHTML = '';
        view.selectedNodes = [];

        Selection.count();
    }

    /**
     * Display selections list
     */

    static displayMenu() {
        selectionMenu.classList.add('active');
    }

    /**
     * Hide selections list
     */

    static hideMenu() {
        selectionMenu.classList.remove('active');
    }
    
    /**
     * Actualise number of selections
     * If there is no selection : hide selection menu and cancel focus
     */

    static count() {
        selectionCounter.textContent = view.selectedNodes.length;

        if (view.selectedNodes.length === 0) {
            Selection.hideMenu();
            focusSelection();
        }

        if (view.selectedNodes.length === 1) {
            Selection.displayMenu();
        }
    }

    /**
     * Add display into menu for the selection
     */

    integrate() {

        for (const selectedNode of view.selectedNodes) {
            // do not if this.id is already selected
            if (selectedNode.id === this.id) { return; }
        }

        /**
         * HEADER
         */

        this.header.textContent = this.title;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Fermer';
        closeBtn.classList.add('close');

        closeBtn.addEventListener('click', (e) => {
            this.delete();
        });

        this.container.appendChild(this.header);
        this.container.appendChild(closeBtn);

        /**
         * INPUTS
         */

        const inputContainer = document.createElement('div');

        /**
         * highlight
         */

        const highlightLabel = document.createElement('label');
        highlightLabel.textContent = 'Surbrillance';
        
        this.highlightCheckbox.setAttribute('type', 'checkbox');
        this.highlightCheckbox.checked = this.isHighlighted;
        
        highlightLabel.insertBefore(this.highlightCheckbox, highlightLabel.firstChild);

        this.highlightCheckbox.addEventListener('change', () => {
            if (this.highlightCheckbox.checked) {
                highlightNodes([this.id]);
            } else {
                unlightNode(this.id);
            }
        });

        /**
         * focus
         */

        // get levels of focus for the selection from node database
        let selecLevels = graph.nodes.find(i => i.id == this.id).focus;

        const focusLabel = document.createElement('label');
        focusLabel.textContent = 'Focus';
        
        const focusBadge = document.createElement('span');
        focusBadge.classList.add('badge');
        focusBadge.textContent = '/' + selecLevels.length;
        focusLabel.appendChild(focusBadge);
        
        const focusOutput = document.createElement('output');
        focusOutput.textContent = 0;

        this.focusRange.setAttribute('type', 'range');
        this.focusRange.setAttribute('value', 0);
        this.focusRange.setAttribute('min', 0);
        this.focusRange.setAttribute('max', selecLevels.length);

        focusBadge.appendChild(focusOutput);
        focusLabel.appendChild(this.focusRange);
        focusBadge.insertBefore(focusOutput, focusBadge.firstChild);

        this.focusRange.addEventListener('change', () => {

            focusOutput.textContent = this.focusRange.value;

            if (this.focusRange.value == 0) {
                this.focusLevel = false;
            } else {
                this.focusLevel = this.focusRange.value;
            }

            focusSelection();
        });

        
        inputContainer.appendChild(focusLabel);
        inputContainer.appendChild(highlightLabel);

        this.container.appendChild(inputContainer);
        selectionList.appendChild(this.container);

        // keep object into global view
        view.selectedNodes.push(this);

        Selection.count();
    }

    /**
     * Remove display from menu for the selection
     */

    delete() {
        this.container.remove();

        if (this.isHighlighted) { unlightNode(this.id); }

        view.selectedNodes = view.selectedNodes
            .filter(selectedNode => selectedNode.id !== this.id);

        Selection.count();
    }
}