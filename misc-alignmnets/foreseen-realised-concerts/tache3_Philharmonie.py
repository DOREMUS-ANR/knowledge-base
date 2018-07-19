#!/usr/bin/python3
# -*- coding: utf-8 -*

from itertools import dropwhile
import os, re




#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#Traitement des fichiers et récupération titres & dates : ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


#//////////////////////////////////////////////////////////////////////////
#///////////////////    MESURE JARO    ////////////////////////////////////
#//////////////////////////////////////////////////////////////////////////

def _get_diff_index(first, second):
    if first == second:
        return -1

    if not first or not second:
        return 0

    max_len = min(len(first), len(second))
    for i in range(0, max_len):
        if not first[i] == second[i]:
            return i

    return max_len

def _get_prefix(first, second):
    if not first or not second:
        return ""

    index = _get_diff_index(first, second)
    if index == -1:
        return first

    elif index == 0:
        return ""

    else:
        return first[0:index]


def jaro(mot1, mot2): #s et t étant les chaines de caractère à aligner
    mot1_len = len(mot1) #s_len est le nombre de caractères dans s
    mot2_len = len(mot2) #t_len est le nombre de caractères dans t
 
    if mot1_len == 0 and mot2_len == 0: # si il n y a pas de lettres dans les deux mots, alors retourner la valeur 1 comme distance JARO
        return 1
 
    match_distance = (max(mot1_len, mot2_len) // 2) - 1 # on calcul la moitié de la distance du max des longueurs de s ou t et on soustrait cette valeur à 1
    
    #print('\n','Match_distance :',match_distance) #Console 
    
    mot1_matches = [False] * mot1_len 
    mot2_matches = [False] * mot2_len
 
    matches = 0
    transpositions = 0
 
    for i in range(mot1_len): #on parcours s
        start = max(0, i-match_distance) #start est le max entre 0 et la valeur de i-match_distance
        end = min(i+match_distance+1, mot2_len) #end est le min entre i+match_distance et la longueur de t
 
        for j in range(start, end): #
            if mot2_matches[j]:
                continue
            if mot1[i] != mot2[j]:
                continue
            mot1_matches[i] = True
            mot2_matches[j] = True
            matches += 1
            break
 
    if matches == 0:
        return 0
    #print ('Matches :',matches) #Console
    k = 0
    for i in range(mot1_len):
        if not mot1_matches[i]:
            continue
        while not mot2_matches[k]:
            k += 1
        if mot1[i] != mot2[k]:
            transpositions += 1
        k += 1
    #print ('Transpositions :',transpositions) #Console
    result= ((matches / mot1_len) + (matches / mot2_len) + ((matches - transpositions/2) / matches)) / 3


        
#define SCALING_FACTOR 0.1
    SCALING_FACTOR = 0.1
#calculer les caractères en commun prefix supérieur à 4 chars */
    
    l = min(len(_get_prefix(mot1, mot2)), 4)
    #Jaro-Winkler distance */
    resultW = result + (l * SCALING_FACTOR * (1 - result));

    return (round(resultW,3))
#//////////////////////////////////////////////////////////////////////////
#/////////////////// MESURE LEVENSTEIN ////////////////////////////////////
#//////////////////////////////////////////////////////////////////////////

def levenshteinN(mot1,mot2):
	ligne_i = [ k for k in range(len(mot1)+1) ]
	for i in range(1, len(mot2) + 1):
		ligne_prec = ligne_i
		ligne_i = [i]*(len(mot1)+1)
		for k in range(1,len(ligne_i)):	
			cout = int(mot1[k-1] != mot2[i-1])	
			ligne_i[k] = min(ligne_i[k-1] + 1, ligne_prec[k] + 1, ligne_prec[k-1] + cout)	
	result = 1-(ligne_i[len(mot1)]/(max(len(mot1),len(mot2))))
	return(round(result,3))

#//////////////////////////////////////////////////////////////////////////
#Fonction qui récupère un bloc de texte qui commence par begin\d et se termine par end\d
#//////////////////////////////////////////////////////////////////////////
def get_block_lines(f, begin, end):
	for line in dropwhile(lambda x: begin not in x, f):
		yield line
		if end in line: return

#//////////////////////////////////////////////////////////////////////////
#Traitement de texte //////////////////////////////////////////////////////
#//////////////////////////////////////////////////////////////////////////

#liste des caractères accentués a désaccentuer 
accent = ['é', 'è', 'ê', 'ë', 'à','á','É', 'ù', 'û', 'ú', 'ü','ç','č', 'ô','ó','ö', 'î','í','Î', 'ï', 'â','ã','ā','ţ','(\'','\', \'','\', "','\')','")','\\','/','ø']
sans_accent = ['e', 'e', 'e', 'e', 'a','a','E', 'u', 'u', 'u','u', 'c', 'c','o','o','o', 'i','i', 'I', 'i','a', 'a', 'a','t','','~','~','','','','','o']

#liste stop words 
stopwords = open('french', 'r').read().split()
stopWordFr=re.compile('d\'|l\'|d’|l’|\.|:|"|!|\(|\)|«|-|_|,')




#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#Récupérer les titres + dates de chaque évenement depuis EUTERPE : //////////////////////////////////////////////////////////////////////////////////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


#Fonction pour parcourir le contenu des dossiers EUTERPE
repertoire="/home/nassim-bnb/Bureau/TER/Tache 3/euterpe/"

def parcours(repertoire) :
	print("EUTERPE > ", repertoire)
	liste = os.listdir(repertoire)
	for fichier in liste :
		if os.path.isdir(repertoire+"/"+fichier) :
			parcours(repertoire+"/"+fichier)
			#print(repertoire+"/"+fichier)
		else :
			#REGEX qui vérifie l'extension des fichiers (*.ttl)
			resultat = re.search(".\.ttl", fichier)   # Il y a au moins un caractère avant l’extension
			if resultat:

				#On parcours fichier par fichier
				f=open(repertoire+"/"+fichier, encoding='utf-8')
				#On définit le block1 qui contient le titre et l'iD de l'événement
				begin = 'M26'
				end = '> .'
				block1 = ''.join(get_block_lines(f, begin, end))


				#Récupérer le titre
				reTitre=re.search(r'\s+ecrm:P102_has_title\s+"(.*)"',block1)
				if reTitre:
					titre=reTitre.group(1) #titre mémorisé
					titre=str(titre)
					titrePrime = titre
					#Transformer les majuscules en minuscules
					titre=titre.lower()

					#Supprimer les accents
					for i in range(len(accent)):
						titre = titre.replace(accent[i], sans_accent[i])

					titre = titre.split()
					#print(titre)
					filteredtext = [t for t in titre if t.lower() not in stopwords]

					s = "";
					# on recole la phrase
					titre = s.join(filteredtext)

					#Supprimer les stop-words manuellement et sans appel à ntlk
					titre=re.sub(stopWordFr,'',titre)

				#On referme le fichier f pour pouvoir le relire à nouveau pour extraire les informations de date, car si on ne fait pas ça, le programme récupérera que les dates situées après le titre, sachant que parfois les dates se trouvent bien avant...
				f.close()


				mAA=list()
				#Récupérer l'URI de l'évènement
				#On relis le fichier à nouveau
				f=open(repertoire+"/"+fichier, 'r')
				data=f.read()
				#print(data)
				reURI=re.findall(r"(\<.*\>)\n\s+a\s+.*M26",data)
				if reURI:
					for line in reURI:
						sentence=str(line)

						#print(sentence+'	'+fichier+'	'+titre+' $date:'+date+'	'+titrePrime+'\n')
						#euterpe.write(sentence+'	'+fichier+'	'+titre+' $date:'+date+'	'+titrePrime+'\n')
						if sentence not in mAA:
							mAA.append(sentence)

				f.close()


				#Récupérer la date
				#On relis le fichier à nouveau
				f=open(repertoire+"/"+fichier, 'r')
				fR=f.readlines()
				#REGEX URI de l'évènement
				f.close()
				reDateUri2=re.search(r'\s+mus:U8_foresees_time_span\s+(.*)\s+,\s+(.*)\s+;',block1)
				if reDateUri2: # 1 > le cas ou l'évenement contient plusieurs dates 
					#On définit le block2 qui contient la date en utilisant l'iD récupéré dans la précédente opérantion
					dateUri=reDateUri2.group(1) #première partie de la date pouvant contenir à elle-même aussi plusieurs dates > mémorisé
					dateUri2=reDateUri2.group(2) #seconde date > mémorisé
					#print(fichier+'\n'+dateUri)
					separateur=','
					if separateur in dateUri: #présence de plusieurs liens dans le lien de la première partie? ><<<<<<<<<<<<<<<<<<D
						begin2 = dateUri.replace(" ", "")
						begin2 = begin2.split(',') #on split la ligne en plusieurs dateUri et on obtient le reste des lien présents dans le reDateUri2.group(1)

						f=open(repertoire+"/"+fichier, 'r')
						lecture = f.read() #lecture fichier 1
						
						corps = re.compile(r"(\<http.*\>)\n\s+a\s+ecrm:.*\n\s+rdfs.*\n\s+time.*.*\n\s+time:inXSDDate\s+\"(\d{4}-\d{2}-\d{2}).*\"") #on récupère tous les blocs contenant comme clé un lien, et une date comme valeur)
						res = corps.findall(lecture) #on repère grace à re.findall() tous les blocs d'un seul coup
						if res:
							for line in res:
								blocDate = str(line) #on transforme en chaine de caractère
								
								#r la liste des iDs dates
								r=list()
								#h la liste des dates
								h=list()
								reElt=re.search(r'.*(\<http.*\>).*(\d{4}-\d{2}-\d{2}).*',blocDate) #ma REGEX pour identifier les bloc contenant les dates valides
								if reElt:
									hh=reElt.group(1)# le lien
									mm=reElt.group(2)# la date
									r.append(hh)#remplissage des listes
									h.append(mm)
									dic = dict(zip(r, h))# création d'un dictionnaire 
									for lien in begin2: #on parcours le liens un par un et on les utilise pour identifier les blocs contenants les bonnes dates
										#print(elt,hh)
										for cle, valeur in dic.items():
											if levenshteinN(cle,str(lien)) == 1.0: #parmis les blocs seulement ceux contenant un lien déjà validé 
											
												
												euterpe.write(sentence+'	'+fichier+'	'+titre+' $date:'+valeur+'	'+titrePrime+'\n')
							
							
					else:
						begin2 = dateUri.replace(" ", "")
						f=open(repertoire+"/"+fichier, 'r')
						lecture = f.read() #lecture fichier 1
						
						corps = re.compile(r"(\<http.*\>)\n\s+a\s+ecrm:.*\n\s+rdfs.*\n\s+time.*.*\n\s+time:inXSDDate\s+\"(\d{4}-\d{2}-\d{2}).*\"") #on récupère tous les blocs contenant comme clé un lien, et une date comme valeur)
						res = corps.findall(lecture) #on repère grace à re.findall() tous les blocs d'un seul coup
						if res:
							for line in res:
								blocDate = str(line) #on transforme en chaine de caractère
								
								#r la liste des iDs dates
								r=list()
								#h la liste des dates
								h=list()
								reElt=re.search(r'.*(\<http.*\>).*(\d{4}-\d{2}-\d{2}).*',blocDate) #ma REGEX pour identifier les bloc contenant les dates valides
								if reElt:
									hh=reElt.group(1)# le lien
									mm=reElt.group(2)# la date
									r.append(hh)#remplissage des listes
									h.append(mm)
									dic = dict(zip(r, h))# création d'un dictionnaire 
									for cle, valeur in dic.items():
										if levenshteinN(cle,str(begin2)) == 1.0: #parmis les blocs seulement ceux contenant un lien déjà validé 
											euterpe.write(sentence+'	'+fichier+'	'+titre+' $date:'+valeur+'	'+titrePrime+'\n')

					#on utilise aussi le lien après la dernière virgule == deuxième partie
					begin2 = dateUri2.replace(" ", "")
					f=open(repertoire+"/"+fichier, 'r')
					lecture = f.read() #lecture fichier 1
					
					corps = re.compile(r"(\<http.*\>)\n\s+a\s+ecrm:.*\n\s+rdfs.*\n\s+time.*.*\n\s+time:inXSDDate\s+\"(\d{4}-\d{2}-\d{2}).*\"") #on récupère tous les blocs contenant comme clé un lien, et une date comme valeur)
					res = corps.findall(lecture) #on repère grace à re.findall() tous les blocs d'un seul coup
					if res:
						for line in res:
							blocDate = str(line) #on transforme en chaine de caractère
							
							#r la liste des iDs dates
							r=list()
							#h la liste des dates
							h=list()
							reElt=re.search(r'.*(\<http.*\>).*(\d{4}-\d{2}-\d{2}).*',blocDate) #ma REGEX pour identifier les bloc contenant les dates valides
							if reElt:
								hh=reElt.group(1)# le lien
								mm=reElt.group(2)# la date
								r.append(hh)#remplissage des listes
								h.append(mm)
								dic = dict(zip(r, h))# création d'un dictionnaire 
								for cle, valeur in dic.items():
									if levenshteinN(cle,str(begin2)) == 1.0: #parmis les blocs seulement ceux contenant un lien déjà validé 
										euterpe.write(sentence+'	'+fichier+'	'+titre+' $date:'+valeur+'	'+titrePrime+'\n')


				else:
					reDateUri2=re.search(r'\s+mus:U8_foresees_time_span\s+(.*)\s+;',block1)
					if reDateUri2:
						dateUri=reDateUri2.group(1)
						begin2 = dateUri.replace(" ", "")
						f=open(repertoire+"/"+fichier, 'r')
						lecture = f.read() #lecture fichier 1
						
						corps = re.compile(r"(\<http.*\>)\n\s+a\s+ecrm:.*\n\s+rdfs.*\n\s+time.*.*\n\s+time:inXSDDate\s+\"(\d{4}-\d{2}-\d{2}).*\"") #on récupère tous les blocs contenant comme clé un lien, et une date comme valeur)
						res = corps.findall(lecture) #on repère grace à re.findall() tous les blocs d'un seul coup
						if res:
							for line in res:
								blocDate = str(line) #on transforme en chaine de caractère
								
								#r la liste des iDs dates
								r=list()
								#h la liste des dates
								h=list()
								reElt=re.search(r'.*(\<http.*\>).*(\d{4}-\d{2}-\d{2}).*',blocDate) #ma REGEX pour identifier les bloc contenant les dates valides
								if reElt:
									hh=reElt.group(1)# le lien
									mm=reElt.group(2)# la date
									r.append(hh)#remplissage des listes
									h.append(mm)
									dic = dict(zip(r, h))# création d'un dictionnaire 
									for cle, valeur in dic.items():
										if levenshteinN(cle,str(begin2)) == 1.0: #parmis les blocs seulement ceux contenant un lien déjà validé 
											euterpe.write(sentence+'	'+fichier+'	'+titre+' $date:'+valeur+'	'+titrePrime+'\n')

#création fichier contenant les résultats EUTERPE
euterpe = open('euterpe.txt','x+')
parcours(repertoire)
euterpe.close()


#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#Récupérer les titres + dates de chaque évenement depuis PP : ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

repertoire="/home/nassim-bnb/Bureau/TER/Tache 3/pp"

def parcours(repertoire) :
	print("PP > ", repertoire)
	liste = os.listdir(repertoire)
	for fichier in liste :
		if os.path.isdir(repertoire+"/"+fichier) :
			parcours(repertoire+"/"+fichier)
			#print(repertoire+"/"+fichier)
		else :
			#REGEX qui vérifie l'extension des fichiers (*.ttl)
			resultat = re.search(".\.ttl", fichier)   # Il y a au moins un caractère avant l’extension
			if resultat:
				#On parcours fichier par fichier
				f=open(repertoire+"/"+fichier,'r')
				#On définit le block1 qui contient le titre et l'iD de l'événement
				begin = 'F31'
				end = '> .'
				block = ''.join(get_block_lines(f, begin, end))
				
				#Récupérer le titre
				reTitre=re.search(r'\s+ecrm:P102_has_title\s+"(.*)"',block)
				if reTitre:
					titre=reTitre.group(1) #titre mémorisé
					titre=str(titre)
					titrePrime = titre
					#Transformer les majuscules en minuscules
					titre=titre.lower()

					#Supprimer les accents
					for i in range(len(accent)):
						titre = titre.replace(accent[i], sans_accent[i])	
						
					titre = titre.split()
				
					filteredtext = [t for t in titre if t.lower() not in stopwords]

					s = "";
					# on recole la phrase
					titre = s.join( filteredtext )

					#Supprimer les stop-words manuellement et sans appel à ntlk
					titre=re.sub(stopWordFr,'',titre)
				#On referme le fichier f pour pouvoir le relire à nouveau pour extraire les informations de date, car si on ne fait pas ça, le programme récupérera que les dates situées après le titre, sachant que parfois les dates se trouvent bien avant...
				f.close()

				#Récupérer l'URI de l'évènement
				#On relis le fichier à nouveau
				f=open(repertoire+"/"+fichier, 'r')
				data=f.read()
				#print(data)
				reURI=re.findall(r"(\<.*\>)\n\s+a\s+.*F31",data)
				if reURI:
					for line in reURI:
						sentence=str(line)

				#Récupérer la date
				#On relis le fichier à nouveau
				reDateUri2=re.search(r'\s+ecrm:P4_has_time-span\s+(.*)\s+;',block)
				if reDateUri2:
					dateUri=reDateUri2.group(1)
					begin2 = dateUri.replace(" ", "")
					f=open(repertoire+"/"+fichier, 'r')
					lecture = f.read() #lecture fichier 1
					
					corps = re.compile(r"(\<http.*\>)\n\s+a\s+time:Interval.*\n\s+rdfs.*\n\s+time.*\n\s+time:inXSDDate\s+\"(\d{4}-\d{2}-\d{2}).*\"") #on récupère tous les blocs contenant comme clé un lien, et une date comme valeur)
					res = corps.findall(lecture) #on repère grace à re.findall() tous les blocs d'un seul coup
					if res:
						for line in res:
							blocDate = str(line) #on transforme en chaine de caractère
							
							
							#r la liste des iDs dates
							r=list()
							#h la liste des dates
							h=list()
							reLien=re.search(r'.*(\<http.*\>).*(\d{4}-\d{2}-\d{2}).*',blocDate) #ma REGEX pour identifier les bloc contenant les dates valides
							if reLien:
								hh=reLien.group(1)# le lien
								mm=reLien.group(2)# la date
								
								
								r.append(hh)#remplissage des listes
								h.append(mm)
						
								dic = dict(zip(r, h))# création d'un dictionnaire 
								for cle, valeur in dic.items():
									if levenshteinN(cle,str(begin2)) == 1.0: #parmis les blocs seulement ceux contenant un lien déjà validé 
										pp.write(sentence+'	'+fichier+'	'+titre+' $date:'+valeur+'	'+titrePrime+'\n')
								
							

				f.close()


#création fichier contenant les résultats PP
pp = open('pp.txt','x+')
parcours(repertoire)
pp.close()


#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#Aligner les titres, ensuite les dates depuis EUTERPE vers PP : /////////////////////////////////////////////////////////////////////////////////////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

EMTD=open('EMTD.txt','x+') #Evenements avec Même Titres et Dates
EMD=open('EMD.txt','x+') #Evenements avec Même Dates avec un acteur en commun
EMTrD=open('EMTrD.txt','x+') #Evenements avec Même Dates avec des titres très similaires
EMT=open('EMT.txt','x+') #Evenements avec seulement même titres /////////// `A quoi servira celui la? O.o

yesPP=open('yesPP.txt','x+') #Evenements F31 non reliés
#/////////////// on collecte les termes à mesurer //////////////////////////

mots1 = open('euterpe.txt','r')
read_mots1= mots1.readlines()

mots2 = open('pp.txt','r')
read_mots2= mots2.readlines()



s=list()
#on récupère les informations EUTERPE à aligner
for ligne in read_mots1:	
	#on identifie les titres et dates
	
	res_mots1 = re.search(r'(.*)\t(.*)\t(.*)\$date:(.*)\t(.*)',ligne)
	if res_mots1:
		URIfichierEuterpe = res_mots1.group(1)
		nFchierEuterpe = res_mots1.group(2)
		titre1 = res_mots1.group(3)
		date1 = res_mots1.group(4)
		titrePrime1= res_mots1.group(5)
		#print(nFchierEuterpe,titre1,date1)

		
		for ligne in read_mots2:	
			#on identifie les titres et dates
			res_mots2 = re.search(r'(.*)\t(.*)\t(.*)\$date:(.*)\t(.*)',ligne)
			if res_mots2:
				URIfichierPP = res_mots2.group(1)
				nFchierPP = res_mots2.group(2)
				titre2 = res_mots2.group(3)
				date2 = res_mots2.group(4)
				titrePrime2= res_mots2.group(5)
				#print(URIfichierEuterpe+'	'+URIfichierPP)
				#print(titrePrime2)
				
				#print(titre2,date2)
				#On définie les seuils minimums Jaro et Levenstein
				#Seuil 1 : same people (même peuple)

				if levenshteinN(date1,date2) ==1.0 and jaro(date1,date2) == 1.0:#dates exactes
					if levenshteinN(titre1,titre2) == 1.0 and jaro(titre1,titre2) == 1.0:  #titres exactes
						score1=str((levenshteinN(titre1,titre2)+(jaro(titre1,titre2)))/2) #moyenne des mesures
						#ecriture des alignements répondants aux conditions
						EMTD.write(URIfichierEuterpe+'\t'+nFchierEuterpe+'\t'+titrePrime1+'\t'+date1+'\t'+'Similarité :'+score1+'\n'+URIfichierPP+'\t'+nFchierPP+'\t'+titrePrime2+'\t'+date2+'\n\n')
						print(nFchierEuterpe)
						if titre1 not in s:
							s.append(nFchierPP)
							yesPP.write(nFchierPP)
					elif levenshteinN(titre1,titre2) >= 0.5 and jaro(titre1,titre2) > 0.7: #titres légèrement différents
						score2=str((levenshteinN(titre1,titre2)+(jaro(titre1,titre2)))/2) #moyenne des mesures
						EMTrD.write(URIfichierEuterpe+'\t'+nFchierEuterpe+'\t'+titrePrime1+'\t'+date1+'\t'+'Similarité :'+score2+'\n'+URIfichierPP+'\t'+nFchierPP+'\t'+titrePrime2+'\t'+date2+'\n\n')
						print(nFchierEuterpe)
						if titre1 not in s:
							s.append(nFchierPP)
							yesPP.write(nFchierPP)
					elif levenshteinN(titre1,titre2) >= 0.25 and jaro(titre1,titre2) > 0.5: #titres avec dénominateur commun 

						score3=str((levenshteinN(titre1,titre2)+(jaro(titre1,titre2)))/2) #moyenne des mesures
						EMD.write(URIfichierEuterpe+'\t'+nFchierEuterpe+'\t'+titrePrime1+'\t'+date1+'\t'+'Similarité :'+score3+'\n'+URIfichierPP+'\t'+nFchierPP+'\t'+titrePrime2+'\t'+date2+'\n\n')
						print(nFchierEuterpe)
						if titre1 not in s:
							s.append(nFchierPP)
							yesPP.write(nFchierPP)
				elif levenshteinN(titre1,titre2) == 1.0 and jaro(titre1,titre2) == 1.0:  #titres exactes
						score4=str((levenshteinN(titre1,titre2)+(jaro(titre1,titre2)))/2) #moyenne des mesures
						#ecriture des alignements répondants aux conditions
						EMT.write(URIfichierEuterpe+'\t'+nFchierEuterpe+'\t'+titrePrime1+'\t'+date1+'\t'+'Similarité :'+score4+'\n'+URIfichierPP+'\t'+nFchierPP+'\t'+titrePrime2+'\t'+date2+'\n\n')
						print(nFchierEuterpe)
	
