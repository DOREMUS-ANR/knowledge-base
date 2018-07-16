# ITEMA3 knowledge base

Loaded in GRAPH `<http://data.doremus.org/itema3>`.

| File                       | Content                 | Count        |
|----------------------------|-------------------------| -------------|
| itema3.item.tar.gz         | Concerts + Tracks (F31) | 2296         |
| itema3.organization.tar.gz | Organizations           | 4618         |
| itema3.person.tar.gz       | Artists                 | 86026        |
| itema3.place.tar.gz        | Places + GeoNames Links | 3148 (+2505) |


 [Query for concerts](http://data.doremus.org/sparql?default-graph-uri=&query=SELECT+count%28distinct+%3Fwork%29+as+%3FnbWorks+count%28distinct+%3Fconcert%29+as+%3FnbConcerts%0D%0AFROM+%3Chttp%3A%2F%2Fdata.doremus.org%2Fitema3%3E%0D%0AWHERE+%7B+%3Fconcert+a+efrbroo%3AF31_Performance+.%0D%0A++++++++%3Fwork+a+efrbroo%3AF15_Complex_Work+%7D%0D%0A&format=text%2Fhtml&timeout=0&debug=on):
```sparql
SELECT count(distinct ?work) as ?nbWorks count(distinct ?concert) as ?nbConcerts
FROM <http://data.doremus.org/itema3>
WHERE { ?concert a efrbroo:F31_Performance .
        ?work a efrbroo:F15_Complex_Work }
```
