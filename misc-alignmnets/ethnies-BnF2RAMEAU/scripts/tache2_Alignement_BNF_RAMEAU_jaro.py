#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import division

import re, sys, os, math

#//////////////////// Création fichiers de retour ////////////////////////////
ethnieMatch = open('ethnieMatch.txt','x+') #Pour les BNF alignés grace à leur éthnie
ethnieRegionMatch = open('ethnieRegionMatch.txt','x+') #Pour les BNF alignés grace à l'ethnie et à la position géographique
regionMatch = open('regionMatch.txt','x+') #Pour les BNF alignés grace à leur position géographique seulement 
ethnieMatchErrors = open('ethnieMatchErrors.txt','x+') #Pour les BNF alignés avec ambiguité
bnfNotMatch = open('bnfNotMatch.txt','x+') #Pour les BNF non alignés

#//////////////////// Conversion vers UTF 8 //////////////////////////////////
#//////////////////// lancer ces commandes dans le terminal///////////////////

#iconv -f macintosh -t utf-8 RAMEAU-Groupes_ethniques-2.txt > RAMEAU_utf-8.txt
#iconv -f macintosh -t utf-8 BNF_traditions_field.txt > BNF_utf-8.txt ////// `A ne pas utiliser car le format initial du fichier est en UTF-8

#Lemmatisation
regexpStemmer = ('s$|iens$|oise$|istes$|ains$|ie$|ais$|aise$|ois$|')

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

def score(mot1,mot2):
	score=(levenshteinN(mot1,mot2)+(jaro(mot1,mot2)))/2 #moyenne des mesures
	return (round(score,3))
#/////////////////////////////////////////////////////////////////////////////////
#///////////////////////////////    TRAITEMENT    ////////////////////////////////
#/////////////////////////////////////////////////////////////////////////////////

#///////// Récupération lignes BNF grace à l'iD dans un dictionnaire BNF//////////

#On commence par créer nos listes d'iD et texte BNF
listeId = list()
listeTexte = list()

file1 =open('BNF_traditions_field.txt','r')

read1= file1.readlines()
for ligne in read1:
	
	#On remplie la liste des iD
	ligneIdBNF = re.search(r"([0-9]{8}.*).*",ligne)
	if ligneIdBNF:
		idBNF= ligneIdBNF.group(1)
		listeId.append(idBNF)#rajouter cet iD à la liste des iDs
	#On remplie la liste des Contenus reliés à chaque iD
	ligneTxtBNF = re.search(r"\d{3}\s+(\$a[A-Z][a-z]+.*)",ligne)
	if ligneTxtBNF:
		txtBNF= ligneTxtBNF.group(1)
		listeTexte.append(txtBNF)#rajouter ce cotenu à la liste des textes
		
#On fusionne et on crée un dictionnaire qui enregistre les iDs comme des clés et le texte comme valeur
BNF = dict(zip(listeId, listeTexte))


#///////// Récupération lignes RAMEAU grace à l'iD dans un dictionnaire RAMEAU//////////

#On commence par créer nos listes d'iD et texte RAMEAU
listeId = list()
listeTexte = list()

file2 =open('RAMEAU_utf-8.txt','r')
read2= file2.readlines()
for ligne in read2:
	
	#On remplie la liste des iD
	ligneIdRM = re.search(r"([0-9]{8})\s+(.*)",ligne)
	if ligneIdRM:
		idRM= ligneIdRM.group(1)
		listeId.append(idRM)#rajouter cet iD à la liste des iDs
		txtRM= ligneIdRM.group(2)
		listeTexte.append(txtRM)#rajouter ce cotenu à la liste des textes
		
#On fusionne et on crée un dictionnaire qui enregistre les iDs comme des clés et le texte comme valeur
RAMEAU = dict(zip(listeId, listeTexte))



#/////////////// on collecte les termes à mesurer ////////////////////////////////

mots1 = open('newBNF_utf-8.txt','r')
read_mots1= mots1.readlines()

mots2 = open('newRAMEAU_utf-8.txt','r')
read_mots2= mots2.readlines()



#on récupère les informations BNF à aligner
for ligne in read_mots1:

	
	#on identifie chaque terme avec son identifiant BNF
	res_mots1 = re.search(r"([0-9].*)~(.*)",ligne)
	if res_mots1:
		#S la liste des iDs RAMEAU alignés
		s=list()
		#M la liste des iDs BNF alignés
		m=list()
		iD1 = res_mots1.group(1)
		mot1 = res_mots1.group(2)

		#On va traiter dans un premier lieu les $e présents avec une information geographique ($mMadagascar$eMalgaches)
		resT = re.search(r"(.*)\\(.*)",mot1)
		
		#//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		#//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		#Dans un premier lieu les $e qui dispose d'une information geographique ($mYemen$eJuifs) 
		if resT :
			#on identifie les ethnies et leur régions respectives
			region = resT.group(1)#information region BNF
			ethnie = resT.group(2)#information ethnie BNF
			

			#on récupère les informations RAMEAU à aligner
			for line in read_mots2:
				#on identifie chaque terme avec son identifiant BNF
				res_mots2 = re.search(r"([0-9].*)~(.*)",line)
				if res_mots2:

					iD2 = res_mots2.group(1)
					mot2 = res_mots2.group(2)

					#On définieles seuils minimums Jaro et Levenstein
					#Seuil 1 : same people (même peuple)


					#On va traiter dans un premier lieu les $a présents sans information geographique ($aTziganes)
					resT2 = re.search(r"(.*)\\(.*)",mot2)
					if not resT2:
						
						#Lemmatization
						ethnie=re.sub(regexpStemmer,'',ethnie)
						mot2=re.sub(regexpStemmer,'',mot2)

						if levenshteinN(ethnie,mot2) >= 0.8 and jaro(ethnie, mot2) >= 0.84 :  #<<<<<<< ici vous mettez le seuil de similarité Jaro min
								
							for cle,valeur in BNF.items():
								if cle==iD1:
									ethnieMatch.write(cle+'	'+valeur+'\t'+'Score:'+str(score(ethnie,mot2))+'\n')#ecriture ligne BNF
									#print(cle+'	'+valeur+'\n')
							for cle,valeur in RAMEAU.items():
								if cle==iD2:
									ethnieMatch.write(cle+'	'+valeur+'\n\n')#ecriture ligne Rameau
									#print(cle+'	'+valeur+'\n')
							
							print("A1")
							m.append(iD1)
						
					

					#//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					#//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					else: #On dispose ici d'information d'ethnie et de géographie des deux cotés ($mNouvelle-Zélande$eMaoris == $aMaoris$gpeuple de Nouvelle-Zélande)

						ethnieRM = resT2.group(1)#information ethnie rameau
						regionRM = resT2.group(2)#information région rameau

						#On définie les seuils minimums Jaro et Levenstein
						#Seuil 1 : same people (même peuple) same region (même région)

						#Lemmatization
						region=re.sub(regexpStemmer,'',region)
						ethnieRM=re.sub(regexpStemmer,'',ethnieRM)
						regionRM=re.sub(regexpStemmer,'',regionRM)

						#Cas de similarité entre ethnies mais sans appuis de l'information région //////////////////////////////////////////////
						
						

						if levenshteinN(region,regionRM) > 0.6 and jaro(region, regionRM) > 0.6 : #on vérifie la région /////////////////////////	
							if levenshteinN(ethnie,ethnieRM) >= 0.7 and jaro(ethnie, ethnieRM) >= 0.7 : #on vérifie l'ethnie			
								for cle,valeur in BNF.items():
									if cle==iD1:
										ethnieRegionMatch.write(cle+'	'+valeur+'\t'+'Score:'+str(score(ethnie,ethnieRM))+'\n')#ecriture ligne BNF
										#print(cle+'	'+valeur+'\n')
								for cle,valeur in RAMEAU.items():
									if cle==iD2:
										ethnieRegionMatch.write(cle+'	'+valeur+'\n\n')#ecriture ligne Rameau
										#print(cle+'	'+valeur+'\n')
								
								print("B")
								m.append(iD1)

						elif levenshteinN(ethnie,ethnieRM) >= 0.9 and jaro(ethnie, ethnieRM) >= 0.9 : #on vérifie l'ethnie
							for cle,valeur in BNF.items():
								if cle==iD1:
									ethnieMatchErrors.write(cle+'	'+valeur+'\t'+'Score:'+str(score(ethnie,ethnieRM))+'\n')#ecriture ligne BNF
									#print(cle+'	'+valeur)
							for cle,valeur in RAMEAU.items():
								if cle==iD2:
									ethnieMatchErrors.write(cle+'	'+valeur+'\n\n')#ecriture ligne Rameau
									#print(cle+'	'+valeur+'\n')
							print("A2")
							m.append(iD1)


						#On va detecter les similitudes region,ethniRM et ethni,regionRM
						#38562811	143   $aTraditions$mAfrique du Nord$mAlgérie$mKabylie$eBerbères
						#11940990	$aKabyles$gpeuple berbère
						
						elif levenshteinN(region,ethnieRM) >= 0.6 and jaro(region,ethnieRM) >= 0.6:
							if levenshteinN(ethnie,regionRM) >= 0.6 and jaro(ethnie,regionRM) >= 0.6:
								for cle,valeur in BNF.items():
									if cle==iD1:
										ethnieRegionMatch.write(cle+'	'+valeur+'\t'+'Score:'+str(score(region,ethnieRM))+'\n')#ecriture ligne BNF
										#print(cle+'	'+valeur+'\n')
								for cle,valeur in RAMEAU.items():
									if cle==iD2:
										ethnieRegionMatch.write(cle+'	'+valeur+'\n\n')#ecriture ligne Rameau
										#print(cle+'	'+valeur+'\n')
								
								print("B2")
								m.append(iD1)


		#//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		#//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		else: #Dans un second lieu les $e qui ne disposent pas d'une information geographique ($eJuifs)
			
			#Tokenization BNF
			mot1S = mot1.split()
			
			for line in read_mots2:
				res_mots2 = re.search(r"([0-9].*)~(.*)",line)
				if res_mots2:
					iD2 = res_mots2.group(1)
					mot2 = res_mots2.group(2)

					#//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					#//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					#On va traiter SEULEMENT les $a présents sans information geographique ($aTziganes)
					resT2 = re.search(r"(.*)\\(.*)",mot2)
					if not resT2:
						#Tokenization RAMEAU
						mot2S = mot2.split()
						

						mot1=re.sub(regexpStemmer,'',mot1)
						mot2=re.sub(regexpStemmer,'',mot2)
						#On définie les seuils minimums Jaro et Levenstein
						#Seuil 1 : same people (même peuple)
						if levenshteinN(mot1,mot2) >= 0.8 and jaro(mot1, mot2) >= 0.84 : 
							
							for cle,valeur in BNF.items():
								if cle==iD1:
									ethnieMatch.write(cle+'	'+valeur+'\t'+'Score:'+str(score(mot1,mot2))+'\n')#ecriture ligne BNF
									#print(cle+'	'+valeur+'\n')
							for cle,valeur in RAMEAU.items():
								if cle==iD2:
									ethnieMatch.write(cle+'	'+valeur+'\n\n')#ecriture ligne Rameau
									#print(cle+'	'+valeur+'\n')
							
							print("A3")
							m.append(iD1)





		# Si mot1 et mot2 sont composés de plusieurs mots, on mesure jaro et lev entre chaque mot des deux cotés
		if iD1 not in m:
			for cle,valeur in BNF.items():
				if cle==iD1:
					bnfNotMatch.write(cle+'	'+valeur+'\n')#ecriture ligne BNF

	
ethnieMatchErrors.close()
bnfNotMatch.close()
file1.close()
file2.close()
ethnieMatch.close()
ethnieRegionMatch.close()
"""
os.remove('newBNF_utf-8.txt')
os.remove('newRAMEAU_utf-8.txt')
"""

