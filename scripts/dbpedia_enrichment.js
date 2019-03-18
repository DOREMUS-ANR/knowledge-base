/* eslint no-use-before-define: "off" */
const fs = require('fs-extra');
const async = require('async');
const $rdf = require('rdflib');
const commandLineArgs = require('command-line-args');
const SparqlClient = require('./sparql-client');

const doremusEndpoint = new SparqlClient('http://data.doremus.org/sparql');
const dbpediaEndpoint = new SparqlClient('http://dbpedia.org/sparql');
const frDbpediaEndpoint = new SparqlClient('http://fr.dbpedia.org/sparql');

// const WIKI_EN_REGEX = /https?:\/\/en\.wikipedia\.org\/wiki\/(.+)/;
const WIKI_FR_REGEX = /https?:\/\/fr\.wikipedia\.org\/wiki\/(.+)/;

const RDFS = $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#');
const OWL = $rdf.Namespace('http://www.w3.org/2002/07/owl#');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const DBP = $rdf.Namespace('http://dbpedia.org/property/');

let artists;
let artLen;
let done = 0;

const optionDefinitions = [{
  name: 'page',
  type: Number,
  defaultValue: 0,
}, {
  name: 'limit',
  type: Number,
  defaultValue: 0,
}];
const options = commandLineArgs(optionDefinitions);
const CHUNKSIZE = 500;

const OUTPUT_FOLDER = '../data/dbpedia';
fs.ensureDirSync(OUTPUT_FOLDER);

getArtistsFromSparql().then((res) => {
  artists = res.map(r => ({
    doremus_uri: r.s.value,
    wikipedia_uri: r.wikipedia.value,
  }));
  artLen = artists.length;

  console.log(`Start processing of ${artLen} artists.`);

  async.eachOfSeries(chunk(artists, CHUNKSIZE), (ck, key, mainCallback) => {
    const page = options.page + key;
    const store = $rdf.graph();

    async.eachSeries(ck, (artist, callback) => {
      console.log(`Artist ${++done}/${artLen}`);
      getInfoFromDBpedia(artist)
        .then((a) => {
          if (!a) callback();

          const art = $rdf.sym(a.doremus_uri);
          store.add(art, FOAF('isPrimaryTopicOf'), $rdf.sym(a.wikipedia_uri));
          store.add(art, OWL('sameAs'), $rdf.sym(a.dbpedia_uri));
          if (a.picture) store.add(art, FOAF('depiction'), $rdf.sym(a.picture));

          if (a.birthPlace) {
            const bp = $rdf.sym(a.birthPlace);
            store.add(art, DBP('birthPlace'), bp);
            store.add(bp, RDFS('label'), a.birthPlaceName);
          }

          if (a.deathPlace) {
            const dp = $rdf.sym(a.deathPlace);
            store.add(art, DBP('deathPlace'), dp);
            store.add(dp, RDFS('label'), a.deathPlaceName);
          }

          if (a.comment && a.comment[0]) {
            for (const comment of a.comment) store.add(art, RDFS('comment'), $rdf.literal(comment.value, comment['xml:lang']));
          }
          callback();
        }).catch(e => console.error(e));
    }, () => {
      console.log('Serializing Turtle');
      store.namespaces = {
        dbr: 'http://dbpedia.org/resource/',
        dbp: 'http://dbpedia.org/property/',
        foaf: 'http://xmlns.com/foaf/0.1/',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        wd: 'http://www.wikidata.org/entity/',
        viaf: 'http://viaf.org/viaf/',
        doremus_artist: 'http://data.doremus.org/artist/',
      };
      $rdf.serialize(undefined, store, 'http://example.org', 'text/turtle', (err, str) => {
        if (err) return console.error(err);

        // workaround https://github.com/linkeddata/rdflib.js/issues/185
        const linkUriRegex = /link:uri((?:\s+"(?:http.+)",?)+)([;.])/g;
        str = str.replace(linkUriRegex, (match, p1, p2) => {
          const uris = p1.split('",').map(u => `<${u.replace(/"/g, '').trim()}>`);
          return `owl:sameAs ${uris.join(',\n        ')}${p2}`;
        });
        // END workaround

        fs.writeFile(`${OUTPUT_FOLDER}/artists_${page}.ttl`, str, 'utf8');
        return mainCallback();
      });
    });
  });
});

function getInfoFromDBpedia(artist) {
  const endpoint = artist.wikipedia_uri.match(WIKI_FR_REGEX)
    ? frDbpediaEndpoint : dbpediaEndpoint;

  const query = `
        PREFIX dbp: <http://dbpedia.org/property>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        SELECT * WHERE {
        ?dbpedia foaf:isPrimaryTopicOf <${artist.wikipedia_uri.replace(/"/g, '\u201c')}>
        OPTIONAL { ?dbpedia dbo:wikiPageRedirects ?redirect . }
        OPTIONAL { ?dbpedia foaf:depiction ?picture. }
        OPTIONAL {
          ?dbpedia dbo:birthPlace | dbp:birthPlace ?birthPlace.
          { SELECT ?birthPlace, sql:BEST_LANGMATCH(?birthPlaceLabel, 'en;q=1.0, en-gb;q=0.8, *;q=0.1', 'en') as ?birthPlaceLabel
          WHERE { ?birthPlace rdfs:label ?birthPlaceLabel } }
        }
        OPTIONAL {
          ?dbpedia dbo:deathPlace | dbp:deathPlace ?deathPlace.
          { SELECT ?deathPlace, sql:BEST_LANGMATCH(?deathPlaceLabel, 'en;q=1.0, en-gb;q=0.8, *;q=0.1', 'en') as ?deathPlaceLabel
          WHERE { ?deathPlace rdfs:label ?deathPlaceLabel } }
        }
        OPTIONAL { ?dbpedia rdfs:comment ?comment. }
    }`;

  console.log('Query to DBpedia', query);
  return endpoint.query(query).then((res) => {
    const data = res.results.bindings;
    const d0 = data[0];

    if (!d0) return null; // no data

    if (d0.redirect) return followRedirect(artist, d0.redirect.value);

    artist.dbpedia_uri = d0.dbpedia.value;
    artist.picture = d0.picture && d0.picture.value;
    artist.birthPlace = d0.birthPlace && d0.birthPlace.value;
    artist.birthPlaceName = d0.birthPlaceLabel && d0.birthPlaceLabel.value;
    artist.deathPlace = d0.deathPlace && d0.deathPlace.value;
    artist.deathPlaceName = d0.deathPlaceLabel && d0.deathPlaceLabel.value;
    artist.comment = data.map(d => d.comment);
    return artist;
  });
}

function followRedirect(artist, uri) {
  artist.dbpedia_uri = uri;
  const endpoint = artist.wikipedia_uri.match(WIKI_FR_REGEX) ? frDbpediaEndpoint : dbpediaEndpoint;

  const query = `
        PREFIX dbp: <http://dbpedia.org/property>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        SELECT * WHERE {
        OPTIONAL { <${uri}> foaf:depiction ?picture. }
        OPTIONAL { <${uri}> dbo:birthPlace ?birthPlace
          { SELECT ?birthPlace, sql:BEST_LANGMATCH(?birthPlaceLabel, 'en;q=1.0, en-gb;q=0.8, *;q=0.1', 'en') as ?birthPlaceLabel
          WHERE { ?birthPlace rdfs:label ?birthPlaceLabel } }
        }
        OPTIONAL { <${uri}> dbo:deathPlace ?deathPlace.
          { SELECT ?deathPlace, sql:BEST_LANGMATCH(?deathPlaceLabel, 'en;q=1.0, en-gb;q=0.8, *;q=0.1', 'en') as ?deathPlaceLabel
          WHERE { ?deathPlace rdfs:label ?deathPlaceLabel } }
       }
        <${uri}> rdfs:comment ?comment
        }`;

  console.log(`REDIRECT: New query to DBpedia: ${query}`);
  return endpoint.query(query).then((res) => {
    const data = res.results.bindings;
    const d0 = data[0];

    if (!d0) return artist; // no data

    artist.picture = d0.picture && d0.picture.value;
    artist.birthPlace = d0.birthPlace && d0.birthPlace.value;
    artist.deathPlace = d0.deathPlace && d0.deathPlace.value;
    artist.birthPlaceName = d0.birthPlaceLabel && d0.birthPlaceLabel.value;
    artist.deathPlaceName = d0.deathPlaceLabel && d0.deathPlaceLabel.value;

    artist.comment = data.map(d => d.comment);
    return artist;
  });
}

function getArtistsFromSparql() {
  console.log(options);
  const limit = options.limit ? options.limit : 100000;
  const offset = options.page * CHUNKSIZE;
  const offsetString = offset ? `OFFSET ${offset}` : '';

  const query = `select DISTINCT * where {
    ?s a ecrm:E21_Person;
      foaf:isPrimaryTopicOf ?wikipedia
  } LIMIT ${limit}
    ${offsetString}`;

  // FILTER(str(?s) = 'http://data.doremus.org/artist/6963af5e-b126-3d40-a84b-97e0b78f5452')

  console.log(`Query to DOREMUS: ${query}`);
  return doremusEndpoint.query(query).then(res => res.results.bindings);
}

function chunk(list, chuckSize) {
  // https://stackoverflow.com/a/44687374/1218213
  return new Array(Math.ceil(list.length / chuckSize)).fill().map(() => list.splice(0, chuckSize));
}
