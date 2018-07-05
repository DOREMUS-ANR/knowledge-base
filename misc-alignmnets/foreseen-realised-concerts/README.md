### Alignemnet des concerts prévus et concerts réalisés (bases euterpe et aloes de la Philharmonie de Paris).

- **results**: contains the results of the alignment.

Nous disposons d'une base de données d'environs 7500 fichiers .ttl qu'on va parcourir et comparer un par un et classer les résultats des alignements dans des fichiers
appelés fichiers retour.

Nous déclarons avant tout nos fonctions de mesure de similarité, il s'agit de Levenshtein et Jaro-Winkler, et aussi la fonction qui traite
les données bruts de la base de donnée. le code présent est commenté dans chaqu'une des étapes.

#### ETAPE 01: Préparation des données pour l'alignement

Nous allons exploiter les fichiers ici présents et lancer "tache3_Philharmonie.py" depuis le terminal, On définit une fonction parcours() qui consiste à parcourir les répertoires et fichiers présents dans le même dossier, et qui grace à une boucle
et des expressions régulières spécifiques, elle récupère les informations reliées à chaque événement, qu'il soit EUTERPE ou PP, il s'agit
donc de récupérer l'URI du titre et sa date, et ces informations seront inscrites dans deux fichiers euterpe.txt et pp.txt qu'on exploitera
durant la seconde étape lors des alignements, les informations seront organisées de cette manière:

l'URI de l'événement + le nom du fichier source + le titre de la performance tokénisé et lémmatisé + la date de l'événement 
+ le titre original de l'événement
  - pp.txt      : qui contiendra des résumers de chaque fichier PP dans une seule ligne (~7320 au total et seulement ~732 qui contiennenet
  la classe F31) 
    exemple : <http://data.doremus.org/performance/050ec49c-7a00-3a2b-8c25-29115589fb04>	0924969.ttl	simonbolivaryouthorchestravenezuela 
    $date:2018-03-29T21:48	Simón Bolívar Youth Orchestra Venezuela
    
  - euterpe.txt : qui contiendra des résumers de chaque fichier EUTERPE dans une seule ligne (~3500 au total identifiés avec M29) 
    exemple : <http://data.doremus.org/performance/80e7f775-3bb3-3ebd-ab68-3b31abe89ed1>	15456.ttl	donquichotte $date:2015-11-17T19:00	
    Don Quichotte

#### Etape 02:

Nous allons maintenant exploiter les fichiers euterpe.txt et pp.txt pour génerer les résultats d'alignement suivants :
Nous effectuons la chaque ligne (exemple ci dessus), du coup nous auront dans la mémoire du terminal le titre et la date d'événement 
EUTERPE d'un côté, et ceux de PP de l'autre, nous comparerons chaque élément avec l'autre (titre1>titre2) et (date1>date2) à l'aide
de 4 seuils de similarité, qui seront définis comme suit:

  
if levenshteinN(date1,date2) ==1.0 and jaro(date1,date2) == 1.0:#dates exactes
 |_____  if levenshteinN(titre1,titre2) == 1.0 and jaro(titre1,titre2) == 1.0:  #titres exactes
 |       |      > EMTD.txt  :  Evenements avec même DATE et même TITRE
 |       |       
 |       |__ elif levenshteinN(titre1,titre2) >= 0.5 and jaro(titre1,titre2) > 0.7: #titres légèrement différents
 |       |      > EMTrD.txt :  Evenements avec même DATE et titre légèrement différent.
 |       |
 |       |__ elif levenshteinN(titre1,titre2) >= 0.25 and jaro(titre1,titre2) > 0.5: #titres avec dénominateur commun
 |              > EMD.txt   :  Evenements avec même DATE et titre complétement différent.
 |              
elif levenshteinN(titre1,titre2) == 1.0 and jaro(titre1,titre2) == 1.0:  #titres exactes
  > EMT.txt   :  Evenements avec même TITRE et date différente.
  
  

#### Stats

Nous avons calculé les pourcentages sur un total de 3553 concerts EUTERPE, si nous prenons par contre les calcul par rapport
aux fichiers PP, nous disposons de 7320 fichiers dont seulement 732 sont désignés avec la classe d'intérêt  F31, ça nous 
donnera du coup :  
                  - EMTD : 110/732  = 15.05% __
                  - EMTrD : 119/732 = 16.25% __|
                  - EMD : 308/732   = 42.05% __| :  un total de 537 / 732 = 73.35% .

                  - EMT : 320/732    = 43.70%__| 
  
 
