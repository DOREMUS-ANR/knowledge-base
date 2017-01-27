const fs = require('fs'),
    csv = require('csv-parser'),
    request = require('request'),
    async = require('async'),
    rdfTranslator = require('rdf-translator'),
    $rdf = require('rdflib');

const RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const SKOS = $rdf.Namespace("http://www.w3.org/2004/02/skos/core#");

var file = __dirname + '/../vocabularies/raw-data/rameau.genres.txt';
var output = __dirname + '/../vocabularies/genre-rameau.ttl';
var baseUrl = "http://data.doremus.org/vocabulary/rameau/genre/";
var array = [];
var store = $rdf.graph();


fs.createReadStream(file)
    .pipe(csv({
        separator: '\t', // specify optional cell separator
        newline: '\n', // specify a newline character
        headers: ['code', 'label'] // Specifing the headers
    }))
    .on('data', (data) => array.push(toSPARQL(data.code)))
    .on('end', () => {
        async.eachSeries(array, function iteratee(query, callback) {
            request.post({
                url: 'http://data.bnf.fr/sparql',
                qs: {
                    query: query,
                    format: 'application/n3',
                },
            }, (err, response, body) => {
                var contentType = 'text/n3';
                $rdf.parse(body, store, baseUrl, contentType);
                callback();
            });
        }, function done() {
            $rdf.serialize(undefined, store, 'http://example.org', 'application/rdf+xml', function(err, str) {
                if (err) return console.error(err);
                console.log('formatting rdf');
                rdfTranslator(str, 'xml', 'n3', function(err, data) {
                    if (err) return console.error(err, data);

                    data = data.replace(/=/g, "owl:sameAs");
                    writeTtl(data);
                });
            });
        });
    });

function toSPARQL(code) {
    return `CONSTRUCT {?idArk ?p ?o}
            WHERE {
                ?idArk bnf-onto:FRBNF "${code.trim()}"^^xsd:integer;
                ?p ?o
            }`;
}

function writeTtl(str) {
    fs.writeFile(output, str, 'utf8', function(err) {
        if (err) return console.error(err);

        console.log("The file was saved!");
    });
}