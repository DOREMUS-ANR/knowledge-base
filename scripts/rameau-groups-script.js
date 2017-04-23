const fs = require('fs'),
    csv = require('csv-parser'),
    request = require('request'),
    async = require('async'),
    rdfTranslator = require('rdf-translator'),
    $rdf = require('rdflib');

const RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const SKOS = $rdf.Namespace("http://www.w3.org/2004/02/skos/core#");

var file = __dirname + '/../vocabularies/raw-data/rameau.groups.txt';
var output = __dirname + '/../vocabularies/groups-rameau.ttl';
var array = [];
var store = $rdf.graph();

var baseUrl = 'http://data.doremus.org/vocabulary/rameau/groups/';
var collection = $rdf.sym(baseUrl);
store.add(collection, RDF('type'), SKOS('Collection'));
store.add(collection, SKOS('prefLabel'), $rdf.literal('Ethnic groups list from RAMEAU.', 'en'));

fs.createReadStream(file)
    .pipe(csv({
        separator: '\t', // specify optional cell separator
        newline: '\r', // specify a newline character
        headers: ['code', 'label'] // Specifing the headers
    }))
    .on('data', (data) => array.push(toSPARQL(data)))
    .on('end', () => {
        var arkList = [];
        async.eachSeries(array, function iteratee(query, callback) {
            if (!query) {
                callback();
                return;
            }
            request.post({
                url: 'http://data.bnf.fr/sparql',
                qs: {
                    query: query,
                    format: 'application/sparql-results+json',
                },
            }, (err, response, body) => {
                let bindings;
                try {
                    bindings = JSON.parse(body).results.bindings;

                } catch (e) {
                  console.log(query);
                  console.error(e);
                  return;
                }
                if (!bindings.length) {
                    console.warn(`MISSING ARK:
                    ${query}
                  `);
                    callback();
                    return;
                }
                arkList.push(bindings[0].idArk.value);
                callback();
            });
        }, function done() {
            arkList.forEach((ark) =>
                store.add(collection, SKOS('member'), $rdf.sym(ark)));

            // print modified ttl document
            $rdf.serialize(undefined, store, 'http://example.org', 'application/rdf+xml', function(err, str) {
                if (err) return console.error(err);

                rdfTranslator(str, 'xml', 'n3', function(err, data) {
                    if (err) return console.error(err);
                    writeTtl(data);
                });
            });

        });
    });

function toSPARQL(row) {
    if (!row.code) return null;
    return `SELECT DISTINCT ?idArk
            WHERE {
                ?idArk bnf-onto:FRBNF "${row.code}"^^xsd:integer
            }`;
}

function writeTtl(str) {
    fs.writeFile(output, str, 'utf8', function(err) {
        if (err) return console.error(err);

        console.log("The file was saved!");
    });
}
