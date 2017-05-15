Inference
================

Commands for set up the inference on the properties classes in the [DOREMUS Virtuoso Triplestore](http://data.doremus.org/sparql).


## Install

I consider that the [ontology](/DOREMUS-ANR/doremus-ontology) has been loaded in the `<http://data.doremus.org/ontology>` graph.

I load in the `/data` folder all the ontologies I want to inference (i.e. [skos.rdf](https://www.w3.org/2009/08/skos-reference/skos.rdf)).

    docker exec -it virtuoso_doremus bash
    /usr/local/virtuoso-opensource/bin/isql-v

    ld_dir ('/data', 'skos.rdf', 'http://data.doremus.org/commons');

    # add inference rules

    rdfs_rule_set('mus','http://data.doremus.org/ontology');
    rdfs_rule_set('mus','http://data.doremus.org/commons');

## Use

Querying the [SPARQL endpoint](http://data.doremus.org/sparql), it is required to add `DEFINE input:inference 'mus'` on top of your query.

#### Examples

```sparql
DEFINE input:inference 'mus'

SELECT * WHERE {
  ?dedication mus:U44i_is_dedication_statement_of ?expression
} LIMIT 100
```

[results with inference](http://data.doremus.org/sparql?default-graph-uri=&query=DEFINE+input%3Ainference+%27mus%27%0D%0A%0D%0Aselect+*+where+%7B+%3Fdedication+mus%3AU44i_is_dedication_statement_of+%3Fexpression+%7DLIMIT+100&format=text%2Fhtml&timeout=0&debug=on) - [results without inference](http://data.doremus.org/sparql?default-graph-uri=&query=select+*+where+%7B+%3Fdedication+mus%3AU44i_is_dedication_statement_of+%3Fexpression+%7DLIMIT+100&format=text%2Fhtml&timeout=0&debug=on)

```sparql
DEFINE input:inference 'mus'

SELECT * WHERE {
  ?a skos:inScheme <http://data.doremus.org/vocabulary/iaml/mop/>
}
```

[results with inference](http://data.doremus.org/sparql?default-graph-uri=&query=DEFINE+input%3Ainference+%27mus%27%0D%0Aselect+*+where+%7B+%3Fa+skos%3AinScheme+%3Chttp%3A%2F%2Fdata.doremus.org%2Fvocabulary%2Fiaml%2Fmop%2F%3E+%7D%0D%0A&format=text%2Fhtml&timeout=0&debug=on) (they include also `skos:isTopConceptOf`, subproperty of `skos:inScheme`)  
[results without inference](http://data.doremus.org/sparql?default-graph-uri=&query=select+*+where+%7B+%3Fa+skos%3AinScheme+%3Chttp%3A%2F%2Fdata.doremus.org%2Fvocabulary%2Fiaml%2Fmop%2F%3E+%7D%0D%0A&format=text%2Fhtml&timeout=0&debug=on)
