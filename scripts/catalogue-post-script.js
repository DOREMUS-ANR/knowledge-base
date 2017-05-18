/*
 * Script to be executed after the creation of the catalog vocabulary (catalog.ttl)
 */

const fs = require('fs'),
  rdfTranslator = require('rdf-translator');
const SparqlClient = require('sparql-client');
const translitterify = require('translitterify');

const doremusEndpoint = new SparqlClient('http://data.doremus.org/sparql');

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

var artists;
retrieveAllArtists((data) => {
  artists = data.map(d => ({
    name: translitterify(d.o.value).toLowerCase(),
    uri: d.s.value
  }));

  console.log(`Formatting the rdf`);
  rdfTranslator(rdfData, 'n3', 'n3', function(err, data) {
    if (err) return console.error(err);

    data = data.replace(/=/g, "owl:sameAs")
      .replace(/dcterms:([a-z]+)/g, "dct:$1");

    let subjectRegex = /modsrdf:subjectName "(.+)" ;/g;
    data = data.replace(subjectRegex, (match, p) => {
      let pFlat = translitterify(p).toLowerCase();
      let a = artists.find(a => a.name == pFlat);
      if (a) match += `\n    dct:subject <${a.uri}> ;`;
      else console.warn('No match found for ' + p);
      return match;
    });

    writeTtl(data);
  });
});

function retrieveAllArtists(cb) {
  let query = `SELECT DISTINCT ?o ?s WHERE {
      ?w ecrm:P14_carried_out_by ?s .
      ?s ecrm:P131_is_identified_by ?o .
      FILTER (!isBlank(?s) )
    }`;
  console.log("Query to DOREMUS: " + query);
  doremusEndpoint.query(query).execute((err, res) => {
    if (err) return cb(err);
    cb(res && res.results.bindings);
  });
}

function getUriFromDoremus(name, cb) {
  let query = `SELECT DISTINCT * WHERE {
                ?s ecrm:P131_is_identified_by ?o .
                FILTER (lcase(str(?o)) = "${name.toLowerCase()}")
              }`;
  // console.log("Query to DOREMUS: " + query);
  doremusEndpoint.query(query).execute((err, res) => {
    if (err) return cb(err);
    cb(res && res.results.bindings);
  });
}

function writeTtl(str) {
  fs.writeFile(file, str, 'utf8', function(err) {
    if (err) return console.error(err);

    console.log("The file was saved!");
  });
}
