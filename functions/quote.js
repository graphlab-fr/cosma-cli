/**
 * @file Replace quote markup and generate bibliography.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const fs = require('fs')
    , CSL = require('citeproc')
    , Citr = require('@zettlr/citr')
    , config = require('./verifconfig').config;

let bib = fs.readFileSync(config.bib_origin, 'utf-8');
bib = JSON.parse(bib);

let citations = [];

function catchQuoteKeys(file) {
    let extractions = Citr.util.extractCitations(file.content)
        , quotesFromText = []
        , quoteRefs = {};

    // get all quotes

    for (let i = 0; i < extractions.length; i++) {
        const extraction = extractions[i];

        // there could be several quotes from one key
        const quotes = Citr.parseSingle(extraction);
        console.log(extraction);
        quotesFromText.push(...quotes);

        citations.push([
            {
                citationItems: quotes,
                properties: { noteIndex: i + 1 }
            }
        ])
    }

    // for each quote : get the references from the library

    for (let q of quotesFromText) {
        quoteRefs[q.id] = bib.find(bib => bib.id === q.id);
    }

    return quoteRefs;
}

exports.catchQuoteKeys = catchQuoteKeys;

function convertQuoteKeys(fileContent, fileQuoteRefs) {
    const quoteIds = Object.keys(fileQuoteRefs);

    var citeproc = getCSL(fileQuoteRefs);
    citeproc.updateItems(quoteIds);

    console.log(JSON.stringify(citations, null, 2));

    for (let i = 0; i < citations.length; i++) {
        const cit = citations[i];

        const citMark = citeproc.processCitationCluster(cit[0], [], [])[1][0][1];
        console.log(citMark);
    }

    return fileContent;
}

exports.convertQuoteKeys = convertQuoteKeys;

function genBibliography(fileQuoteRefs) {
    const quoteIds = Object.keys(fileQuoteRefs);

    var citeproc = getCSL(fileQuoteRefs);

    citeproc.updateItems(quoteIds);
    return citeproc.makeBibliography()[1].join('\n');
}

exports.genBibliography = genBibliography;

function getCSL(fileQuoteRefs) {
    // locale definition file (translation of the linking terms of the quote)
    const xmlLocal = fs.readFileSync('./template/quotation/locales-fr-FR.xml', 'utf-8');
    // style for quoting (order and metadata of the citation)
    const cslStyle = fs.readFileSync('./template/quotation/iso690-author-date-fr.csl', 'utf-8');

    return new CSL.Engine({
        retrieveLocale: () => {
            return xmlLocal;
        },
        retrieveItem: (id) => {
            // find the quote item : CSL-JSON object
            return fileQuoteRefs[id];
        }
    }, cslStyle);
}