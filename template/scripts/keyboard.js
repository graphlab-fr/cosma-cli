let keyboardShortcutsAreWorking = true;

/**
 * Keyboard shortcuts
 * @type {object}
 * @default
 */

const pressedKeys = {
    Control: false,
    Alt: false
};

document.onkeydown = (e) => {
 
    if (keyboardShortcutsAreWorking) {
 
        switch (e.key) {
            case 's':
                e.preventDefault();
                searchInput.focus();
                return;

            case 'r':
                e.preventDefault();
                zoomReset();
                return;

            case 'f':
                e.preventDefault();

                if (focus.isActive) {
                    focus.disable();
                } else {
                    focus.init();
                }
                return;

            case ' ':
                e.preventDefault();
                document.querySelector('.load-bar').click();
                return;
        }
    }
 
    switch (e.key) {
        case 'Escape':
            closeRecord();
            return;

        case 'Control':
            pressedKeys[e.key] = true;
            return;

        case 'Alt':
            pressedKeys[e.key] = true;
            return;
    }
 };
 
window.onkeyup = function(e) {
    switch (e.key) {
        case 'Control':
            pressedKeys[e.key] = false;
            return;

        case 'Alt':
            pressedKeys[e.key] = false;
            return;
    }
}