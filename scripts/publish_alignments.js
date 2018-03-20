const fs = require('fs-extra');
const path = require('path');
const rdfTranslator = require('rdf-translator');

let inputFolder = '../vocabularies/alignments/';
let outputFolder = '../vocabularies/exactMatch/';

fs.readdirSync(inputFolder)
  .filter(f => f.endsWith('-SKOS'))
  .forEach(f => {
    let folder = path.join(inputFolder, f);
    let outFolder = path.join(outputFolder, f.replace('-SKOS', ''));
    fs.ensureDirSync(outFolder);

    fs.readdirSync(folder)
      .filter(f => f.endsWith('.rdf'))
      .forEach(f => {
        fs.readFile(path.join(folder, f))
          .then(str => rdfTranslator(str, 'xml', 'n3'))
          .then(str => writeTtl(str, path.join(outFolder, f.replace(".rdf", ".ttl"))))
          .catch(e => console.error(e));
      });
  });

function writeTtl(str, output) {
  fs.writeFile(output, str, 'utf8', function(err) {
    if (err) return console.error(err);

    console.log(`${output} saved!`);
  });
}
