/*
 * Script to be executed after the creation of the catalog vocabulary (catalog.ttl)
 */

const fs = require('fs'),
    rdfTranslator = require('rdf-translator'),
    $rdf = require('rdflib');

const RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#"),
    MODS = $rdf.Namespace("http://www.loc.gov/standards/mods/rdf/v1/#");

var file = __dirname + '/../vocabularies/catalogue.ttl';

var rdfData = fs.readFileSync(file).toString();

//  ^^<xsd:language> => ^^xsd:language
rdfData = rdfData.replace(/\^\^<xsd:language>/g, '^^xsd:language');

//"""fr en""" => "fr", "en"
var correctionRegex = /(modsrdf|dct):([^\s]+) """([^\n"]+)\n([^\n"]+)(?:\n([^\n"]+))?"""(\^\^xsd:language)?/g;
rdfData = rdfData.replace(correctionRegex, (match, $1, $2, $3, $4, $5, $6) => {
    let dataType = $6 || '';
    let rpmt = `${$1}:${$2} "${$3.trim()}"${dataType}, "${$4.trim()}"${dataType}`;
    if ($5) rpmt += `, "${$5.trim()}"${dataType}`;
    console.log(rpmt);
    return rpmt;
});

console.log(`Formatting the rdf`);
rdfTranslator(rdfData, 'n3', 'n3', function(err, data) {
    if (err) return console.error(err);
    
    data = data.replace(/=/g, "owl:sameAs");
    writeTtl(data);
});

function writeTtl(str) {
    fs.writeFile(file, str, 'utf8', function(err) {
        if (err) return console.error(err);

        console.log("The file was saved!");
    });
}