const isoConv = require('iso-language-converter');


// Literals are exported like "text@ita"
// We want to change them to "text"@it
function literalLangFix(source) {
    // source should be a string

    // fix bad format
    return source.replace(/@([a-zA-Z\-]+)"/g, '"@$1')
        // fix bad japanese co
        .replace(/("@|\$\$)jap/g, '$1jpn')
        // replace 3chars with 2chars in literals
        .replace(/"@([a-z]{3})/g, (match, p1) => {
            return '"@' + isoConv(p1, {
                to: 1
            });
        })
        // replace $$ita with Italian
        .replace(/\$\$([a-z]{3})/g, (match, p1) => isoConv(p1));
}

module.exports = literalLangFix;
