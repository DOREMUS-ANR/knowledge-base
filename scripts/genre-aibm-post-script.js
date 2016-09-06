/*
 * Script to be executed after the creation of the AIBM/IAML genres
 * vocabulary (genre.ttl)
 */

const fs = require('fs'),
    literalLangFix = require('./common/literal_language_fix'),
    unicodeConv = require('./common/unicode_converter'),
    rdfTranslator = require('./common/rdf_translator');
$rdf = require('rdflib');

const RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#"),
    SKOS = $rdf.Namespace("http://www.w3.org/2004/02/skos/core#");

var file = __dirname + '/../vocabularies/genre.ttl';

var rdfData = fs.readFileSync(file).toString();
rdfData = literalLangFix(rdfData);


rdfTranslator(rdfData, 'n3', 'n3', function(err, data) {
    if (err) return console.error(err);
    writeTtl(data);
});


function writeTtl(str) {
    fs.writeFile(file, str, 'utf8', function(err) {
        if (err) return console.error(err);

        console.log("The file was saved!");
    });
}
