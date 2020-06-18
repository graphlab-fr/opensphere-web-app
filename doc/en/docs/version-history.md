---
title: History of the versions of the Otletosphere
author:
  - Guillaume Brioudes <https://myllaume.fr/>
  - Olivier Le Deuff
date: 08/06/2020
---

## History and logic of the project.

The Otletosphere is a web visualization project that is part of the HyperOtlet research project. The Otletosphere has so far had 2 public versions.
The development of the otletosphere is part of the HyperOtlet project, funded by the ANR [ANR-17-CE38-0011]. https://anr.fr/Projet-ANR-17-CE38-0011
The project's research notebook is available here https://hyperotlet.hypotheses.org/.

The objective is to propose a visualization of the network of people around Paul Otlet.
The Otletosphere is a relational cartography of the personalities and institutions linked to Paul Otlet.
The study of Paul Otlet's network of people allows us to imagine a work of collecting the personal relationships he was able to establish during his years of correspondence.
Based on his correspondence archived at the [Mundaneum of Mons which is the museum dedicated to his work](http://archives.mundaneum.org/), we were able to create a database that includes the different people with whom he came into contact.
The cartographic representation of a network of people required reflection and graphic influences to achieve an interesting and graphically user-friendly scientific representation.  

This project is based on the observation of Paul Otlet's strong involvement in international peace organizations as well as in bibliographical and documentary institutions.
This project is based on the observation of Paul Otlet's strong involvement in international peace organizations as well as in bibliographical and documentary institutions.

The initial inspiration comes from the graphic representation of the Marvel transmedia universe produced by the team of the Singaporean newspaper "[The Straits Time](https://graphics.straitstimes.com/STI/STIMEDIA/Interactives/2018/04/marvel-cinematic-universe-whos-who-interactive/index.html)", which presents itself as a veritable constellation of superheroes, linked together by their relationships within the narrative universes.

## First version

The development started in January 2019 and lays the foundations for the project:

- Theoretical concepts: relations to Otlet and other metadata
- Interface: two sections *View* and *Database*, description pane, spatial and linguistic navigation tools
- Graphic charter
- Page *About*

The basic idea came from Olivier Le Deuff, a lecturer in information and communication sciences at Bordeaux Montaigne University, who wanted to create an interactive visualization around Otlet. Jean David, student in master 2 DNDH is then in charge of the realization of the first prototype. Arthur Perret and Clément Borel bring their skills on data, graphics, design, typography, etc... 

## Second version

The development starts in April 2020 and consists in redesigning a theoretically accomplished work with a complete interface. Apart from the addition of navigation tools, it is a project of perpetuation, harmonization and design.

We note the following major modifications:

### Navigation

- addition of a search tool
- merge the *View* and *Database* sections to give *Network* and *Cards*.
- description pane: display connections between nodes and [junction](./process/technical-choices.md#union-of-views) between *Network* and *Sheets* with the *View* button
- browsing history

### Sustainability

- Data: structure the data entry in a single *GSheet* and make the injection sustainable.
- Programming: update dependencies and refactor the code
- Facilitate (re)use: documentation and opening of source code with API

## Bibliography

Olivier Le Deuff, Jean David, Arthur Perret, Clément Borel. Surfer dans l'Otletosphère Des outils pour visualiser et interroger le réseau de Paul Otlet. H2PTM’19. De l’hypertexte aux humanités numériques, Roxin Ioan, Oct 2019, Montbelliard, France. p.65-76. disponible [ici](https://archivesic.ccsd.cnrs.fr/sic_02480515).

