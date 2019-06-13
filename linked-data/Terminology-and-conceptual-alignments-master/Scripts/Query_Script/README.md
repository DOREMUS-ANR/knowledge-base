Query_Script

Ce dossier contient deux fichiers de code JAVA, le premier nommé « link_files.java » nous permet d’intégrer le chemin qui fait appel au dossier qui contient les fichiers de format Turtle (TTL) contenu dans la DataBase (soit vers Prévus_M26 soit vers Réalisés_F31) 

le deuxième fichier JAVA nommé « Jena_code_SPARQL.java » nous permet d’appliquer d’appliquer les requêtes  afin d’extraire les informations stockées dans les classes distinctes soit sous forme d’URI ou de chaîne de caractères et ceci par le biais de l’API Jena qu’il faudra ajouter lors de ce traitement. 

Afin de nous permettre la manipulation des données il faut tout d’abord les extraire, ce qui a induit à
l’utilisation du langage de requête SPARQL pour une première manipulation des données

	a) Code lecture des fichiers
		le parcours récursif de la totalité des fichiers des deux bases en indiquant le chemin du
		dossier contenant ces fichiers.
	b) Code extraction
		L’extraction des données

Insertion de la requête d’extraction (concerts prévus M26) ou Requête d’extraction (concerts réalisés
F31 Et F29) et appeler leur exécution chacune à part et le résultat est sous forme de fichier Texte.