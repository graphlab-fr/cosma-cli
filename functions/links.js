const mdIt = require('markdown-it')()
    , mdItAttr = require('markdown-it-attrs');

// markdown-it plugin
mdIt.use(mdItAttr, {
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: []
})

/**
 * Catch links from Mardown file content
 * @param {string} fileContent - Mardown file content
 * @returns {array} - Objets array : type & aim id of links
 */

 function catchLinksFromContent(fileContent) {
    let tLinks = {}, // temp link container
    links = []; // final link container

    // get all paragraphs from the file content
    const paraphs = fileContent.match(/[^\r\n]+((\r|\n|\r\n)[^\r\n]+)*/g);

    if (paraphs === null) { return []; }

    for (let i = 0; i < paraphs.length; i++) {
        // get string '***' from '[[***]]' (wikilinks), for each paragraph
        let linksId = paraphs[i].match(/(?<=\[\[\s*).*?(?=\s*\]\])/gs);
        if (!linksId) { continue; }

        for (const linkId of linksId) {
            // each linkId is put to 'tLinks', for get a list witout duplicated links
            if (tLinks[linkId]) {
                // if the linkId is already registered, we juste save one more paragraph number
                tLinks[linkId].paraphs.push(i)
            } else {
                // if the linkId is new, we register its type and a paragraph number
                tLinks[linkId] = normalizeLink(linkId);
                tLinks[linkId].paraphs = [i]
            }
        }
    }

    for (const linkMetas in tLinks) {
        tLinks[linkMetas].context = [] // paraphs container

        for (let i = 0; i < paraphs.length; i++) {
            // for each paraph number from the link
            if (tLinks[linkMetas].paraphs.indexOf(i) !== -1) {
                let par = paraphs[i]; // Markdown paraph
                par = mdIt.render(par); // HTML paraph
                // find the link string into the paraph and <mark> it
                par = par.replace('[[' + linkMetas + ']]', '<mark>[[' + linkMetas + ']]</mark>');

                tLinks[linkMetas].context.push(par);
            }
        }

        delete tLinks[linkMetas].paraphs; // delete list of paraphs

        // paraphs array to context string
        tLinks[linkMetas].context = tLinks[linkMetas].context.join('');
        links.push(tLinks[linkMetas]); // put all link metas on final 'links' container
    }

    return links;
}

exports.catchLinksFromContent = catchLinksFromContent;

/**
 * Get node rank from number of links & backlinks
 * @param {number} backLinkNb - Number of backlinks
 * @param {number} linkNb - Number of links
 * @returns {number} - Rank
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
 * @param {number} link - The wikilink content, '***' from '[[***]]'
 * @returns {object} - Object : type & target
 */

function normalizeLink(link) {
    link = link.split(':', 2);
    if (link.length === 2) {
        return {type: link[0], target: {id: Number(link[1])} };
    }
    // default value
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

        if (link === NaN) { return extract; } //if not a number, only return the '[[***]]' string

        const associatedMetas = file.links.find(function(i) {
            return i.target.id === link;
        });

        if (associatedMetas === undefined) { return extract; } // if not metas, only return the '[[***]]' string

        link = associatedMetas;
        // return '[[***]]' string into a Mardown link with openRecord function & class
        return `[${extract}](#${link.target.id}){title="${link.target.title}" onclick=openRecord(${link.target.id}) .record-link}`;        
    });
}

exports.convertLinks = convertLinks;