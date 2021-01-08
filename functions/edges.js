function getOutLinks(fileContent) {
    return (fileContent.match(/(?<=\[\[\s*).*?(?=\s*\]\])/gs) || []);
}

exports.getOutLinks = getOutLinks;

function getRank(outLink, inLink) {
    let rank = 1;
    rank += ~~(inLink / 3);
    rank += outLink / 3;
    return rank;
}

exports.getRank = getRank;