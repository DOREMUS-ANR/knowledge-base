/*
 * Script to be executed after the creation of the Radio France genre vocabulary (genre-rf.ttl)
 */

const fs = require('fs'),
    rdfTranslator = require('rdf-translator'),
    toSentenceCase = require('to-sentence-case');

var file = __dirname + '/../vocabularies/genre-rf.ttl';
var rdfData = fs.readFileSync(file).toString();

// Sentence case for editorialNote
var edNoteRegex = /skos:editorialNote "(.+)"@fr/g;
rdfData = rdfData.replace(edNoteRegex, (match, note) => {
    let n = note.split('. ').map((sentence)=>toSentenceCase(sentence)).join('. ');
    return `skos:editorialNote "${n}"@fr`;
});

console.log(`Formatting the rdf`);
rdfTranslator(rdfData, 'n3', 'n3', function(err, data) {
    if (err) return console.error(err);
    writeTtl(data);
});

function writeTtl(str) {
    fs.writeFile(file, str, 'utf8', function(err) {
        if (err) return console.error(err);

        console.log("The file was saved!");
    });
}