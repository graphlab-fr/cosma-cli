/**
 * @file Replace quote markups and generate bibliography.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const fs = require('fs')
    , CSL = require('citeproc')
    , Citr = require('@zettlr/citr')
    , config = require('./verifconfig').config;

let library = false; // if no path to JSON library file, no functions
if (config.bib_origin) {    
    library = fs.readFileSync(config.bib_origin, 'utf-8');
    library = JSON.parse(library);
}

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
    if (citeproc === false) { return fileContent; }

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

        fileContent = fileContent.replace(key, citMark);
    }

    return fileContent;
}

exports.convertQuoteKeys = convertQuoteKeys;

function genBibliography(fileQuoteKeys) {
    const quoteIds = getCitationsFromKey(fileQuoteKeys);

    var citeproc = getCSL(quoteIds);
    if (citeproc === false) { return false; }

    citeproc.updateItems(quoteIds);
    return citeproc.makeBibliography()[1].join('\n');
}

exports.genBibliography = genBibliography;

function getCSL(fileQuotesIds) {

    if (library === false) { return false; }

    let xmlLocal, cslStyle;

    try {
        // local definition file (translation of the linking terms of the quote)
        xmlLocal = fs.readFileSync('./template/citeproc/locales.xml', 'utf-8');
    } catch (error) {
        console.error('\x1b[33m', 'Warn.', '\x1b[0m', 'File /template/citeproc/locales.xml is missing: no quoting.');
        return false;
    }

    try {
        // style for quoting (order and metadata of the citation)
        cslStyle = fs.readFileSync('./template/citeproc/styles.csl', 'utf-8');
    } catch (error) {
        console.error('\x1b[33m', 'Warn.', '\x1b[0m', 'File /template/citeproc/styles.csl is missing: no quoting.');
        return false;
    }

    const fileQuoteRefs = {};

    for (const id of fileQuotesIds) {
        fileQuoteRefs[id] = library.find(library => library.id === id);
    }

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