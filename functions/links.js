/**
 * Catch links from Mardown file content
 * @param {string} fileContent - Mardown file content
 * @returns {array} - Objets array : type & aim id of links
 */

 function catchLinksFromContent(fileContent) {
    let links = [];

    // get all paragraphs
    const paraphs = fileContent.match(/[^\r\n]+((\r|\n|\r\n)[^\r\n]+)*/g);

    if (paraphs === null) { return []; }

    for (let i = 0; i < paraphs.length; i++) {
        // get '***' from '[[***]]' (wikilinks) strings, for each paragraph
        let linksId = paraphs[i].match(/(?<=\[\[\s*).*?(?=\s*\]\])/gs);
        if (!linksId) { continue; }

        linksId = linksId
            .map(function(linkId) {
                linkId = normalizeLink(linkId);
                linkId.context = paraphs[i];
                linkId.paraphNum = i + 1;
                return linkId;
            });
        links = links.concat(linksId);
    }

    /**
     * Ignore duplicated links. We save the first occurrence,
     * the first paragraph where link is wrote down
     */

    let temp = []; // temp storage
    links = links.filter(function(link) {
        if (temp.indexOf(link.target.id) !== -1) {
            return false;
        }
        temp.push(link.target.id);
        return true;
    })

    if (links === null) { return []; }

    return links;
}

exports.catchLinksFromContent = catchLinksFromContent;

/**
 * Get node rank from number of links & backlinks
 * @param {int} backLinkNb - Number of backlinks
 * @param {int} linkNb - Number of links
 * @returns {int} - Rank
 */

function getRank(backLinkNb, linkNb) {
    let rank = 1;
    rank += ~~(linkNb / 2);
    rank += ~~(backLinkNb / 2);
    return rank;
}

exports.getRank = getRank;

/**
 * Add its type to the link & turn it to int value
 * @param {int} link - A link aim
 * @returns {int} - Objets : type & aim
 */

function normalizeLink(link) {
    link = link.split(':', 2);
    if (link.length === 2) {
        return {type: link[0], target: {id: Number(link[1])} };
    }
    return {type: 'undefined', target: {id: Number(link[0])} };
}

/**
 * Combining levels down to get radius fields
 * @param {string} content - Mardown file content
 * @param {object} file - File after links parsing
 * @returns {string} - Mardown content with converted links
 */

function convertLinks(content, file) {
    return content.replace(/(\[\[\s*).*?(\]\])/g, function(extract) { // get '[[***]]' strings
        let link = extract.slice(0, -2).slice(2); // extract link id, without '[[' & ']]' caracters

        link = normalizeLink(link).target.id;

        if (link === NaN) { return extract; } // only return the '[[***]]' string

        const associatedMetas = file.links.find(function(i) {
            return i.target.id === link;
        });

        if (associatedMetas === undefined) { return extract; } // only return the '[[***]]' string

        link = associatedMetas;
        // return '[[***]]' string into a Mardown link with openRecord function & class
        return `[${extract}](#${link.target.id}){title="${link.target.title}" onclick=openRecord(${link.target.id}) .id-link}`;        
    });
}

exports.convertLinks = convertLinks;