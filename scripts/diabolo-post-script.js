/*
 * Script to be executed after the creation of the Radio France genre and mop
 * vocabularies (mop-rf.ttl and genre-rf.ttl)
 */

const fs = require('fs'),
  rdfTranslator = require('rdf-translator'),
  toSentenceCase = require('to-sentence-case'),
  Geonames = require('geonames.js');

const geonames = new Geonames({
  username: 'lisena',
  lan: 'fr',
  encoding: 'JSON'
});

var geonamesCache = {};
const edNoteRegex = /skos:editorialNote "(.+)"@fr/g;

var files = [
  'genre-diabolo.ttl',
  'mop-diabolo.ttl'
];

for (let fileName of files) processFile(fileName);

async function processFile(fileName) {
  console.log(`Processing file ${fileName}`);
  let file = __dirname + '/../vocabularies/' + fileName;
  let rdfData = fs.readFileSync(file).toString();

  // Sentence case for editorialNote
  rdfData = cleanNoteUppercase(rdfData);

  rdfData = await replaceAsync(rdfData, /dcterms:coverage "(.+)"@fr/g, match2geonames);

  console.log(`Formatting the rdf`);
  rdfTranslator(rdfData, 'n3', 'n3', (err, data) => {
    if (err) return console.error(err);
    writeTtl(data, file);
  });
}

async function replaceAsync(str, regex, asyncFn) {
  //https://stackoverflow.com/a/48032528/1218213
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}


async function match2geonames(match, label) {
  console.log(label);
  let modifier;
  if (label.includes("(")) {
    let start = label.indexOf("("),
      end = label.indexOf(")");
    modifier = label.substring(start + 1, end);
    label = label.slice(0, start) + label.slice(end + 1);
    label = label.trim();
  }
  let value = await searchInGeonames(label, modifier);

  if (!value) return match;
  return 'dcterms:coverage ' + value;
}

function searchInGeonames(label, modifier) {
  if (modifier == "peuple") return immediatePromise();


  let size = Object.keys(geonamesCache).length;
  let cachedKey = label + modifier;
  let cachedValue = geonamesCache[cachedKey];
  if (cachedValue) return immediatePromise(cachedValue);

  let feature;
  switch (modifier) {
    case 'rep':
    case 'etat':
      feature = 'PCLI';
      break;
    case 'ville':
      feature = 'PPL';
      break;
    case 'region':
      feature = 'RGN';
      break;
    case 'ile':
      feature = 'ISL';
      break;
    case 'iles':
      feature = 'ISLS';
      break;
    case undefined:
      break; //do nothing
    default:
      label = modifier + ' ' + label;
  }
  let params = {
    name: label,
    lang: 'fr'
  };
  if (feature) params.featureCode = feature;
  return geonames.search(params)
    .then((resp) => {
      let best = resp.geonames[0];

      let readable = label + ' | ' + best.toponymName + ' | ' + best.geonameId + ' | ' + best.score;
      console.log(readable);

      let geoUri = `<http://sws.geonames.org/${best.geonameId}/>`;
      geonamesCache[cachedKey] = geoUri;
      return geoUri;
    }).catch(e => {
      console.error(e);
      return null;
    });
}

function cleanNoteUppercase(text) {
  return text.replace(edNoteRegex, (match, note) => {
    let n = note.split('. ').map((sentence) => toSentenceCase(sentence)).join('. ');
    return `skos:editorialNote "${n}"@fr`;
  });
}

function immediatePromise(value) {
  return new Promise(resolve => resolve(value));
}

function writeTtl(str, file) {
  fs.writeFile(file, str, 'utf8', function(err) {
    if (err) return console.error(err);

    console.log("The file was saved!");
  });
}
