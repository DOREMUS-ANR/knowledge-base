/*
 * Script to be executed after the creation of the genre vocabulary (rameau.genres.ttl)
 */

const fs = require('fs'),
    rdfTranslator = require('rdf-translator'),
    $rdf = require('rdflib');

const RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#"),
    SKOS = $rdf.Namespace("http://www.w3.org/2004/02/skos/core#");

var file = __dirname + '/rameau.genres.ttl';

var rdfData = fs.readFileSync(file).toString();

var store = $rdf.graph();
var contentType = 'text/turtle';
var baseUrl = "http://data.doremus.org/vocabulary/rameau/genre/";
try {
    $rdf.parse(rdfData, store, baseUrl, contentType);
    let suffixTable = [];

    for (let statement of store.statementsMatching(undefined, SKOS('prefLabel'))) {
        let suffix;
        let label = statement.object.value;
        suffix = (label.replace(/ /g, '_')).toLowerCase();;
        suffixTable.push({
            uri: statement.subject.value,
            suffix
        });
    }

    for (let s of suffixTable) {
        var kk = s.suffix;
        rdfData = rdfData.replace(new RegExp(s.uri, 'g'), baseUrl + noAccent(s.suffix));
    }

    writeTtl(rdfData);

} catch (err) {
    console.log(err);
}

function writeTtl(str) {
    fs.writeFile(file, str, 'utf8', function(err) {
        if (err) return console.error(err);

        console.log("The file was saved!");
    });
}

function noAccent (str) {
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
    for(var i = 0; i < accent.length; i++){
        str = str.replace(accent[i], noaccent[i]);
    }
     
    return str;
}