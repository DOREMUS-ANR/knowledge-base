# Bibliothèque nationale de France base data dump

Loaded in GRAPH `<http://data.doremus.org/bnf>`.

| File               | Content     | Num         |
|--------------------|-------------|-------------|
| bnf.persons.tar.gz | Persons     | 57 200 [1]  |
| bnf.works.tar.gz   | TUM         | 134 719 [1] |


[1]: data updated on 03/03/2017. 
* [Query for persons](http://data.doremus.org/sparql?default-graph-uri=http%3A%2F%2Fdata.doremus.org%2Fbnf&query=SELECT+count%28%3Fperson%29+as+%3FnPersons%0D%0AWHERE+%7B+%0D%0A%3Fperson+a+ecrm%3AE21_Person%0D%0A%7D&format=text%2Fhtml&timeout=0&debug=on):
```sparql
SELECT count(?person) as ?nPersons
FROM <http://data.doremus.org/bnf>
WHERE { ?person a ecrm:E21_Person }```
* [Query for works](http://data.doremus.org/sparql?default-graph-uri=http%3A%2F%2Fdata.doremus.org%2Fbnf&query=SELECT+count%28%3Fwork%29+as+%3FnWorks%0D%0AWHERE+%7B+%3Fwork+a+efrbroo%3AF15_Complex_Work+%7D%0D%0A&format=text%2Fhtml&timeout=0&debug=on):
```sparql
SELECT count(?work) as ?nWorks
FROM <http://data.doremus.org/bnf>
WHERE { ?work a efrbroo:F15_Complex_Work }
```