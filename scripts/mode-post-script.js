/*
 * Script to be executed after the creation of the mode vocabulary (mode.ttl)
 */

const fs = require('fs'),
    rdfTranslator = require('rdf-translator'),
    $rdf = require('rdflib');

const RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#"),
    SKOS = $rdf.Namespace("http://www.w3.org/2004/02/skos/core#");

var file = __dirname + '/../vocabularies/mode.ttl';

var rdfData = fs.readFileSync(file).toString();

var store = $rdf.graph();
var contentType = 'text/turtle';
var baseUrl = "http://data.doremus.org/vocabulary/mode/";
try {
    $rdf.parse(rdfData, store, baseUrl, contentType);

    let suffixTable = [];

    for (let statement of store.statementsMatching(undefined, SKOS('prefLabel'))) {
        if (statement.object.lang != 'en') continue;

        let suffix;
        let label = statement.object.value;
        let broad = store.any(statement.subject, SKOS('broader'), undefined);
        if (!broad) {
            suffix = label.replace(/ /g, '-');
        } else if (broad.value == 'http://data.doremus.org/vocabulary/mode/0001') {
            suffix = 'church-' + label.replace('mode', '').trim();
        } else if (broad.value == 'http://data.doremus.org/vocabulary/mode/0015') {
            suffix = 'modern-' + label.replace('mode', '').trim();
        }

        if (!suffix) throw Error('I expected something different');

        suffixTable.push({
            uri: statement.subject.value,
            suffix
        });
    }

    for (let s of suffixTable) {
        rdfData = rdfData.replace(new RegExp(s.uri, 'g'), baseUrl + s.suffix);
    }

    writeTtl(rdfData);

} catch (err) {
    console.log(err);
}

function writeTtl(str) {
    fs.writeFile(file, str, 'utf8', function(err) {
        if (err) return console.error(err);

        console.log("The file was saved!");
    });
}
