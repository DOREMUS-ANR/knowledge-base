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
var baseUrl = 'http://data.doremus.org/vocabulary/rameau/groups/';
var array = [];
var store = $rdf.graph();

var collection = $rdf.sym(baseUrl);
store.add(collection, RDF('type'), SKOS('Collection'));
store.add(collection, SKOS('prefLabel'), $rdf.literal('Ethnic groups list from RAMEAU.', 'en'));

fs.createReadStream(file)
  .pipe(csv({
    separator: '\t', // specify optional cell separator
    newline: '\r', // specify a newline character
    headers: ['code', 'label'] // Specifing the headers
  }))
  .on('data', data => array.push(toSPARQL(data)))
  .on('end', () => {
    var arkList = [];
    async.eachSeries(array, function iteratee(query, callback) {
      if (!query) return callback();
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
      $rdf.serialize(undefined, store, 'http://example.org', 'text/n3', function(err, str) {
        if (err) return console.error(err);
        str = str.replace(/=/g, "owl:sameAs");
        writeTtl(str);
      });
    });
  });

function toSPARQL(row) {
  if (!row.code) return null;
  return `CONSTRUCT {?idArk ?p ?o} WHERE {
          ?idArk bnf-onto:FRBNF "${row.code.trim()}"^^xsd:integer;
          ?p ?o }`;

}

function writeTtl(str) {
  fs.writeFile(output, str, 'utf8', function(err) {
    if (err) return console.error(err);

    console.log("The file was saved!");
  });
}
