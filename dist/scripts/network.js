

/**
 * ================================================================================================
 * network.js =====================================================================================
 * ================================================================================================
 * Display & lauch events of the graph
 * Distribute the data extracted from fetch.js
 */


var network = {
    container: document.querySelector('#network'),
    data: {
        nodes: new vis.DataSet(),
        edges: new vis.DataSet()
    },
    options: {
        physics: {
            enabled: true,
            repulsion: {
                centralGravity: 0.0,
                springLength: 350,
                springConstant: 0.01,
                nodeDistance: 400,
                damping: 0.09
            },
            solver: 'repulsion'
        },
        edges: {
            width: 2,
            selectionWidth: 6,
            smooth: {
                type: 'horizontal',
                forceDirection: 'horizontal'
            }
        },
        nodes: {
            shape: 'image'
        },
        groups: { // massive styling, by group name
            collegue: {shape: 'circularImage', color: {border: chooseColor('collegue')}},
            collaborateur: {shape: 'circularImage', color: {border: chooseColor('collaborateur')}},
            famille: {shape: 'circularImage', color: {border: chooseColor('famille')}},
            opposant: {shape: 'circularImage', color: {border: chooseColor('opposant')}},
            otlet: {shape: 'circularImage', color: {border: chooseColor('otlet')}},
            'non-catégorisé': {shape: 'circularImage', color: {border: chooseColor('non-catégorisé')}},
            institution: {color: {border: chooseColor('institution')}},
            œuvre: {color: {border: chooseColor('œuvre')}},
            évènement: {color: {border: chooseColor('évènement')}}
        },
        interaction: {hover:true}
    },
    zoom: {
        max: 1,
        min: 0.2
    },
    selectedNode: undefined,
    /** diplay graph & activate events, board and search engine */
    init: function() {
        
        // Génération de la visualisation
        network.visualisation = new vis.Network(network.container,
            network.data, network.options);
        
        // Évents du network
        network.visualisation.on('selectNode', function(nodeMetasBrutes) {
            var idNode = nodeMetasBrutes.nodes[0];
        
            if (idNode === undefined) { return; }
            
            if (network.selectedNode !== undefined && network.selectedNode == idNode) {
                // si nœud est déjà selectionné
                return;
            }
        
            switchNode(idNode);
            historique.actualiser(idNode);
        });
        // nodes become transparents if one is hovered by mouse
        network.visualisation.on('hoverNode', function(params) {
            var idNodeHovered = params.node;
        
            // no effect on hovermouse node
            var noEffectNodesIds = [idNodeHovered];
            // and his connections
            noEffectNodesIds = noEffectNodesIds
                .concat(network.visualisation.getConnectedNodes(idNodeHovered));
        
            if (network.selectedNode !== undefined) {
                // no effect on the 'selectedNode'
                noEffectNodesIds.push(network.selectedNode)
                // and his connections
                noEffectNodesIds = noEffectNodesIds
                    .concat(network.visualisation.getConnectedNodes(network.selectedNode));
            }

            network.data.nodes.update(
                network.data.nodes.map(entite => ({
                    id: entite.id,
                    color: chooseColor(entite.group, true),
                    opacity: 0.4,
                    font: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        strokeColor: 'rgba(0, 0, 0, 0.5)'
                    }
                } ), {
                    filter: function(entite) {
                        return(noEffectNodesIds.includes(entite.id) == false);
                    }
                })
            );
            
        });
        // revert the nodes transparency
        network.visualisation.on('blurNode', function() {

            network.data.nodes.update(
                network.data.nodes.map(entite => ({
                        id: entite.id,
                        color: false,
                        opacity: 1,
                        font: {
                            color: '#fff',
                            strokeColor: '#000'
                        }
                } ))
            );
        });
        
        network.visualisation.on('zoom', function(params) {
        
            // restrict un-zoom
            if (params.scale <= network.zoom.min) {
                network.visualisation.moveTo({
                    position: { x: 0, y: 0 },
                    scale: network.zoom.min
                });
            }
        
            // restrict zoom
            if (params.scale >= network.zoom.max) {
                network.visualisation.moveTo({ scale: network.zoom.max }); }
        });

        // activate zoom buttons
        zoom.btnPlus.addEventListener('click', zoomIn);
        zoom.btnMoins.addEventListener('click', zoomOut);
        zoom.btnReinitialiser.addEventListener('click', backToCenterView);

        board.init(); // activate the alphabetical list display
        search.input.addEventListener('focus', search.init); // activate the search engine
        filter.init(); // activate filters
        
        // If there is entity id one URL : activate
        const urlPathnameArray = window.location.pathname.split('/');
        const nodeId = urlPathnameArray[urlPathnameArray.length -1];
        if (switchNode(nodeId, false)) {
            historique.init(nodeId);
        }
    }
}

/**
 * Return a color RGB or RGBA from a list
 * @param {string} name - Color's reference name
 * @param {string} lowerOpacity -  if true : retuns RGBA, else retuns RGB
 * @returns {string} color
 */

function chooseColor(name, lowerOpacity = false) {
    switch (name) {
        case 'collegue':
            var color = '154, 60, 154'; break;
        case 'collaborateur':
            var color = '97, 172, 97'; break;
        case 'opposant':
            var color = '250, 128, 114'; break;
        case 'famille':
            var color = '102, 179, 222'; break;
        case 'otlet':
            var color = '244, 164, 96'; break;
        case 'non-catégorisé':
            var color = '128,128,128'; break;
        case 'institution':
            var color = '128,128,128'; break;
        case 'œuvre':
            var color = '128,128,128'; break;
        case 'évènement':
            var color = '128,128,128'; break;
    }
    if (lowerOpacity) { return ['rgba(', color, ', 0.4)'].join(''); }
    else { return ['rgb(', color, ')'].join(''); }
}

/**
 * Return the metadatas from a entity
 * @param {number} id - Entity id
 * @returns {object} metadatas of false if malfunction
 */

function getNodeMetas(id) { 
    var nodeMetas = false;

    network.data.nodes.get({

        filter: function (item) {
            if (item.id == id) {
                nodeMetas = item; }
        }
    });

    return nodeMetas;
}

/**
 * Return metas from connected nodes
 * @param {number} id - Entity id
 * @returns {array} objects arrau contains metadatas
 */

function findConnectedNodes(nodeId) {
    var nodesConnected = network.visualisation.getConnectedNodes(nodeId);
    var edgesConnected = network.visualisation.getConnectedEdges(nodeId);

    var connectedNodesList = [];
    for (let i = 0; i < nodesConnected.length; i++) {
        const id = nodesConnected[i];
        var nodeMetas = getNodeMetas(id);
        // get the link description :
        var nodeLinkTitle = network.data.edges.get(edgesConnected[i]).title;
        connectedNodesList.push({
            id: nodeMetas.id,
            label: nodeMetas.label,
            relation: nodeMetas.group,
            title: nodeLinkTitle,
            hidden: nodeMetas.hidden,
        });
    }

    return connectedNodesList;
}

/**
 * Change view (graph focus & description bar content) about an entity
 * @param {number} nodeId - Entity id
 * @param {boolean} mustZoom - if true : zoom on node
 * @returns {boolean} if it works
 */

function switchNode(nodeId, mustZoom = true) {

    var nodeMetas = getNodeMetas(nodeId);

    if (nodeMetas == false) { return false; }

    network.visualisation.selectNodes([nodeId]);
    network.selectedNode = Number(nodeId);

    // rename webpage
    document.title = nodeMetas.label + ' - Otetosphère';

    if (mustZoom) {zoomToNode(nodeId);}

    fiche.fill();
    fiche.open();

    return true;
}