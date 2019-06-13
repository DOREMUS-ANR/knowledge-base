L’objectif est de lier chaque attribut résultant de la requête d’un concert prévu avec celui qui
lui correspond dans les classes des concerts réalisés en créant des couples de concert.

	-UriConcertPrévu avec UriConcertRéalisé ;
	-TitreConcertPrévu avec TitreConcertRéalisé. ;
	-DateConcertPrévu avec DateConcertRéalisé etc…

Il faut tout de même mentionner que la condition pour le traitement des cas de figure est que
pour chaque cas, la date est la même.

	a) Classe ou code d’initiation des attributs utiles :
		Ce code contient les différents attributs utilisés pour l’alignement (URI, Titre, date, nom
		artiste, enregistrement et note).
	b) Classe ou code d’alignement :
		ce code permet la lecture des fichiers résultat des requêtes et
	b.1 Définition des chemins des dossiers contenants les fichiers entrés des concerts prévus et réalisés ;
	b.2 Définition du chemin du dossier contenant les fichiers résultants (sortis) de l’alignement ;
	b.3 Définition des noms des catégories de seuils de similarité attribués pour chaque cas de figure
	c) classe ou code de calcul de la similarité
		ce code permet le calcul de similarité selon la mesure de Levenstein où les fonctions et les conditions
		de mesure sont définies.