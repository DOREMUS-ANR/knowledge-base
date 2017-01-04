/*
 * Script to be executed after the creation of the Radio France genre and mop
 * vocabularies (mop-rf.ttl and genre-rf.ttl)
 */

const fs = require('fs'),
    rdfTranslator = require('rdf-translator'),
    toSentenceCase = require('to-sentence-case');

var files = [
    'genre-diabolo.ttl',
    'mop-diabolo.ttl'
];

for (let fileName of files) {
    let file = __dirname + '/../vocabularies/' + fileName;
    let rdfData = fs.readFileSync(file).toString();

    // Sentence case for editorialNote
    var edNoteRegex = /skos:editorialNote "(.+)"@fr/g;
    rdfData = cleanNoteUppercase(rdfData);

    console.log(`Formatting the rdf`);
    rdfTranslator(rdfData, 'n3', 'n3', (err, data) => {
        if (err) return console.error(err);
        writeTtl(data, file);
    });
}

function cleanNoteUppercase(text) {
    return text.replace(edNoteRegex, (match, note) => {
        let n = note.split('. ').map((sentence) => toSentenceCase(sentence)).join('. ');
        return `skos:editorialNote "${n}"@fr`;
    });
}

function writeTtl(str, file) {
    fs.writeFile(file, str, 'utf8', function(err) {
        if (err) return console.error(err);

        console.log("The file was saved!");
    });
}