const SparqlClient = require('sparql-client');
const util = require('util');
const request = require('request-promise-native');
const fs = require('fs-extra');

const xml2json = require('xml2json');
const async = require('async');
const $rdf = require('rdflib');
const commandLineArgs = require('command-line-args');

const doremusEndpoint = new SparqlClient('http://data.doremus.org/sparql');
const dbpediaEndpoint = new SparqlClient('http://dbpedia.org/sparql');
const frDbpediaEndpoint = new SparqlClient('http://fr.dbpedia.org/sparql');
const isniAPI = 'http://isni.oclc.nl/sru/';

const WIKI_EN_REGEX = /https?:\/\/en\.wikipedia\.org\/wiki\/(.+)/;
const WIKI_FR_REGEX = /https?:\/\/fr\.wikipedia\.org\/wiki\/(.+)/;

var RDFS = $rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#");
var OWL = $rdf.Namespace("http://www.w3.org/2002/07/owl#");
var FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/");
var DBP = $rdf.Namespace("http://dbpedia.org/property/");

var artists, art_len;
var done = 0;

const optionDefinitions = [{
  name: 'page',
  type: Number,
  defaultValue: 0
}, {
  name: 'limit',
  type: Number,
  defaultValue: 0
}];
const options = commandLineArgs(optionDefinitions);
const CHUNKSIZE = 500;

const OUTPUT_FOLDER = '../data/isni';
fs.ensureDirSync(OUTPUT_FOLDER);

getArtistsFromSparql().then((res) => {
  artists = res.map((r) => ({
    doremus_uri: r.s.value,
    isni_uri: r.isni.value,
    isni: r.isni.value.replace('http://isni.org/isni/', '')
  }));
  art_len = artists.length;

  console.log(`Start processing of ${art_len} artists.`);

  async.eachOfSeries(chunk(artists, CHUNKSIZE), (chunk, key, mainCallback) => {
    let page = options.page + key;
    let store = $rdf.graph();

    async.eachSeries(chunk, (a, callback) => {
      console.log(`Artist ${++done}/${art_len}`);
      getViafFromIsni(a).then(getInfoFromDBpedia)
        .then(a => {
          let art = $rdf.sym(a.doremus_uri);

          for (let viaf of a.viaf)
            store.add(art, OWL('sameAs'), $rdf.sym(`http://viaf.org/viaf/${viaf}`));

          for (let wk of a.wikidata)
            store.add(art, OWL('sameAs'), $rdf.sym(`http://www.wikidata.org/entity/${wk}`));

          for (let mb of a.musicbrainz)
            store.add(art, OWL('sameAs'), $rdf.sym(`https://musicbrainz.org/artist/${mb}`));

          if (a.wikipedia_uri)
            store.add(art, FOAF('isPrimaryTopicOf'), $rdf.sym(a.wikipedia_uri));

          if (a.dbpedia_uri)
            store.add(art, OWL('sameAs'), $rdf.sym(a.dbpedia_uri));

          if (a.picture)
            store.add(art, FOAF('depiction'), $rdf.sym(a.picture));

          if (a.birthPlace)
            store.add(art, DBP('birthPlace'), $rdf.sym(a.birthPlace));

          if (a.deathPlace)
            store.add(art, DBP('deathPlace'), $rdf.sym(a.deathPlace));

          if (a.comment && a.comment[0]) {
            for (let comment of a.comment)
              store.add(art, RDFS('comment'), $rdf.literal(comment.value, comment['xml:lang']));
          }
          callback();
        });
    }, () => {
      console.log('Serializing Turtle');
      store.namespaces = {
        'dbr': 'http://dbpedia.org/resource/',
        'dbp': 'http://dbpedia.org/property/',
        'foaf': 'http://xmlns.com/foaf/0.1/',
        'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
        'wd': 'http://www.wikidata.org/entity/',
        'viaf': 'http://viaf.org/viaf/',
        'doremus_artist': 'http://data.doremus.org/artist/'
      };
      $rdf.serialize(undefined, store, 'http://example.org', 'text/turtle', (err, str) => {
        if (err) return console.error(err);

        // workaround https://github.com/linkeddata/rdflib.js/issues/185
        let linkUriRegex = /link:uri((?:\s+"(?:http.+)",?)+)([;.])/g;
        str = str.replace(linkUriRegex, (match, p1, p2) => {
          let uris = p1.split('",').map(u => '<' + u.replace(/"/g, '').trim() + '>');
          return 'owl:sameAs ' + uris.join(',\n        ') + p2;
        });
        // END workaround

        fs.writeFile(`${OUTPUT_FOLDER}/artists_${page}.ttl`, str, 'utf8');
        mainCallback();
      });
    });
  });
});

function getInfoFromDBpedia(artist) {
  return new Promise(function(resolve, reject) {
    if (!artist.wikipedia_uri) return resolve(artist);

    let endpoint = artist.wikipedia_uri.match(WIKI_FR_REGEX) ? frDbpediaEndpoint : dbpediaEndpoint;

    let query = `
        PREFIX dbp: <http://dbpedia.org/property>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        SELECT * WHERE {
        ?dbpedia foaf:isPrimaryTopicOf <${artist.wikipedia_uri.replace(/"/g, '\u201c')}>
        OPTIONAL { ?dbpedia dbo:wikiPageRedirects ?redirect . }
        OPTIONAL { ?dbpedia foaf:depiction ?picture. }
        OPTIONAL { ?dbpedia dbo:birthPlace | dbp:birthPlace ?birthPlace. }
        OPTIONAL { ?dbpedia dbo:deathPlace | dbp:deathPlace ?deathPlace. }
        OPTIONAL { ?dbpedia rdfs:comment ?comment. }
    }`;

    console.log(`Query to DBpedia`, query);
    endpoint.query(query).execute((err, res) => {
      if (err) return reject(err);
      let data = res.results.bindings;
      let d0 = data[0];

      if (!d0) return resolve(artist); // no data

      if (d0.redirect) return followRedirect(artist, d0.redirect.value, resolve, reject);

      artist.dbpedia_uri = d0.dbpedia.value;
      artist.picture = d0.picture && d0.picture.value;
      artist.birthPlace = d0.birthPlace && d0.birthPlace.value;
      artist.deathPlace = d0.deathPlace && d0.deathPlace.value;
      artist.comment = data.map(d => d.comment);
      resolve(artist);
    });

  });
}

function followRedirect(artist, uri, resolve, reject) {
  artist.dbpedia_uri = uri;
  let endpoint = artist.wikipedia_uri.match(WIKI_FR_REGEX) ? frDbpediaEndpoint : dbpediaEndpoint;

  let query = `
        PREFIX dbp: <http://dbpedia.org/property>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        SELECT * WHERE {
        OPTIONAL { <${uri}> foaf:depiction ?picture. }
        OPTIONAL { <${uri}> dbo:birthPlace ?birthPlace. }
        OPTIONAL { <${uri}> dbo:deathPlace ?deathPlace. }
        <${uri}> rdfs:comment ?comment
        }`;

  console.log("REDIRECT: New query to DBpedia: " + query);
  endpoint.query(query).execute((err, res) => {
    if (err) return reject(err);
    let data = res.results.bindings;
    let d0 = data[0];

    if (!d0) return resolve(artist); // no data

    artist.picture = d0.picture && d0.picture.value;
    artist.birthPlace = d0.birthPlace && d0.birthPlace.value;
    artist.deathPlace = d0.deathPlace && d0.deathPlace.value;
    artist.comment = data.map(d => d.comment);
    resolve(artist);
  });

}

function getViafFromIsni(artist) {
  return new Promise(function(resolve, reject) {

    request({
        uri: isniAPI,
        encoding: 'binary',
        qs: {
          query: `pica.isn = "${artist.isni}"`
        }
      }).then(res => {
        console.log('ISNI: ' + artist.isni);
        // fs.writeFile('../data/' + artist.isni + '.xml', res, 'utf8');

        let data = JSON.parse(xml2json.toJson(res));
        let record = data['ZiNG:searchRetrieveResponse']['ZiNG:records']['ZiNG:record'];
        artist.viaf = [];
        artist.wikidata = [];
        artist.musicbrainz = [];

        if (!record) return resolve(artist);
        if (Array.isArray(record)) record = record[0];

        let fields = record['ZiNG:recordData'].collection.record.datafield;
        let ids = fields.filter(f => f.tag = '003Z');
        let viafIds = ids.filter(f => hasSubfield(f, 'l', 'VIAF'));
        let wikidataIds = ids.filter(f => hasSubfield(f, "2", 'WKP')).filter(f => hasSubfield(f, '0'));
        let musicBrainzIds = ids.filter(f => hasSubfield(f, "l", 'MUBZ'));

        viafIds.forEach(v => artist.viaf.push(getSubfield(v, "0")));
        wikidataIds.forEach(w => {
          let val = getSubfield(w, "0");
          if (val.match('Q\d+')) artist.wikidata.push(val);
        });
        musicBrainzIds.forEach(w => artist.musicbrainz.push(getSubfield(w, "0")));

        let wikipediaCandidates = ids.filter(f => hasSubfield(f, "b", 'Wikipedia'));
        let wikipedia = wikipediaCandidates.find(f => getSubfield(f, 'u').match(WIKI_EN_REGEX)) ||
          wikipediaCandidates.find(f => getSubfield(f, 'u').match(WIKI_FR_REGEX));
        if (wikipedia) artist.wikipedia_uri = getSubfield(wikipedia, 'u').replace(/^https/, 'http');

        resolve(artist);
      })
      .catch(reject);
  });
}

function hasSubfield(f, code, label) {
  if (!Array.isArray(f.subfield)) return;
  if (label)
    return f.subfield.some(s => s.code == code && s.$t == label);
  else return f.subfield.some(s => s.code == code);
}

function getSubfield(f, code) {
  if (!Array.isArray(f.subfield)) return;
  let s = f.subfield.find(s => s.code == code);
  return (s && s.$t) || '';
}



function getArtistsFromSparql() {
  console.log(options);
  let limit = options.limit ? options.limit : 100000;
  let offset = options.page * CHUNKSIZE;
  let offsetString = offset ? `OFFSET ${offset}` : '';

  return new Promise(function(resolve, reject) {
    var query = `select DISTINCT * where {
    ?s a ecrm:E21_Person;
    owl:sameAs ?isni

    FILTER (contains(str(?isni), 'isni'))
  } LIMIT ${limit}
    ${offsetString}`;

    // FILTER(str(?s) = 'http://data.doremus.org/artist/6963af5e-b126-3d40-a84b-97e0b78f5452')

    console.log("Query to DOREMUS: " + query);
    doremusEndpoint.query(query).execute((err, res) => {
      if (err) return reject(err);
      resolve(res.results.bindings);
    });

  });
}

function chunk(list, chuckSize) {
  // https://stackoverflow.com/a/44687374/1218213
  return new Array(Math.ceil(list.length / chuckSize)).fill().map(_ => list.splice(0, chuckSize));
}
