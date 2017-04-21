This folder contains examples of query for interrogating the DOREMUS data, i.e. in the [DOREMUS SPARQL Endpoint](http://data.doremus.org/data).

## A. Works and Expressions

1. **[en]** Which works have been composed by Mozart ?   
**[fr]** Quelles oeuvres ont été composées par Mozart ?  
[query](./1.rq) - [results](http://data.doremus.org/sparql?default-graph-uri=&query=PREFIX+mus%3A+%3Chttp%3A%2F%2Fdata.doremus.org%2Fontology%23%3E%0D%0APREFIX+ecrm%3A+%3Chttp%3A%2F%2Ferlangen-crm.org%2Fcurrent%2F%3E%0D%0APREFIX+efrbroo%3A+%3Chttp%3A%2F%2Ferlangen-crm.org%2Fefrbroo%2F%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0A%0D%0A%23+%5Ben%5D+Which+works+have+been+composed+by+Mozart%3F%0D%0A%23+%5Bfr%5D+Quelles+oeuvres+ont+%C3%A9t%C3%A9+compos%C3%A9es+par+Mozart+%3F%0D%0A%0D%0ASELECT+DISTINCT+%3Fexpression+SAMPLE%28%3Ftitle%29+as+%3Ftitle%0D%0AWHERE+%7B%0D%0A++%3Fexpression+a+efrbroo%3AF22_Self-Contained_Expression+%3B%0D%0A++++++++++mus%3AU70_has_title+%3Ftitle+.%0D%0A++%3FexpCreation+efrbroo%3AR17_created+%3Fexpression+%3B%0D%0A++++++++++ecrm%3AP9_consists_of+%2F+ecrm%3AP14_carried_out_by+%3Fcomposer+.%0D%0A++%3Fcomposer+foaf%3Aname+%22Wolfgang+Amadeus+Mozart%22%0D%0A%7D+ORDER+BY+%3Ftitle%0D%0A&format=text%2Fhtml&timeout=0&debug=on)

1. **[en]** Which works have been composed in 1836 ?  
**[fr]** Quelles oeuvres ont été composées en 1836 ?  
[query](./2.rq) - [results](http://data.doremus.org/sparql?default-graph-uri=&query=PREFIX+mus%3A+%3Chttp%3A%2F%2Fdata.doremus.org%2Fontology%23%3E%0D%0APREFIX+ecrm%3A+%3Chttp%3A%2F%2Ferlangen-crm.org%2Fcurrent%2F%3E%0D%0APREFIX+efrbroo%3A+%3Chttp%3A%2F%2Ferlangen-crm.org%2Fefrbroo%2F%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0A%0D%0A%23+%5Ben%5D+Which+works+have+been+composed+in+1836+%3F%0D%0A%23+%5Bfr%5D+Quelles+oeuvres+ont+%C3%A9t%C3%A9+compos%C3%A9es+en+1836+%3F%0D%0A%0D%0A%0D%0ASELECT+DISTINCT+%3Fexpression%2C+SAMPLE%28%3Ftitle%29+as+%3Ftitle%2C+%3Fstart%2C+%3Fend%0D%0AWHERE+%7B%0D%0A++%3Fexpression+a+efrbroo%3AF22_Self-Contained_Expression+%3B%0D%0A++++++++++mus%3AU70_has_title+%3Ftitle+.%0D%0A++%3FexpCreation+efrbroo%3AR17_created+%3Fexpression+%3B%0D%0A++++++++++ecrm%3AP4_has_time-span+%3Fts.%0D%0A++%3Fts+ecrm%3AP80_end_is_qualified_by+%3Fend+%3B%0D%0A++++++++++++++++ecrm%3AP79_beginning_is_qualified_by+%3Fstart+.%0D%0A++FILTER+%28+%3Fstart+%3C%3D+%221836%22%5E%5Exsd%3AgYear+AND+%3Fend+%3E%3D+%221836%22%5E%5Exsd%3AgYear+%29%0D%0A%7D+ORDER+BY+%3Fstart%0D%0A&format=text%2Fhtml&timeout=0&debug=on)

1. **[en]** Which works have been written for string quartet?  
**[fr]** Quelles oeuvres ont été écrites pour un quatuor à cordes ?  
[query](./3.rq) - [results](http://data.doremus.org/sparql?default-graph-uri=&query=PREFIX+mus%3A+%3Chttp%3A%2F%2Fdata.doremus.org%2Fontology%23%3E%0D%0APREFIX+ecrm%3A+%3Chttp%3A%2F%2Ferlangen-crm.org%2Fcurrent%2F%3E%0D%0APREFIX+efrbroo%3A+%3Chttp%3A%2F%2Ferlangen-crm.org%2Fefrbroo%2F%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0A%0D%0A%23+%5Ben%5D+Which+works+have+been+written+for+string+quartet%3F%0D%0A%23+%5Bfr%5D+Quelles+oeuvres+ont+%C3%A9t%C3%A9+%C3%A9crites+pour+un+quatuor+%C3%A0+cordes+%3F%0D%0A%0D%0A%0D%0ASELECT+DISTINCT+%3Fexpression%2C+SAMPLE%28%3Ftitle%29+as+%3Ftitle%2C+%3Fcasting%0D%0AWHERE+%7B%0D%0A++%3Fexpression+a+efrbroo%3AF22_Self-Contained_Expression+%3B%0D%0A++++++++++mus%3AU70_has_title+%3Ftitle+%3B%0D%0A++++++++++mus%3AU13_has_casting+%3Fcasting+.%0D%0A++%0D%0A++++%3Fcasting+mus%3AU23_has_casting_detail+%3FallCastingDets+.%0D%0A++++%0D%0A++++%3Fcasting+mus%3AU23_has_casting_detail+%3FcastingDet1+.%0D%0A++++%3FcastingDet1+mus%3AU2_foresees_use_of_medium_of_performance_of_type+%3Chttp%3A%2F%2Fdata.doremus.org%2Fvocabulary%2Fiaml%2Fmop%2Fsvl%3E+%3B%0D%0A++++++++++++mus%3AU30_foresees_quantity_of_mop+2+.%0D%0A%0D%0A++++%0D%0A++++%3Fcasting+mus%3AU23_has_casting_detail+%3FcastingDet2+.%0D%0A++++%3FcastingDet2+mus%3AU2_foresees_use_of_medium_of_performance_of_type+%3Chttp%3A%2F%2Fdata.doremus.org%2Fvocabulary%2Fiaml%2Fmop%2Fsva%3E+%3B%0D%0A++++++++++++mus%3AU30_foresees_quantity_of_mop+1+.%0D%0A%0D%0A++++%3Fcasting+mus%3AU23_has_casting_detail+%3FcastingDet3+.%0D%0A++++%3FcastingDet3+mus%3AU2_foresees_use_of_medium_of_performance_of_type+%3Chttp%3A%2F%2Fdata.doremus.org%2Fvocabulary%2Fiaml%2Fmop%2Fsvc%3E+%3B%0D%0A++++++++++++mus%3AU30_foresees_quantity_of_mop+1+.%0D%0A%0D%0A%7D%0D%0AGROUP+BY+%3Fexpression+%3Fcasting%0D%0AHAVING+%28COUNT%28%3FallCastingDets%29+%3D+3%29&format=text%2Fhtml&timeout=0&debug=on)

1. **[en]** What works are linked to a particular work and what type of link connect them?  
**[fr]** Quelles oeuvres sont reliées à telle oeuvre et quel type de lien les unissent ?  
[query](./4.rq) - [results](http://data.doremus.org/sparql?default-graph-uri=&query=PREFIX+mus%3A+%3Chttp%3A%2F%2Fdata.doremus.org%2Fontology%23%3E%0D%0APREFIX+ecrm%3A+%3Chttp%3A%2F%2Ferlangen-crm.org%2Fcurrent%2F%3E%0D%0APREFIX+efrbroo%3A+%3Chttp%3A%2F%2Ferlangen-crm.org%2Fefrbroo%2F%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0ASELECT+DISTINCT+%3Fwork%2C+SAMPLE%28%3Ftitle%29+as+%3Ftitle%2C+%3Flink%2C+%3Fwork2%2C+SAMPLE%28%3Ftitle2%29+as+%3Ftitle2%0D%0AWHERE+%7B%0D%0A++%3Fwork+%3Flink+%3Fwork2.%0D%0A%0D%0A++%3Fwork+a+efrbroo%3AF14_Individual_Work%3B%0D%0A++++++++efrbroo%3AR9_is_realised_in+%2F+mus%3AU70_has_title+%3Ftitle+.%0D%0A++%3Fwork2+a+efrbroo%3AF14_Individual_Work%3B%0D%0A++++++++efrbroo%3AR9_is_realised_in+%2F+mus%3AU70_has_title+%3Ftitle2+.%0D%0A%7D+ORDER+BY+%3Ftitle%0D%0ALIMIT+500&format=text%2Fhtml&timeout=0&debug=on)

1. **[en]** Retrieve all the works that have been written by German composers between 1800 and 1850 and performed at the Royal Albert Hall  
**[fr]** donne-moi toutes les oeuvres de compositeurs allemands écrites entre 1800 et 1850 et exécutées au Royal Albert Hall  
[query (partial)](./5.rq) - no result produced so far

1. **[en]** Give me the works written for oboe and orchestra after the 1900  
**[fr]** Donne-moi les oeuvres écrites pour hautbois et orchestre depuis 1900 
[query (partial)](./7.rq) - [results](http://data.doremus.org/sparql?default-graph-uri=&query=PREFIX+mus%3A+%3Chttp%3A%2F%2Fdata.doremus.org%2Fontology%23%3E%0D%0APREFIX+ecrm%3A+%3Chttp%3A%2F%2Ferlangen-crm.org%2Fcurrent%2F%3E%0D%0APREFIX+efrbroo%3A+%3Chttp%3A%2F%2Ferlangen-crm.org%2Fefrbroo%2F%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0A%0D%0A%23+%5Ben%5D+Give+me+the+works+written+for+oboe+and+orchestra+after+the+1900%0D%0A%23+%5Bfr%5D+Donne-moi+les+oeuvres+%C3%A9crites+pour+hautbois+et+orchestre+depuis+1900%0D%0A%0D%0A%0D%0ASELECT+DISTINCT+%3Fexpression%2C+SAMPLE%28%3Ftitle%29+as+%3Ftitle%2C+%3Fcasting%0D%0AWHERE+%7B%0D%0A++%3Fexpression+a+efrbroo%3AF22_Self-Contained_Expression+%3B%0D%0A++++++++++mus%3AU70_has_title+%3Ftitle+%3B%0D%0A++++++++++mus%3AU13_has_casting+%3Fcasting+.%0D%0A++%0D%0A++%3Fcasting+mus%3AU23_has_casting_detail+%2F+mus%3AU2_foresees_use_of_medium_of_performance_of_type+%3Chttp%3A%2F%2Fdata.doremus.org%2Fvocabulary%2Fiaml%2Fmop%2Fwob%3E+.%0D%0A++%7B%0D%0A++++%3Fcasting+mus%3AU23_has_casting_detail+%2F+mus%3AU2_foresees_use_of_medium_of_performance_of_type%0D%0A++++%3Chttp%3A%2F%2Fdata.doremus.org%2Fvocabulary%2Fiaml%2Fmop%2Fo%3E%0D%0A++%7D+UNION+%7B%0D%0A++++%3Fcasting+mus%3AU23_has_casting_detail+%2F+mus%3AU2_foresees_use_of_medium_of_performance_of_type+%2F+skos%3Abroader+%3Chttp%3A%2F%2Fdata.doremus.org%2Fvocabulary%2Fiaml%2Fmop%2Fo%3E%0D%0A++%7D%0D%0A++%0D%0A++%3FexpCreation+efrbroo%3AR17_created+%3Fexpression+%3B%0D%0A++++++++++ecrm%3AP4_has_time-span+%2F+ecrm%3AP79_beginning_is_qualified_by+%3Fstart+.%0D%0A++++++++++%0D%0A++FILTER+%28+%3Fstart+%3E+%221900%22%5E%5Exsd%3AgYear+%29%0D%0A%0D%0A%7D+ORDER+BY+%3Fstart%0D%0A%23+Note%3A+we+have+only+the+name+of+the+artists&format=text%2Fhtml&timeout=0&debug=on)

1. **[en]** Give me the works written for violin, clarinet and piano (strictly)  
**[fr]** Donne-moi les oeuvres écrites pour violon, clarinette et piano (strictement)
[query](./8.rq) - [results](http://data.doremus.org/sparql?default-graph-uri=&query=PREFIX+mus%3A+%3Chttp%3A%2F%2Fdata.doremus.org%2Fontology%23%3E%0D%0APREFIX+ecrm%3A+%3Chttp%3A%2F%2Ferlangen-crm.org%2Fcurrent%2F%3E%0D%0APREFIX+efrbroo%3A+%3Chttp%3A%2F%2Ferlangen-crm.org%2Fefrbroo%2F%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0A%0D%0A%23+%5Ben%5D+Give+me+the+works+written+for+violin%2C+clarinet+and+piano+%28strictly%29%0D%0A%23+%5Bfr%5D+Donne-moi+les+oeuvres+%C3%A9crites+pour+violon%2C+clarinette+et+piano+%28strictement%29%0D%0A%0D%0A%0D%0ASELECT+DISTINCT+%3Fexpression%2C+SAMPLE%28%3Ftitle%29+as+%3Ftitle%2C+%3Fcasting%0D%0AWHERE+%7B%0D%0A++%3Fexpression+a+efrbroo%3AF22_Self-Contained_Expression+%3B%0D%0A++++++++++mus%3AU70_has_title+%3Ftitle+%3B%0D%0A++++++++++mus%3AU13_has_casting+%3Fcasting+.%0D%0A++%0D%0A++++++++%3Fcasting+mus%3AU23_has_casting_detail+%3FallCastingDets+.%0D%0A++++++++%0D%0A++++++++%3Fcasting+mus%3AU23_has_casting_detail+%3FcastingDet1+.%0D%0A++++++++%3FcastingDet1+mus%3AU2_foresees_use_of_medium_of_performance_of_type+%3Chttp%3A%2F%2Fdata.doremus.org%2Fvocabulary%2Fiaml%2Fmop%2Fsvl%3E+.%0D%0A%0D%0A++++++++%0D%0A++++++++%3Fcasting+mus%3AU23_has_casting_detail+%3FcastingDet2+.%0D%0A++++++++%3FcastingDet2+mus%3AU2_foresees_use_of_medium_of_performance_of_type+%3Chttp%3A%2F%2Fdata.doremus.org%2Fvocabulary%2Fiaml%2Fmop%2Fwcl%3E+.%0D%0A%0D%0A++++++++%3Fcasting+mus%3AU23_has_casting_detail+%3FcastingDet3+.%0D%0A++++++++%3FcastingDet3+mus%3AU2_foresees_use_of_medium_of_performance_of_type+%3Chttp%3A%2F%2Fdata.doremus.org%2Fvocabulary%2Fiaml%2Fmop%2Fkpf%3E+.%0D%0A%0D%0A%7D%0D%0AGROUP+BY+%3Fexpression+%3Fcasting%0D%0AHAVING+%28COUNT%28%3FallCastingDets%29+%3D+3%29%0D%0A&format=text%2Fhtml&timeout=0&debug=on)

## B. Artists

This section contains only partially the queries because the modeling or the publication of data is still work in progress.

1. **[en]** Retrieve the works by artists that have been mutually lovers  
**[fr]** donne-moi les oeuvres d’artistes qui étaient fiancés l’un à l’autre

1. **[en]** Give me the name and the birth date of artists that played the oboe  
**[fr]** donne-moi les noms et date de naissance des artistes qui jouent du hautbois  
[query (partial)](./6.rq) - [results](http://data.doremus.org/sparql?default-graph-uri=&query=SELECT+DISTINCT+%3Fartist%0D%0AWHERE+%7B%0D%0A++%3Fperformance+ecrm%3AP9_consists_of+%3Fpart+.%0D%0A++%3Fpart+ecrm%3AP14_carried_out_by+%3Fartist+%3B%0D%0A++mus%3AU1_used_medium_of_performance+%2F+skos%3AprefLabel+%22oboe%22%40en+.%0D%0A%0D%0A%7D&format=text%2Fhtml&timeout=0&debug=on)

## C. Performances and Publications

This section does not contains the queries because the modeling or the publication of data is still work in progress.

1. **[en]** Among concerts and CDs, which works are often played after <other work> ?  
**[fr]** Dans les concerts et les cd, quelles oeuvres sont souvent jouées après <telle autre oeuvre> ?  

1. **[en]** Give me pairs of recorded tracks that are composed with the same key 
**[fr]** donne-moi des paires de titres enregistrés qui sont composés dans la même tonalité

1. **[en]** Give me the artists that have been recorded more than 10 times by Radio France  
**[fr]** donne-moi les artistes qui ont été enregistrés plus de 10 fois par Radio France


## TODO

1. **[en]** todo  
**[fr]** Donne-moi les oeuvres de musique de chambre comportant au moins violon, clarinette et piano

1. **[en]** todo  
**[fr]** Donne-moi les oeuvres de musique de chambre comportant au plus violon, clarinette et piano

1. **[en]** todo  
**[fr]** Donne-moi les oeuvres de musique de chambre comportant au plus violon, clarinette et piano, mais pas les sonates pour violon et piano ni pour clarinette et piano

1. **[en]** todo  
**[fr]** Donne-moi toutes les mélodies écrites sur des textes français pour voix moyenne entre 1870 et 1913.

1. **[en]** todo  
**[fr]** Donne-moi tous les mouvements lents d’oeuvres de musique de chambre dans lesquelles figure au moins un violoncelle

1. **[en]** todo  
**[fr]** Donne-moi toute la musique vocale sacrée pour choeur écrite en Angleterre depuis 1945

1. **[en]** todo  
**[fr]** Donne-moi les sonates pour flûte d’une durée inférieure ou égale à 15 minutes

1. **[en]** todo  
**[fr]** Donne-moi toutes les oeuvres ayant une distribution alternative

1. **[en]** todo  
**[fr]** Donne-moi tous les opéras dont le compositeur est également le librettiste

1. **[en]** todo  
**[fr]** Donne-moi tous les enregistrements dans lesquels un compositeur interprète son ou ses oeuvres

1. **[en]** todo  
**[fr]** Donne-moi tous les enregistrements dans lesquels un compositeur dirige au moins une de ses oeuvres

1. **[en]** todo  
**[fr]** Donne-moi la liste des choristes du Collegium Vocale ayant participé à au moins trois enregistrements radio du choeur en 2012

1. **[en]** todo  
**[fr]** Donne-moi le nom du ou de la soliste vocale ayant le plus été enregistré(e) par Radio France en 2014


1. **[en]** todo  
**[fr]** Donne-moi la liste de tous les concerts enregistrés par Radio France à la cité de la musique entre 1995 et 2014

1. **[en]** todo  
**[fr]** Donne-moi la liste des concerts enregistrés par Radio France à l’auditorium de la cité de la musique dans lesquels étaient utilisés un ou plusieurs clavecins français du XVIIe siècle appartenant au musée de la musique

1. **[en]** todo  
**[fr]** Donne-moi la liste des enregistrements réalisés en 2014 par harmonia mundi avec des ensembles musicaux français, utilisant au moins une partition urtext

1. **[en]** todo  
**[fr]** Donne-moi la liste des concerts de l’Orchestre National de France dans lesquels le chef d’orchestre est également soliste instrumental (dans le même concert)
-Donne-moi la liste des concerts donnés à la Philharmonie dans lesquels l’orchestre est dirigé par le violon solo

1. **[en]** todo  
**[fr]** Donne-moi la liste des musiciens de l’Orchestre Philharmonique ayant une activité de musique de chambre dans des concerts organisés par Radio France

1. **[en]** todo  
**[fr]** Donne-moi la liste des concerts enregistrés à l’Abbaye aux Dames de Saintes hors période du festival de Saintes

1. **[en]** todo  
**[fr]** Donne-moi toutes les oeuvres pour lesquelles il existe des castings alternatifs ayant un nombre d’interprètes différent (p.ex. clavier & orch / vl, hb & orch)

1. **[en]** todo  
**[fr]** Donne-moi toutes les oeuvres pour lesquelles il existe des castings alternatifs ayant un nombre d’instruments différent (p.ex. 2 pianos ou piano 4 mains)

1. **[en]** todo  
**[fr]** Donne-moi une liste de mélodies du XXème siècle autour de la gastronomie

1. **[en]** todo  
**[fr]** Donne-moi une liste d’oeuvres de musique de chambre composées au XIXème siècle par des compositeurs scandinaves

1. **[en]** todo  
**[fr]** Donne-moi toutes les sonates pour piano et violon dont la durée est comprise entre 20 et 30 minutes

1. **[en]** todo  
**[fr]** Donne moi la liste des oeuvres dont au moins un des dédicataires est aussi le créateur de l’oeuvre

1. **[en]** todo  
**[fr]** Donne moi la liste des réductions d’oeuvres de Wagner réalisées au XXème siècle

1. **[en]** todo  
**[fr]** Donne moi la liste de toutes les symphonies qui comprennent 5 mouvements

1. **[en]** todo  
**[fr]** Donne moi la liste des oeuvres composées par Mozart dans les 5 dernières années de sa vie

1. **[en]** todo  
**[fr]** Donne moi la liste des dernières parutions de DGG en musique de chambre pour cordes

1. **[en]** todo  
**[fr]** Donne moi la liste des oeuvres qui ont été créées là où elles ont été composées

1. **[en]** todo  
**[fr]** Donne moi un cycle de mélodies dont l’auteur de texte est le même pour chaque mélodie

1. **[en]** todo  
**[fr]** Donne moi une liste d’oeuvres composées entre 1860 et 1880, pour petite formation (maximum 6 instrumentistes) dont 1 piano

1. **[en]** todo  
**[fr]** Donne moi la liste des oeuvres de J.S. Bach entre BWV 30 et BWV 70

1. **[en]** todo  
**[fr]** Donne-moi toutes les oeuvres pour piano liées à d’autres oeuvres musicales

1. **[en]** todo  
**[fr]** Donne-moi toutes les oeuvres pour piano basées sur des oeuvres de Schubert

1. **[en]** todo  
**[fr]** Donne-moi toutes les oeuvres liées à un domaine artistique extra-musical

1. **[en]** todo  
**[fr]** Donne-moi toutes les oeuvres liées à la musique populaire

1. **[en]** todo  
**[fr]** Donne-moi tous les enregistrement libre de droit (requête à mixer avec des thématiques intéressant par exemple le milieu du cinéma)

1. **[en]** todo  
**[fr]** Donne-moi toutes les oeuvres pour lesquelles le titre de l’Expression Performée est différent du titre de l’oeuvre (F22)

1. **[en]** todo  
**[fr]** Donne-moi toutes les oeuvres interprétées sur au moins un mop différent du casting de l’oeuvre (solistes uniquement, p.ex. Cto piano & orch, Sonate piano...)

1. **[en]** todo  
**[fr]** Donne moi le découpage de tous les enregistrements de Don Giovanni de Mozart

1. **[en]** todo  
**[fr]** Donne moi tous les enregistrements de l’air du catalogue (air isolé ou dans un enregistrement de l’opéra)

1. **[en]** todo  
**[fr]** Donne moi tous les enregistrements d’airs d’opéra dont la bibliothèque dispose d’au moins une partition

1. **[en]** todo  
**[fr]** Donne moi tous les enregistrements d’airs d’opéra dont la bibliothèque ne dispose d’aucune partition
