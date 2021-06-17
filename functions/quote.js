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

function catchQuoteKeys(file) {
    let extractions = Citr.util.extractCitations(file.content)
        , quotesFromText = []
        , quoteKeys = {};

    for (let i = 0; i < extractions.length; i++) {
        const extraction = extractions[i];

        // there could be several quotes from one key
        const quotes = Citr.parseSingle(extraction);
        quotesFromText.push(...quotes);

        quoteKeys[extraction] = quotes;
    }

    return quoteKeys;
}

exports.catchQuoteKeys = catchQuoteKeys;

function convertQuoteKeys(fileContent, fileQuoteKeys) {
    const quoteIds = getCitationsFromKey(fileQuoteKeys);

    var citeproc = getCSL(quoteIds);
    citeproc.updateItems(quoteIds);

    const citations = Object.values(fileQuoteKeys).map(function(key, i) {
        return [{
            citationItems: key,
            properties: { noteIndex: i + 1 }
        }];
    });

    for (let i = 0; i < citations.length; i++) {
        const cit = citations[i];
        const key = Object.keys(fileQuoteKeys)[i]

        const citMark = citeproc.processCitationCluster(cit[0], [], [])[1][0][1];
        console.log(citMark, Object.keys(fileQuoteKeys)[i]);

        fileContent = fileContent.replace(key, citMark);
    }

    return fileContent;
}

exports.convertQuoteKeys = convertQuoteKeys;

function genBibliography(fileQuoteKeys) {
    const quoteIds = getCitationsFromKey(fileQuoteKeys);

    var citeproc = getCSL(quoteIds);

    citeproc.updateItems(quoteIds);
    return citeproc.makeBibliography()[1].join('\n');
}

exports.genBibliography = genBibliography;

function getCSL(fileQuotesIds) {

    const fileQuoteRefs = {};

    for (const id of fileQuotesIds) {
        fileQuoteRefs[id] = bib.find(bib => bib.id === id);
    }

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

function getCitationsFromKey(quoteKeys) {
    return Object.values(quoteKeys)
        .map(function(key) {
            let ids = [];

            for (const cit of key) {
                ids.push(cit.id);
            }

            return ids;
        })
        .flat();
}