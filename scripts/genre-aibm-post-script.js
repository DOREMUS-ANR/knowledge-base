/*
 * Script to be executed after the creation of the AIBM/IAML genres
 * vocabulary (genre.ttl)
 */

const fs = require('fs'),
    request = require('request'),
    async = require('async'),
    literalLangFix = require('./common/literal_language_fix'),
    unicodeConv = require('./common/unicode_converter'),
    rdfTranslator = require('rdf-translator');

var file = __dirname + '/../vocabularies/genre-iaml.ttl';

var rdfData = fs.readFileSync(file).toString();
rdfData = literalLangFix(rdfData);

var exactMatchRegex = /skos\:exactMatch <(.+)>/gi;
var match = exactMatchRegex.exec(rdfData);
var uriArray = [];
while (exactMatchRegex.exec(rdfData) !== null) {
    let uri = match[1];
    uriArray.push(match[1]);
    match = exactMatchRegex.exec(rdfData);
}

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
            // TODO remove the exactMatch
            console.error('FAIL', uri, response.statusCode, error);
            callback();
        }
    });

}, function done() {
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