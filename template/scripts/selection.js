const selectionMenu = document.querySelector('.menu-selection')
    , selectionList = selectionMenu.querySelector('div')
    , selectionCounter = selectionMenu.querySelector('.badge');

class Selection {

    constructor(title, id) {
        this.id = id;
        this.title = title;
        this.isHighlighted = false;
        this.container = document.createElement('fieldset');
        this.header = document.createElement('legend');
        this.highlightCheckbox = document.createElement('input');
        this.focusCheckbox = document.createElement('input');
    }

    static clear() {
        selectionList.innerHTML = '';
        view.selectedNodes = [];
    }

    static openMenu() {
        selectionMenu.classList.add('active');
    }

    static closeMenu() {
        selectionMenu.classList.remove('active');
    }

    static amountCounter() {
        selectionCounter.textContent = view.selectedNodes.length;

        if (view.selectedNodes.length === 0) {
            Selection.closeMenu();
        }

        if (view.selectedNodes.length <= 1) {
            Selection.openMenu();
        }
    }

    integrate() {

        for (const selectedNode of view.selectedNodes) {
            // do not if this.id is already selected
            if (selectedNode.id === this.id) { return; }
        }

        this.header.textContent = this.title;
        this.container.appendChild(this.header);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Fermer';
        closeBtn.classList.add('close');
        this.container.appendChild(closeBtn);

        closeBtn.addEventListener('click', (e) => {
            this.delete();
        });

        const inputContainer = document.createElement('div');
        this.container.appendChild(inputContainer);

        const highlightLabel = document.createElement('label');
        highlightLabel.textContent = 'Surbrillance';
        highlightLabel.insertBefore(this.highlightCheckbox, highlightLabel.firstChild);
        this.highlightCheckbox.setAttribute('type', 'checkbox');
        this.highlightCheckbox.checked = this.isHighlighted;
        inputContainer.appendChild(highlightLabel);

        this.highlightCheckbox.addEventListener('change', () => {
            if (this.highlightCheckbox.checked) {
                highlightNodes([this.id]);
            } else {
                unlightNode(this.id);
            }
        });

        // const focusLabel = document.createElement('label');
        // focusLabel.textContent = 'Focus';
        // focusLabel.appendChild(this.focusCheckbox);
        // this.focusCheckbox.setAttribute('type', 'range');
        // inputContainer.appendChild(focusLabel);

        selectionList.appendChild(this.container);
        
        view.selectedNodes.push(this);

        Selection.amountCounter();
    }

    delete() {
        this.container.remove();

        if (this.isHighlighted) { unlightNode(this.id); }

        view.selectedNodes = view.selectedNodes
            .filter(selectedNode => selectedNode.id !== this.id);

        Selection.amountCounter();
    }
    
}