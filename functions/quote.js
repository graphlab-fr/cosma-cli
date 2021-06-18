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

/**
 * Check the 'citeproc' mode can be on
 * @return {bool}
 */

function citeprocModeIsActive() {
    const flag = process.argv[3];

    if (flag !== '--citeproc'
        && flag !== '-c')
    {
        return false;
    }

    if (config.bib_origin !== undefined && fs.existsSync(config.bib_origin)) {
        return true;
    }

    console.error('\x1b[33m', 'Citeproc mode off : no library from config.', '\x1b[0m');
    return false;
}

exports.citeprocModeIsActive = citeprocModeIsActive;

/**
 * Get all quoting keys from a file
 * @param {string} fileContent - Markdown content
 * @return {object} - All quoting keys and for each the linked ids & attributes
 */

function catchQuoteKeys(fileContent) {
    let extractions = Citr.util.extractCitations(fileContent)
        , quoteKeys = {}
        , libraryIds = library.map(function(item) {
            return item.id;
        })
        , undefinedLibraryIds = [];

    quoteExtraction:
    for (let i = 0; i < extractions.length; i++) {
        const extraction = extractions[i];

        const quotes = Citr.parseSingle(extraction);
        // there could be several quotes from one key
        for (const q of quotes) {
            if (libraryIds.includes(q.id) === false) {
                undefinedLibraryIds.push(q.id)
                continue quoteExtraction;
            }
        }

        quoteKeys[extraction] = quotes;
    }

    return {
        quoteKeys: quoteKeys,
        undefinedLibraryIds: undefinedLibraryIds
    };
}

exports.catchQuoteKeys = catchQuoteKeys;

/**
 * Replace each quoting key from the file content by a short quote from library
 * @param {string} fileContent - Markdown content
 * @param {object} fileQuoteKeys - All quoting keys and for each the linked ids & attributes
 * @return {string} - File content with the short quotes
 */

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

/**
 * Get the bibliography for a file for each contained quote & from the library
 * @param {object} fileQuoteKeys - All quoting keys and for each the linked ids & attributes
 * @return {string} - Bibliography HTML
 */

function genBibliography(fileQuoteKeys) {
    const quoteIds = getCitationsFromKey(fileQuoteKeys);

    var citeproc = getCSL(quoteIds);
    if (citeproc === false) { return false; }

    citeproc.updateItems(quoteIds);
    return citeproc.makeBibliography()[1].join('\n');
}

exports.genBibliography = genBibliography;

/**
 * Get 'citeproc' engine, from library and config files (XML, CSL)
 * @param {object} fileQuotesIds - All quoting keys, without their attributes
 * @return {string} - Bibliography HTML
 */

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

/**
 * From all quoting keys get linked ids & attributes 
 * @param {object} quoteKeys - All quoting keys and for each the linked ids & attributes
 * @return {string} - List of keys linked ids & attributes
 */

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