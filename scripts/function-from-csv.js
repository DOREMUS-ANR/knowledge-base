const fs = require('fs'),
  csv = require('csv-parser'),
  request = require('request'),
  async = require('async'),
  rdfTranslator = require('rdf-translator'),
  $rdf = require('rdflib');

const RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const SKOS = $rdf.Namespace("http://www.w3.org/2004/02/skos/core#");
const RDFS = $rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#");
const DCT = $rdf.Namespace("http://purl.org/dc/terms/");
const XSD = $rdf.Namespace("http://www.w3.org/2001/XMLSchema#");

var file = __dirname + '/../vocabularies/raw-data/functions.csv';
var output = __dirname + '/../vocabularies/function.ttl';
var array = [];
var store = $rdf.graph();

store.setPrefixForURI('rdfs', 'http://www.w3.org/2000/01/rdf-schema#');
store.setPrefixForURI('skos', 'http://www.w3.org/2004/02/skos/core#');
store.setPrefixForURI('dct', 'http://purl.org/dc/terms/');
store.setPrefixForURI('xsd', 'http://www.w3.org/2001/XMLSchema#');

var baseUrl = 'http://data.doremus.org/vocabulary/function/';
var conceptScheme = $rdf.sym(baseUrl);
store.add(conceptScheme, RDF('type'), SKOS('ConceptScheme'));
store.add(conceptScheme, RDFS('label'), $rdf.literal('List of functions', 'en'));
store.add(conceptScheme, RDFS('label'), $rdf.literal('Liste des fonctions', 'fr'));
store.add(conceptScheme, DCT('creator'), $rdf.sym('http://data.doremus.org/organization/DOREMUS'));
store.add(conceptScheme, DCT('license'), $rdf.sym('https://creativecommons.org/licenses/by/4.0/'));
store.add(conceptScheme, DCT('created'), $rdf.literal('2018-01-10', null, XSD('date')));
store.add(conceptScheme, DCT('modified'), $rdf.literal(dateToYMD(new Date()), null, XSD('date')));

var i = 0;
var curConcept = {}; // for saving the current concepts at different levels

fs.createReadStream(file)
  .pipe(csv({
    separator: ';', // specify optional cell separator
    newline: '\r' // specify a newline character
  }))
  .on('data', (data) => {
    ++i;

    let labelEn = (data['prefLabel@en'] || '').trim();
    let labelFr = data['prefLabel@fr'].trim();
    let level = 0;
    while (labelFr.startsWith('>')) {
      ++level;
      labelFr = labelFr.substring(1).trim();
    }

    console.log(labelFr);

    let otherLabelEn = labelEn.split(/[\n\r]/);
    labelEn = otherLabelEn.shift().trim();

    let concept = $rdf.sym((baseUrl + (labelEn || i)).replace(/ /g, '_'));
    curConcept[level] = concept;
    store.add(concept, RDF('type'), SKOS('Concept'));
    store.add(concept, SKOS('prefLabel'), $rdf.literal(labelFr, 'fr'));

    if (labelEn) {
      store.add(concept, SKOS('prefLabel'), $rdf.literal(labelEn, 'en'));
      for (let l of otherLabelEn) {
        store.add(concept, SKOS('prefLabel'), $rdf.literal(l.trim(), 'en'));
      }
    }

    if (level === 0)
      store.add(concept, SKOS('topConceptOf'), conceptScheme);
    else
      store.add(concept, SKOS('broader'), curConcept[level - 1]);
  })
  .on('end', () => {
    // print modified ttl document
    $rdf.serialize(undefined, store, 'http://example.org/', 'text/turtle', function(err, str) {
      if (err) return console.error(err);
      str = str.replace(`@prefix fun: <${baseUrl}>.`, '');
      str = str.replace(/fun:([^\s;.]*)/g, `<${baseUrl}$1>`);
      // return writeTtl(str);

      rdfTranslator(str, 'n3', 'n3', function(err, data) {
        if (err) return console.error(err);

        writeTtl(data);
      });
    });

  });


function writeTtl(str) {
  fs.writeFile(output, str, 'utf8', function(err) {
    if (err) return console.error(err);

    console.log("The file was saved!");
  });
}

function dateToYMD(date) {
  var d = date.getDate();
  var m = date.getMonth() + 1; //Month from 0 to 11
  var y = date.getFullYear();
  return y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}
