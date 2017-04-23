const request = require('request');
const rdfTranslator = require('rdf-translator');
const fs = require('fs');

var file = __dirname + '/../vocabularies/mop-mimo.ttl';

var options = {
  url: 'http://data.mimo-db.eu/sparql/describe?uri=http://www.mimo-db.eu/InstrumentsKeywords',
  headers: {
    'Accept': 'text/turtle'
  }
};

function onDownloaded(error, response, body) {
  console.log('downloaded!');
  if (error) return console.error(error);
  if (response.statusCode != 200)
    return console.error('Error: ' + response.statusCode, response);

  writeTtl(body);
  // console.log(`Formatting the rdf`);
  // rdfTranslator(body, 'n3', 'n3', function(err, data) {
  //   if (err) return console.error(err);
  //   writeTtl(data);
  // });
}

function writeTtl(str) {
  fs.writeFile(file, str, 'utf8', function(err) {
    if (err) return console.error(err);

    console.log("The file was saved!");
  });
}

console.log('downloading MIMO');
request(options, onDownloaded);