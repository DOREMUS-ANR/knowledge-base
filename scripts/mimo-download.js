const request = require('request');
const fs = require('fs');
const path = require('path');

var file = path.join(__dirname, '../vocabularies/mop-mimo.ttl');
var options = {
  url: 'http://data.mimo-db.eu/sparql/describe?uri=http://www.mimo-db.eu/InstrumentsKeywords',
  headers: {
    'Accept': 'text/turtle'
  }
};

function writeTtl(str) {
  fs.writeFile(file, str, 'utf8', (err) => {
    if (err) console.error(err);
    else console.log("The file was saved!");
  });
}

function onDownloaded(error, response, body) {
  console.log('downloaded!');
  if (error) return console.error(error);
  if (response.statusCode != 200)
    return console.error('Error: ' + response.statusCode, response);

  // add the missing concept scheme on the first line
  const ttl = '<http://www.mimo-db.eu/InstrumentsKeywords> a <http://www.w3.org/2004/02/skos/core#ConceptScheme> .\n' + body;

  return writeTtl(ttl);
}

console.log('downloading MIMO');
request(options, onDownloaded);
