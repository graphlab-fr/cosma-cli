function getOutLinks(fileContent) {
    return (fileContent.match(/(?<=\[\[\s*).*?(?=\s*\]\])/gs) || []);
}

exports.getOutLinks = getOutLinks;

function getInLinks(linkList, fileId) {
    let i = linkList.reduce(function(n, val) {
        return n + (val === String(fileId));
    }, 0);

    return i;
}

exports.getInLinks = getInLinks;

function getRank(outLink, inLink) {
    let rank = 1;
    rank += ~~(inLink / 3);
    rank += outLink / 3;
    return rank;
}

exports.getRank = getRank;