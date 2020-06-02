---
title: Historique des versions de l'Otletosphère
author: Guillaume Brioudes <https://myllaume.fr/>
date: 28/05/2020
---
## Histoire et logique du projet.
L'Otletosphère est un projet de visualisation web qui s'intègre dans le projet de recherche HyperOtlet. L'Otletosphère a jusqu'ici connu 2 versions publiques.
Le développement  de l'otlétosphère s'inscrit dans le cadre du projet HyperOtlet, financé par l'ANR [ANR-17-CE38-0011]. https://anr.fr/Projet-ANR-17-CE38-0011
Le carnet de recherche du projet est disponible ici https://hyperotlet.hypotheses.org/

L'objectif est de proposer une visualisation du réseau de personnes autour de Paul Otlet.
L’Otletosphère  est  une  cartographie  relationnelle  des  personnalités  et institutions liées à Paul Otlet
L’étude  du  réseau  de  personnes  de  Paul  Otlet, permet  d’imaginer  un  travail  de  collecte  des relations personnelles qu’il a pu établir durant ses années de correspondance.
 Basée sur sa correspondance archivée au [Mundaneum de Mons qui est le musée consacré à son œuvre](http://archives.mundaneum.org/), nous avons pu réaliser une base de  données  qui  reprend  les  différentes  personnes  avec  qui  il  est  entré  en relation.
 La   représentation  cartographique  d'un  réseau   de  personnes a nécessité  une réflexion   et   des   influences   graphiques   pour   réaliser   une   représentation scientifique  intéressante et  graphiquement  conviviale.  

 Ce projet part du constat de l'implication forte de Paul  Otlet,  au  sein  desorganisations  internationales  pour  la  paix  ainsi  qu'au sein   des   institutions   bibliographiques   et   documentaires.
  Les   différentes activités  d'Otlet  lui  ont  permis  de  côtoyer  un  large  nombre  de  personnes dans des univers différents que nous avons tenté de représenter par des logiques de catégories.

L’inspiration initiale provient de la représentation graphique de l’univers  transmedia  Marvel  produite  par  l’équipe  du  journal singapourien "T[he  Straits  Time](https://graphics.straitstimes.com/STI/STIMEDIA/Interactives/2018/04/marvel-cinematic-universe-whos-who-interactive/index.html)",  qui  se  présente  comme  une  véritable  constellation  de superhéros, liés entre eux par leurs relations au sein des univers narratifs
https://graphics.straitstimes.com/STI/STIMEDIA/Interactives/2018/04/marvel-cinematic-universe-whos-who-interactive/index.html
## Bibliographie :

Olivier Le Deuff, Jean David, Arthur Perret, Clément Borel. Surfer dans l'Otletosphère Des outils pour visualiser et interroger le réseau de Paul Otlet. H2PTM’19. De l’hypertexte aux humanités numériques, Roxin Ioan, Oct 2019, Montbelliard, France. p.65-76. disponible [ici](https://archivesic.ccsd.cnrs.fr/sic_02480515).


## Première version

Le développement à débuté en janvier 2019 et pose l'ensemble des bases du projet :

- Concepts théoriques : relations à Otlet et autres métadonnées
- Interface : deux sections *Visualisation* et *Base de données*, volet de description, outils de navigation spatial et linguistiques
- Charte graphique
- Page *À propos*

L'idée de base est issue d'une volonté d'Olivier Le Deuff, maître de conférences en sciences de l'information et de la communication à l'université Bordeaux Montaigne, d'obtenir une visualisation interactive autour d'Otlet. Jean David, étudiant en master 2 DNDH est alors chargé de la réalisation du premier prototype. Arthur Perret et Clément Borel viennent apporter leurs compétences sur les aspects données, graphismes, design, typographie, etc. 

## Deuxième version

Le développement débute en avril 2020 et consiste à réaménager un travail théoriquement abouti et avec une interface complète. Hormis l'ajout d'outils de navigation, c'est un chantier de pérennisation, d'harmonisation et de design.

On note les modifications majeures suivantes :

### Navigation

- ajout d'un outil de recherche
- fusion des sections *Visualisation* et *Base de données* pour donner *Réseau* et *Fiches*
- volet de description : affichage des connexions entre les nœuds et point de jonction entre *Réseau* et *Fiches* avec le bouton *Visualiser*
- historique de navigation

### Pérennisation

- Données : structurer la saisie dans un *GSheet* unique et pérenniser l'injection
- Programmation : mettre à jour les dépendances et refactoriser le code
- Faciliter la (ré)utilisation : documentation et ouverture du code source avec API
