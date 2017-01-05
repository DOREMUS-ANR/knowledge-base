/*
 * Script to be executed after the creation of the IAML medium of
 * performance vocabulary (iaml.ttl)
 */

const fs = require('fs'),
    request = require('request'),
    async = require('async'),
    literalLangFix = require('./common/literal_language_fix'),
    unicodeConv = require('./common/unicode_converter'),
    rdfTranslator = require('rdf-translator'),
    isoConv = require('iso-language-converter');


var file = __dirname + '/../vocabularies/mop-iaml.ttl';

var rdfData = fs.readFileSync(file).toString();
rdfData = literalLangFix(rdfData);

//remove unspecified
var unspecifiedRegex = / [-–] (unbestimmt|(un|non )specified|sin especificar|non spécifié|non specificat[oa]|não especificad[oa])/g;
rdfData = rdfData.replace(unspecifiedRegex, '');

//detect scripts
var langRegex = /"([^"]+)"@([a-z]{2,3})/g;
var latnRegex = /^[a-zA-Z\s\-'-\u007F\u0080-\u00FF\u0100-\u017F\u0180-\u024F\u0250-\u02AF]+$/g;
rdfData = rdfData.replace(langRegex, (match, text, code) => {
    let script = isoConv(code, {
        to: 'script'
    });
    if (!script || script == 'Latn') return match;
    
    let isLatn = latnRegex.test(text);
    if (isLatn) return `"${text}"@${code}-Latn`;
    
    return match;
});

// check if the exactMatch are correctly referencing a page
var exactMatchRegex = /skos\:exactMatch <(.+)>/gi;
var match = exactMatchRegex.exec(rdfData);
var uriArray = [];
while (match !== null) {
    let uri = match[1];
    uriArray.push(match[1]);
    match = exactMatchRegex.exec(rdfData);
}

var unmatchedResults = [];
async.eachSeries(uriArray, (uri, callback) => {
    // console.log(`Checking the existence of ${uri}`);
    request({
        followAllRedirects: true,
        url: uri,
        method: 'HEAD'
    }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            //everything ok
            callback();
        } else {
            console.error('FAIL', uri, response.statusCode, error);
            unmatchedResults.push(uri);
            callback();
        }
    });

}, function done() {
    for (let umr of unmatchedResults) {
        let toRemove = `skos:exactMatch <${umr}> ;`;
        rdfData = rdfData.replace(toRemove, '');
    }

    console.log(`Formatting the rdf`);
    rdfTranslator(rdfData, 'n3', 'n3', function(err, data) {
        if (err) return console.error(err);
        writeTtl(data);
    });
});

function writeTtl(str) {
    fs.writeFile(file, str, 'utf8', function(err) {
        if (err) return console.error(err);

        console.log("The file was saved!");
    });
}

function restoreUnicode(str) {
    // preserve prefixes
    let prefixesThreshold = str.indexOf('.\n\n');
    let prefixesString = str.substring(0, prefixesThreshold);
    let restOfTheString = str.substring(prefixesThreshold);

    return prefixesString + unicodeConv(restOfTheString, 'dec');
}