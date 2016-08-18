const request = require('request');

function rdfTranslator(str, source, target, callback) {
    let url = `http://rdf-translator.appspot.com/convert/${source}/${target}/content`;

    request.post({url:url, form: {content:str}}, function(err,response,body){
        if (!err && response.statusCode != 200) err = response.statusCode;

        callback(err, body);
    });
}

module.exports = rdfTranslator;
