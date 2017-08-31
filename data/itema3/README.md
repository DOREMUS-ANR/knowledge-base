# ITEMA3 base data dump

Loaded in GRAPH `<http://data.doremus.org/itema3>`.

| File                       | Content                 | Num              |
|----------------------------|-------------------------| ---------------- |
| itema3.item.tar.gz         | Concerts + Tracks       | 9[1] [2]        |
| itema3.organization.tar.gz | Organizations           | 4618 [1]         |
| itema3.person.tar.gz       | Artists                 | 86026 [1]        |
| itema3.place.tar.gz        | Places + GeoNames Links | 3148 (+2505)[1]  |


 [Query for concerts](http://data.doremus.org/sparql?default-graph-uri=http%3A%2F%2Fdata.doremus.org%2Fphilharmonie&query=select+count%28%3Fwork%29+as+%3FnWorks%0D%0Awhere+%7B+%3Fwork+a+efrbroo%3AF15_Complex_Work+%7D&format=text%2Fhtml&timeout=0&debug=on):
```sparql
SELECT count(?concert) as ?nConcerts
FROM <http://data.doremus.org/itema3>
WHERE { ?concert a efrbroo:F31_Performance; a prov:Entity }
```


[1]: data updated on 31/08/2017.
[2]: data not fully converted
