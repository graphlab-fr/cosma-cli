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

function catchConvertQuoteKeys(file) {
    let quotesFromText = Citr.util.extractCitations(file.content)
        , quoteRefs = {};

    for (let q of quotesFromText) {
        qNotes = Citr.parseSingle(q)[0];
        qRefs = bib.find(bib => bib.id === qNotes.id);

        quoteRefs[qNotes.id] = qRefs;

        file.content = file.content.replace(q, function(extract) {
            return `[${qRefs.title}]`;        
        });
    }

    file.quoteRefs = quoteRefs;
    return file;
}

exports.catchConvertQuoteKeys = catchConvertQuoteKeys;

function genBibliography(quoteRefs) {
    const quoteIds = Object.keys(quoteRefs);

    var citeproc = new CSL.Engine({
        retrieveLocale: () => {
            return fs.readFileSync('./template/quotation/locales-fr-FR.xml', 'utf-8')
        },
        retrieveItem: (id) => {
            return quoteRefs[id];
        }
    }, fs.readFileSync('./template/quotation/iso690-author-date-fr.csl', 'utf-8'));

    citeproc.updateItems(quoteIds);
    return citeproc.makeBibliography()[1].join('\n');
}

exports.genBibliography = genBibliography;