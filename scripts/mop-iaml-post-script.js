/*
 * Script to be executed after the creation of the IAML medium of
 * performance vocabulary (iaml.ttl)
 */

const fs = require('fs'),
    literalLangFix = require('./common/literal_language_fix'),
    unicodeConv = require('./common/unicode_converter'),
    rdfTranslator = require('./common/rdf_translator');
$rdf = require('rdflib');

const RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#"),
    SKOS = $rdf.Namespace("http://www.w3.org/2004/02/skos/core#");

var file = __dirname + '/../vocabularies/iaml.ttl';

var rdfData = fs.readFileSync(file).toString();
rdfData = literalLangFix(rdfData);

var store = $rdf.graph();
var contentType = 'text/turtle';
var baseUrl = "http://iflastandards.info/ns/unimarc/terms/mop/";
try {
    $rdf.parse(rdfData, store, baseUrl, contentType);

    let allConcepts = store.each(undefined, RDF('type'), SKOS('Concept'));
    let allConceptUris = allConcepts.map((c) => c.uri);

    // the file contains groups like "<instrument name> - undefined"
    // we should add the "narrower/broader" concepts to them.
    for (let statements of store.statementsMatching(undefined, SKOS('prefLabel'))) {
        let label = statements.object;
        if (label.lang == 'eng' && label.value.match(/- (un|non )specified/)) {
            //  console.log(statements.subject.uri + " . " + label.value);
            let groupUri = statements.subject.uri;
            let groupId = groupUri.substring(groupUri.length - 3);
            let $group = $rdf.sym(groupUri);

            let regex = new RegExp('/' + groupId + ".+$");
            allConceptUris.filter((uri) => uri.match(regex)).forEach((uri) => {
                let $this = $rdf.sym(uri);
                store.add($group, SKOS('narrower'), $this);
                store.removeMany($this, SKOS('broader'));
                store.add($this, SKOS('broader'), $group);
            });
        }
    }

    // print modified ttl document
    $rdf.serialize(undefined, store, undefined, 'application/rdf+xml', function(err, str) {
        if (err) return console.error(err);

        rdfTranslator(restoreUnicode(str), 'xml', 'n3', function(err, data) {
            if (err) return console.error(err);
            writeTtl(data);
        });
    });

} catch (err) {
    console.log(err);
}

function writeTtl(str) {
    fs.writeFile(file, str, 'utf8', function(err) {
        if (err) return console.error(err);

        console.log("The file was saved!");
    });
}

function restoreUnicode(str) {
    // preserve prefixes
    let prefixesThreshold = str.indexOf('>');
    let prefixesString = str.substring(0, prefixesThreshold);
    let restOfTheString = str.substring(prefixesThreshold);

    return prefixesString + unicodeConv(restOfTheString, 'dec');
}
