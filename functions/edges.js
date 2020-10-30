function extractAll(fileContent) {
    return (fileContent.match(/(?<=\[\[\s*).*?(?=\s*\]\])/gs) || []);
}

exports.extractAll = extractAll;

function getNbLink(linkList, fileId) {
    let i = linkList.reduce(function(n, val) {
        return n + (val === String(fileId));
    }, 0);

    return i;
}

function getRank(linkList, fileId) {
    let rank = 1;
    rank += ~~(getNbLink(linkList, fileId) / 3);
    return rank;
}

exports.getRank = getRank;