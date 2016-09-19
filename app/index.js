const deasync = require('deasync');
const fs = require('fs');
const https = require('follow-redirects').https;
const ncp = require('ncp').ncp;
const path = require('path');
const url = require('url');

const config = require('./config.json');
const Isql = require('./isql');

var isql = new Isql(config.db.user, true, config.db.isqlCommand);

for (let src of config.sources) {
    if (src.skip) continue;

    let destFolder = path.join(config.targetRoot, src.folder),
        srcFolder = '../' + src.folder,
        mountedVolFolder = path.join(config.db.mountedVolumeRoot, src.folder);

    try {
        fs.accessSync(destFolder);
    } catch (error) {
        fs.mkdirSync(destFolder);
    }

    if (src.remote) {
        let filename = src.remote.substring(src.remote.lastIndexOf("/") + 1);
        downloadFile(src.remote, path.join(destFolder, filename), printError);
    } else {
        deasync(ncp(srcFolder, destFolder, printError));
    }
    writeGlobalGraphFile(destFolder, src.graph);

    let xc = config.toFile ? 'saveCommand' : 'exec';
    if (src.clean)
        isql[xc](`SPARQL CLEAR GRAPH <${src.graph}>;`);
    isql[xc](`delete from DB.DBA.load_list;`);
    isql[xc](`ld_dir('${mountedVolFolder}', '${src.format}', '${src.graph}');`);
    isql[xc](`rdf_loader_run ();`);
}

if (config.toFile) {
    let finalDestination = path.join(config.targetRoot, `upload-${Date.now()}.sh`);
    fs.writeFileSync(finalDestination, "#!/bin/sh\n\n" + isql.getCommands().join("\n"));
    console.log('Upload script written in ' + finalDestination);
} else
    console.log('done');

function writeGlobalGraphFile(dest, graph) {
    fs.writeFileSync(path.join(dest, 'global.graph'), graph);
}

function downloadFile(source, dest, callback) {
    let file = fs.createWriteStream(dest);
    let done = false;

    https.get(source, (response) => {
        console.log('here');
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            callback();
            done = true;
        });
    }).on('error', callback);

    deasync.loopWhile(function() {
        return !done;
    });
}

function printError(err) {
    if (err) console.error(err);
}
