# Philharmonie base data dump

Loaded in GRAPHs `<http://data.doremus.org/philarmonie>` and `<http://data.doremus.org/euterpe>`.

| File              | Content            | Num        |
|-------------------|--------------------| ---------- |
| pp.works.tar.gz   | TUM + Work Records | 12 355     |
| pp.euterpe.tar.gz | Foreseen Events    | 3 553      |


* [Query for works](http://data.doremus.org/sparql?default-graph-uri=http%3A%2F%2Fdata.doremus.org%2Fphilharmonie&query=select+count%28%3Fwork%29+as+%3FnWorks%0D%0Awhere+%7B+%3Fwork+a+efrbroo%3AF15_Complex_Work+%7D&format=text%2Fhtml&timeout=0&debug=on):
```sparql
SELECT count(?work) as ?nWorks
FROM <http://data.doremus.org/philharmonie>
WHERE { ?work a efrbroo:F15_Complex_Work }
```
* [Query for foreseen events](http://data.doremus.org/sparql?default-graph-uri=http%3A%2F%2Fdata.doremus.org%2Fphilharmonie&query=select+count%28%3Fwork%29+as+%3FnWorks%0D%0Awhere+%7B+%3Fwork+a+efrbroo%3AF15_Complex_Work+%7D&format=text%2Fhtml&timeout=0&debug=on):
```sparql
SELECT count(?event) as ?nEvent
FROM <http://data.doremus.org/euterpe>
WHERE { ?event a mus:M26_Foreseen_Performance }
```
