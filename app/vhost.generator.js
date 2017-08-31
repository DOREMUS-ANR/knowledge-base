var fs = require("fs");

const VIRTUOSO_DEFAULTS = ['sparql', 'fct', 'conductor', 'DAV', 'describe'];
const ppRegex = /ProxyPass +\/([^ ]+)/g;

var text = fs.readFileSync("data.doremus.org.conf", 'utf8');
var template = fs.readFileSync("vhost.template.sql", 'utf8');

var id = 0;
var all = '';
for (let line of text.split('\n')) {

  let result = ppRegex.exec(line);
  if (!result) continue;

  let key = result[1];
  if (VIRTUOSO_DEFAULTS.includes(key)) continue;

  let filename = `vhost/${key}.sql`;
  let content = template.replace(/%%name%%/g, key)
    .replace(/%%host%%/g, 'http://data.doremus.org')
    .replace(/%%id%%/g, ++id);

  all += content;
  fs.writeFile(filename, content, handleError);
}
fs.writeFile(`vhost/all.sql`, all, handleError);



function handleError(err) {
  if (err) console.error(err);
}
