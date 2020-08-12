---
title: Otletosphere source code architecture
author: Guillaume Brioudes <https://myllaume.fr/>
date: 09/06/2020
---

The following diagrams show the organization of the source code. They allow a better understanding of the software and thus to be able to make [modifications](../modify-source-code/dev-tools.md) more easily.

## File tree structure

The following diagram shows the distribution of files in the source code directory as it is possible to [upload to the GitHub repository](./installation.md).

!!! bug "Notice to developers"
	Be careful not to misplace any files or directories, otherwise some [software dependencies](./libraries.md) in the project may malfunction and you may lose functionality.

```mermaid
graph LR
	index.html
	package.json
	gulpfile.js
	/libs
	/dist --> sass
	/dist --> scripts
	/assets --> font
	/assets --> photos
	/assets --> favicon
	/assets --> icons
	/assets --> main.css
	/assets --> main.js
	/data --> entite.json
	/data --> lien.json
```

## Architecture of the *Network* functions

```mermaid
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
```