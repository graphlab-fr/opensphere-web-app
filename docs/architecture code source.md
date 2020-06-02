---
title: Architecture du code source de l'Otletosphère
author: Guillaume Brioudes <https://myllaume.fr/>
date: 29/05/2020
---

Les diagrammes suivants présentent l'organisation du code source. Ils permettent de mieux appréhender le logiciel et ainsi de pouvoir y apporter des [modifications](/installation/#configuration) plus facilement.

## Arborescence de fichier

Le schéma suivant présente la répartition des fichiers dans le répertoire de code source tel qu'il est possible de [télécharger sur le dépôt GitHub](/installation).

!!! bug "Avis aux développeurs"
	Veillez à ne pas égarer de fichier ou répertoire sans quoi certaines [dépendances logicielle](/bibliotheques) du projet pourrait disfonctionner et vous pourriez perdre des fonctionnalités.

<div class="mermaid">
flowchart LR
	index.html
	package.json
	gulpfile.js
	/libs
	/dist --> sass
	/dist --> scripts
	/assets --> font
	/assets --> icons
	/assets --> main.css
	/assets --> main.js
	/data --> entite.json
	/data --> metas.json
	/data --> lien.json
	/data --> /images
</div>

## Architecture des fonctions du *Réseau*

<div class="mermaid">
flowchart TB
    subgraph class network
        obj_options --> obj_visualisation
        obj_data
        obj_zoom
        int_selectedNode
    end

    evt_selectNode--> fx_switchNode
    fx_getNodeMetas--> fx_switchNode
    fx_switchNode --> fx_zoomToNode
    fx_switchNode --> fx_fill
    fx_switchNode --> fx_open
    fx_switchNode --> int_selectedNode

    fx_chooseColor --> obj_options

    obj_data --> |get.filter| fx_getNodeMetas

    obj_visualisation --> |getPosition| fx_zoomToNode
    obj_visualisation --> |moveTo| fx_zoomToNode
    obj_visualisation --> evt_selectNode
    obj_visualisation --> evt_blurNode
    obj_visualisation --> evt_hoverNode
    evt_hoverNode --> obj_data
    evt_blurNode --> obj_data
    obj_zoom --> evt_zoom
    evt_zoom <--> obj_visualisation

    fx_createNodeObject --> obj_data
    fx_createEdgeObject --> obj_data

    fx_findConnectedNodes --> fx_fill
    obj_data --> fx_findConnectedNodes
    fx_getNodeMetas--> fx_findConnectedNodes

    subgraph class fiche
        fx_fill
        fx_open
    end

    evt_selectNode --> fx_actualiser

    subgraph class historique
        fx_actualiser --> fx_init
    end

    subgraph class commands
        elt_btnPlus
        elt_btnMoins
        elt_btnReinitialiser
    end

    elt_btnPlus --> evt_cliq
    elt_btnMoins --> evt_cliq
    elt_btnReinitialiser --> evt_cliq
    obj_zoom --> evt_cliq
    evt_cliq --> obj_visualisation

    obj_visualisation
</div>