/*
 * Script to be executed after the creation of the catalog vocabulary (catalog.ttl)
 */

const fs = require('fs');
const path = require('path');
const rdfTranslator = require('rdf-translator');
const SparqlClient = require('sparql-client');
const translitterify = require('translitterify');
const Geonames = require('geonames.js');

const geonames = new Geonames({
  username: 'lisena',
  encoding: 'JSON',
});

const doremusEndpoint = new SparqlClient('http://data.doremus.org/sparql');
const file = path.join(__dirname, '/../vocabularies/catalogue.ttl');

// """fr en""" => "fr", "en"
const correctionRegex = /(modsrdf|dct):([^\s]+) """([^\n"]+)\n([^\n"]+)(?:\n([^\n"]+))?"""(\^\^xsd:language)?/g;
const subjectRegex = /modsrdf:subjectName "(.+)" ;/g;


const query = `SELECT DISTINCT ?o ?s WHERE {
  ?w ecrm:P14_carried_out_by ?s .
  ?s ecrm:P131_is_identified_by ?o .
  FILTER (!isBlank(?s) )
}`;

function retrieveAllArtists(cb) {
  console.log(`Query to DOREMUS: ${query}`);
  doremusEndpoint.query(query).execute((err, res) => {
    if (err) return cb(err);
    return cb(res && res.results.bindings);
  });
}

// function getUriFromDoremus(name, cb) {
//   let query = `SELECT DISTINCT * WHERE {
//                 ?s ecrm:P131_is_identified_by ?o .
//                 FILTER (lcase(str(?o)) = "${name.toLowerCase()}")
//               }`;
//   // console.log("Query to DOREMUS: " + query);
//   doremusEndpoint.query(query).execute((err, res) => {
//     if (err) return cb(err);
//     cb(res && res.results.bindings);
//   });
// }

async function replaceAsync(str, regex, asyncFn) {
  // https://stackoverflow.com/a/48032528/1218213
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

function writeTtl(str) {
  fs.writeFile(file, str, 'utf8', (err) => {
    if (err) return console.error(err);
    return console.log('The file was saved!');
  });
}

function searchInGeonames(label) {
  const params = {
    name: label,
    lang: 'fr',
    featureClass: 'P',
  };

  return geonames.search(params)
    .then((resp) => {
      const best = resp.geonames[0];
      if (!best) {
        console.error('NOT FOUND', label);
        return null;
      }

      const readable = [label, best.toponymName, best.geonameId, best.score].join(' | ');
      const geoUri = `http://sws.geonames.org/${best.geonameId}/`;
      console.log('->', readable, geoUri);
      return geoUri;
    }).catch((e) => {
      console.error(e);
      return null;
    });
}

async function match2geonames(match, label) {
  const inputs = label.split(' ; ');
  const values = await Promise.all(inputs.map(searchInGeonames));
  for (let i = 0; i < inputs.length; i += 1) {
    if (!values[i]) values[i] = `"${inputs[i]}"`;
    else values[i] = `<${values[i]}>`;
  }
  return `modsrdf:placeOfOrigin ${values.join(' , ')}`;
}

async function run() {
  let rdfData = fs.readFileSync(file).toString();

  //  ^^<xsd:language> => ^^xsd:language
  rdfData = rdfData.replace(/\^\^<xsd:language>/g, '^^xsd:language');

  rdfData = rdfData.replace(correctionRegex, (match, $1, $2, $3, $4, $5, $6) => {
    const dataType = $6 || '';
    let rpmt = `${$1}:${$2} "${$3.trim()}"${dataType}, "${$4.trim()}"${dataType}`;
    if ($5) rpmt += `, "${$5.trim()}"${dataType}`;
    console.log(rpmt);
    return rpmt;
  });

  rdfData = await replaceAsync(rdfData, /modsrdf:placeOfOrigin "(.+)"/g, match2geonames);

  let artists;
  retrieveAllArtists((arts) => {
    artists = arts.map(d => ({
      name: translitterify(d.o.value).toLowerCase(),
      uri: d.s.value,
    }));


    console.log('Formatting the rdf');
    rdfTranslator(rdfData, 'n3', 'n3')
      .then((n3data) => {
        let data = n3data.replace(/=/g, 'owl:sameAs')
          .replace(/dcterms:([a-z]+)/g, 'dct:$1');

        data = data.replace(subjectRegex, (match, p) => {
          const pFlat = translitterify(p).toLowerCase();
          const a = artists.find(at => at.name === pFlat);
          if (a) return `${match}\n    dct:subject <${a.uri}> ;`;
          return console.warn('No match found for', p);
        });

        writeTtl(data);
      }).catch(err => console.error(err));
  });
}

run();
