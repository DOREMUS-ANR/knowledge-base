const fs = require('fs'),
  csv = require('csv-parser'),
  request = require('request'),
  async = require('async'),
  rdfTranslator = require('rdf-translator'),
  $rdf = require('rdflib');

const CONTEXT = "Contexte d'utilisation (à mettre en scopenote)";
const SKOS_CONTEXT = "Contexte (collection skos)";

const DIVIDER = '\\n';
const DIVIDER_REGEX = /\\n/g;

const COLLECTION_LIST = ['performance', 'casting', 'musical_work', 'creative_work', 'recording', 'publication', 'performance_plan', 'editing'];
const BASE_URL = 'http://data.doremus.org/vocabulary/function/';

const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const SKOS = $rdf.Namespace('http://www.w3.org/2004/02/skos/core#');
const RDFS = $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#');
const DCT = $rdf.Namespace('http://purl.org/dc/terms/');
const XSD = $rdf.Namespace('http://www.w3.org/2001/XMLSchema#');

var file = __dirname + '/../vocabularies/raw-data/functions.csv';
var output = __dirname + '/../vocabularies/function.ttl';
var array = [];
var store = $rdf.graph();

store.setPrefixForURI('rdfs', 'http://www.w3.org/2000/01/rdf-schema#');
store.setPrefixForURI('skos', 'http://www.w3.org/2004/02/skos/core#');
store.setPrefixForURI('dct', 'http://purl.org/dc/terms/');
store.setPrefixForURI('xsd', 'http://www.w3.org/2001/XMLSchema#');

COLLECTION_LIST.forEach(c => {
  var collection = $rdf.sym(BASE_URL + c);
  store.add(collection, RDF('type'), SKOS('Collection'));
  store.add(collection, RDFS('label'), c.replace(/_/g, ' '));
});

var conceptScheme = $rdf.sym(BASE_URL);
store.add(conceptScheme, RDF('type'), SKOS('ConceptScheme'));
store.add(conceptScheme, RDFS('label'), $rdf.literal('Relationship designators for agents', 'en'));
store.add(conceptScheme, RDFS('label'), $rdf.literal('Fonctions', 'fr'));
store.add(conceptScheme, RDFS('label'), $rdf.literal('Funzioni per attività musicali', 'it'));
store.add(conceptScheme, RDFS('comment'), $rdf.literal('Type de relation entre un agent et une oeuvre, une expression, une manifestation ou un évènement', 'fr'));
store.add(conceptScheme, RDFS('comment'), $rdf.literal('Relationship designators to specify the relationship between  an agent and a work, an expression, a manifestation or an event', 'en'));
store.add(conceptScheme, RDFS('comment'), $rdf.literal('Tipo di relazione tra una persona (artista, tecnico, etc.) e un\'opera, un\'espressione, una manifestazione o un evento', 'it'));
store.add(conceptScheme, DCT('creator'), $rdf.sym('http://data.doremus.org/organization/DOREMUS'));
store.add(conceptScheme, DCT('license'), $rdf.sym('https://creativecommons.org/licenses/by/4.0/'));
store.add(conceptScheme, DCT('created'), $rdf.literal('2018-01-10', null, XSD('date')));
store.add(conceptScheme, DCT('modified'), $rdf.literal(dateToYMD(new Date()), null, XSD('date')));

var i = 0;
var curConcept = {}; // for saving the current concepts at different levels

fs.createReadStream(file)
  .pipe(csv({
    separator: ',',
    newline: '\n'
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

    let otherLabelEn = labelEn.split(DIVIDER_REGEX);
    labelEn = otherLabelEn.shift().trim();

    let concept = $rdf.sym((BASE_URL + (labelEn || i)).replace(/ /g, '_'));
    curConcept[level] = concept;
    store.add(concept, RDF('type'), SKOS('Concept'));
    addLabel(store, concept, labelFr, 'fr');
    addLabel(store, concept, labelEn, 'en');
    addLabel(store, concept, data['prefLabel@it'], 'it');
    addLabel(store, concept, data['altLabel@en'], 'en', 'alt');
    addLabel(store, concept, data['altLabel@fr'], 'fr', 'alt');
    addLabel(store, concept, data['altLabel@it'], 'it', 'alt');

    if (level === 0)
      store.add(concept, SKOS('topConceptOf'), conceptScheme);
    else {
      store.add(concept, SKOS('broader'), curConcept[level - 1]);
      store.add(concept, SKOS('inScheme'), conceptScheme);
    }

    addProperty(concept, SKOS('scopeNote'), data['skos:scopeNote@fr'], 'fr');
    addProperty(concept, SKOS('definition'), data['description@fr'], 'fr');

    for (let ctx of data[SKOS_CONTEXT].split(DIVIDER)) {
      ctx = ctx.trim();
      if (!ctx) continue;
      store.add($rdf.sym(BASE_URL + ctx.replace(/ /g, '_')),
        SKOS('member'), concept);
    }
  })
  .on('end', () => {
    // print modified ttl document
    $rdf.serialize(undefined, store, 'http://example.org/', 'text/turtle', function(err, str) {
      if (err) return console.error(err);
      str = str.replace(`@prefix fun: <${BASE_URL}>.`, '');
      str = str.replace(/fun:([^\s;,.]*)/g, `<${BASE_URL}$1>`);
      // return writeTtl(str);

      rdfTranslator(str, 'n3', 'n3')
        .then(writeTtl)
        .catch(e => console.error(e));
    });

  });


function writeTtl(str) {
  fs.writeFile(output, str, 'utf8', function(err) {
    if (err) return console.error(err);

    console.log('The file was saved!');
  });
}

function dateToYMD(date) {
  var d = date.getDate();
  var m = date.getMonth() + 1; //Month from 0 to 11
  var y = date.getFullYear();
  return y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

function addLabel(store, concept, label = '', lang = null, type = 'pref') {
  if (Array.isArray(label))
    return label
      .forEach(l => addLabel(store, concept, l, lang, type));

  label = label.trim();
  if (!label) return;

  if (label.includes(DIVIDER))
    return label.split(DIVIDER_REGEX)
      .forEach(l => addLabel(store, concept, l, lang, type));


  let literal = lang ? $rdf.literal(label, lang) : label;
  store.add(concept, SKOS(`${type}Label`), literal);
}

function addProperty(concept, prop, value, lang) {
  if (!value) return;
  value = value.trim();
  if (!value) return;

  store.add(concept, prop, $rdf.literal(value, lang));
}
