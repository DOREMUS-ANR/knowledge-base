const fs = require('fs'),
  path = require('path'),
  async = require('async'),
  $rdf = require('rdflib'),
  pug = require('pug');
// rdfTranslator = require('rdf-translator'),
// validUrl = require('valid-url'),
// Filehound = require('filehound');


var pugOptions = {
  pretty: true
};

var inputDir = '../vocabularies/';
var base = 'http://data.doremus.org/vocabulary/';

var SKOS = $rdf.Namespace('http://www.w3.org/2004/02/skos/core#');
var RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
var RDFS = $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#');
var DCAT = $rdf.Namespace('http://www.w3.org/ns/dcat#');
var MODS = $rdf.Namespace('http://www.loc.gov/standards/mods/rdf/v1/#');
var A = RDF('type');


var vocabularies = {};
var vocLength = 0;
fs.readdir(inputDir, (err, files) => {
  if (err) return console.error(err);
  async.eachSeries(files, (file, callback) => {

    if (!file.endsWith('.ttl')) return callback();
    console.log('*****' + file + '******');
    let input = fs.readFileSync(inputDir + file, {
      encoding: 'UTF-8'
    });
    let store = $rdf.graph();
    try {
      $rdf.parse(input, store, base, 'text/turtle');
    } catch (err) {
      console.error(err);
      return callback();
    }

    var scheme = store.any(null, A, SKOS('ConceptScheme'));
    var concepts = store.each(null, A, SKOS('Concept'));
    var type = 'SKOS';
    if (!concepts.length) {
      scheme = store.any(null, A, DCAT('Catalog'));
      concepts = store.each(null, A, MODS('ModsResource'));
      type = 'MODS';
    }

    if (!concepts || !concepts.length) {
      console.warn('Skipping, no Concepts found');
      return callback();
    }
    let description;
    if (scheme) description = store.each(scheme, RDFS('label'));
    if (description) description = description.find(d => d.lang == 'en');

    let vendor, category, sub;
    if (scheme && scheme.value.startsWith(base))
      [vendor, category, sub] = scheme.value.replace(base, '').split('/');
    else
      [category, vendor] = file.replace('.ttl', '').split('-');

    let name = sub ? vendor + ` (${sub})` : vendor;

    if (!category) {
      category = vendor;
      vendor = 'DOREMUS';
      name = category;
    }


    let vocabulary = {
      uri: scheme && scheme.value,
      description,
      vendor,
      isDoremus: vendor == 'DOREMUS',
      category,
      type,
      name,
      concepts: concepts.length
    };
    vocLength++;
    if (!vocabularies[category]) vocabularies[category] = [];
    vocabularies[category].push(vocabulary);
    callback();
  }, () => {
    console.log('rendering html...');
    render('./vocabulary/index.pug', {
      vocabularies,
      categories: Object.keys(vocabularies).length,
      total: vocLength
    });
    console.log('done');
  });
});

function render(template, local) {
  var dist = template.replace('.pug', '.html');
  var html = pug.renderFile(template, Object.assign({}, pugOptions, local));

  fs.writeFileSync(dist, html, {
    encoding: 'utf-8'
  });
}
