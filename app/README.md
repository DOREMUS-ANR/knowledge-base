DOREMUS knowledge base deployment app
========

Upload ontology and vocabulary to Virtuoso through isql.

Each command should be run pointing to the `app` folder.

    cd app/

### Installation

Latest version of Node.JS is required.

    npm install
    node index

### Configuration

Write your configuration into the `config.json` file:

```js
{
    "targetRoot": "/a/specific/folder", //where to put files in output
    "toFile": false, //specify true if you want to write the isql commands on a file
    "db": { //virtuoso settings
        "user": "dba", // user
        "mountedVolumeRoot": "/tmp", //where virtuoso can find the files
        //normally, should be the same of targetRoot
        "isqlCommand": "isql" // command to run for isql (i.e. isql-v)
    },
    "sources": [ // list of sources to upload
       {
        "folder": "ontology", //where to find files (write it anyway!)
        "remote": "https://github.com/DOREMUS-ANR/doremus-ontology/raw/master/doremus.ttl", //specify a single remote file to upload
        "graph": "http://data.doremus.org/ontology", //graph in which upload
        "format": "*.ttl", //file format
        "clean": false, //if true, clean the graph before uploading the new data
        "skip": false //if true, this source is not considered
      }
    ]
}
```
