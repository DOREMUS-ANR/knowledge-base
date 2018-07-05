#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import division
from nltk import stem
from nltk.stem import RegexpStemmer
import re, sys, os, math


#/////////////////// création de deux nouveaux fichiers en écrtiture
nFichierBNF = open('newBNF_utf-8.txt','x+')
nFichierRM = open('newRAMEAU_utf-8.txt','x+')


#liste des caractères accentués a désaccentuer 
accent = ['é', 'è', 'ê', 'ë', 'à','á','É', 'ù', 'û', 'ú', 'ü','ç','č', 'ô','ó','ö', 'î','í','Î', 'ï', 'â','ã','ā','ţ','(\'','\', \'','\', "','\')','")','$e','$g']
sans_accent = ['e', 'e', 'e', 'e', 'a','a','E', 'u', 'u', 'u','u', 'c', 'c','o','o','o', 'i','i', 'I', 'i','a', 'a', 'a','t','','~','~','','','\\','\\']

#liste stop words 
stopwords = open('french', 'r').read().split()
stopWordFr=re.compile('d\'|l\'|democratique|republique|peuples|peuple|!|origine|civilisation|\(|\)|_|,') 


#http://digitalhistoryhacks.blogspot.fr/2006/08/easy-pieces-in-python-removing-stop.html
#https://seahorse.deepsense.ai/operations/tokenize.html







#//////////////// on parcour le fichier BNF , on récupère dans toutes les lignes que la partie après le dernier $ 
#/////////////// on écrit ces lignes là dans le nouveau fichier > BNF
#//////////////////// on ouvre le fichier BNF , lecture ligne 

file1 =open('BNF_traditions_field.txt','r')
read1= file1.read()

#//////////////////// on récupère tous les $e solitaires

#/////////////////////////////////////////////////////////////////////////////////
#///////////////////////////////        $e        ////////////////////////////////
#/////////////////////////////////////////////////////////////////////////////////

res1b = re.findall(r"(.*)\n\d{3}\s+\$a[A-Z][a-z]+\$e(.*)",read1)
if res1b:
	for ligne in res1b:	
		sentence=str(ligne)
		
		#Transformer les majuscules en minuscules
		sentence=sentence.lower()

		#Supprimer les accents
		for i in range(len(accent)):
			sentence = sentence.replace(accent[i], sans_accent[i])
		
		sentence = sentence.split()
		
		filteredtext = [t for t in sentence if t.lower() not in stopwords]

		s = " ";
		# on recole la phrase
		sentence = s.join( filteredtext )

		#Supprimer les stop-words manuellement et sans appel à ntlk
		sentence=re.sub(stopWordFr,'',sentence)
	
		#Ecriture du nouveau fichier à alligner RAMEAU
		nFichierBNF.write(sentence+'\n')
		#print(sentence+'\n')

#/////////////////////////////////////////////////////////////////////////////////
#///////////////////////////////       $m$e       ////////////////////////////////
#/////////////////////////////////////////////////////////////////////////////////


#//////////////////// On récupère les $m.*$e (si $e ne suffit pas à determiner l'alignement alors on utilise $m pour nous 
#raprocher du résultat 

res1 = re.findall(r"(.*)\n\d{3}\s+\$a.*\$m(.*\$e.*)",read1)
if res1:
	for ligne in res1:	
		sentence=str(ligne)
		
		#Transformer les majuscules en minuscules
		sentence=sentence.lower()

		#Supprimer les accents
		for i in range(len(accent)):
			sentence = sentence.replace(accent[i], sans_accent[i])
		
		sentence = sentence.split()
		
		filteredtext = [t for t in sentence if t.lower() not in stopwords]

		s = " ";
		# on recole la phrase
		sentence = s.join( filteredtext )

		#Supprimer les stop-words manuellement et sans appel à ntlk
		sentence=re.sub(stopWordFr,'',sentence)
		
		
		#Ecriture du nouveau fichier à alligner RAMEAU
		nFichierBNF.write(sentence+'\n')
		#print(sentence+'\n')

	
#/////////////// Lignes simplifiées avec le contenu après le premier $a seulement > RAMEAU
#/////////////////// on ouvre le fichier RAMEAU , lecture ligne 

#/////////////////////////////////////////////////////////////////////////////////
#///////////////////////////////        $a        ////////////////////////////////
#/////////////////////////////////////////////////////////////////////////////////

file2 = open('RAMEAU_utf-8.txt','r')
read2 = file2.read()

res2 = re.findall(r"(\d{8})\s+\$a(.+)\n",read2)




if res2:
	for line in res2:
		sentence=str(line)
		
		#Transformer les majuscules en minuscules
		sentence=sentence.lower()

		#Supprimer les accents
		for i in range(len(accent)):
			sentence = sentence.replace(accent[i], sans_accent[i])
		
		sentence = sentence.split()
		
		#Tokenisation & stop-words suppression
		filteredtext = [t for t in sentence if t.lower() not in stopwords]

		s = " ";

		# on recole la phrase
		sentence = s.join( filteredtext )
		
		#Supprimer les stop-words spécifiques 
		sentence=re.sub(stopWordFr,'',sentence)

		
		#Ecriture du nouveau fichier à alligner RAMEAU
		nFichierRM.write(sentence+'\n')
		#print(sentence)


file1.close()
file2.close()

nFichierBNF.close()
nFichierRM.close()

