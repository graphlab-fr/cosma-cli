let openedRecord = undefined;

function openRecord(id) {
    if (openedRecord !== undefined) {
        openedRecord.style.display = 'none';
    }

    const elt = document.getElementById(id)
    elt.style.display = 'unset';
    console.log(elt);

    openedRecord = elt
}

function closeRecord() {
    openedRecord.style.display = 'none';
    openedRecord = undefined;
}