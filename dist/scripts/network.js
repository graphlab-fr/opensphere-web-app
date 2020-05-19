var network = {
    container: document.querySelector('#network'),
    isLoaded: false,
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
        groups: {
            collegue: {shape: 'circularImage', color: {border: chooseColor('collegue')}},
            contemporain: {shape: 'circularImage', color: {border: chooseColor('contemporain')}},
            collaborateur: {shape: 'circularImage', color: {border: chooseColor('collaborateur')}},
            famille: {shape: 'circularImage', color: {border: chooseColor('famille')}},
            opposant: {shape: 'circularImage', color: {border: chooseColor('opposant')}},
            otlet: {shape: 'circularImage', color: {border: chooseColor('otlet')}},
            institution: {shape: 'image', color: {border: chooseColor('institution')}},
            œuvre: {shape: 'image', color: {border: chooseColor('œuvre')}},
            évènement: {shape: 'image', color: {border: chooseColor('évènement')}}
        },
        interaction: {hover:true}
    },
    zoom: {
        max: 1,
        min: 0.2
    },
    selectedNode: undefined
}

fetch('data.json').then(function(response) {
    // Chargement de données...
    
    response.text().then(function(text) {
        // Traitement des données...
        var data = JSON.parse(text);

        Object.values(data.Entites).forEach(entite => {
            createNodeObject(entite); });
        
        Object.values(data.Extraction).forEach(lien => {
            createEdgeObject(lien); });

        // Génération de la visualisation
        network.data = {
            nodes: new vis.DataSet(generatedNodesObjectList),
            edges: new vis.DataSet(generatedEdgesObjectList)
        }

        network.visualisation = new vis.Network(network.container,
            network.data, network.options);
        
        // Évents du network
        network.visualisation.on('selectNode', function(nodeMetasBrutes) {
            var idNode = nodeMetasBrutes.nodes[0];

            if (idNode === undefined) { return; }
            
            if (network.selectedNode !== undefined && network.selectedNode == idNode) {
                // si nœeud est déjà selectionné
                return;
            }

            switchNode(idNode);
            historique.actualiser(idNode);
        });

        network.visualisation.on('deselectNode', function() {
            network.selectedNode = undefined;
        });

        network.visualisation.on('hoverNode', function(params) {
            var idNodeHovered = params.node;
            var allIds = network.allNodesIds;

            // pas d'effet sur le nœud survolé
            var noEffectNodesIds = [idNodeHovered];
            // ni sur les nœuds qui y sont connectés
            noEffectNodesIds = noEffectNodesIds
                .concat(network.visualisation.getConnectedNodes(idNodeHovered));

            if (network.selectedNode !== undefined) {
                // pas d'effet sur le nœud selectionné
                noEffectNodesIds.push(network.selectedNode)
                // ni sur les nœuds qui y sont connectés
                noEffectNodesIds = noEffectNodesIds
                    .concat(network.visualisation.getConnectedNodes(network.selectedNode));
            }

            for (let i = 0 ; i < allIds.length ; i++) {
                const nodeId = allIds[i];
                if (noEffectNodesIds.indexOf(nodeId) !== -1) {
                    // si 'nodeId' est compris dans 'noEffectNodesIds'
                    continue;
                }

                var nodeGroupName = network.data.nodes.get(nodeId).group;
                
                network.data.nodes.update({
                    id: nodeId,
                    color: chooseColor(nodeGroupName, true),
                    opacity: 0.4,
                    font: {color: 'rgba(0, 0, 0, 0.5)'}
                });
            }
            
        });

        network.visualisation.on('blurNode', function(params) {
            var allIds = network.allNodesIds;

            allIds.forEach(id => {
                network.data.nodes.update({
                    id: id,
                    color: false,
                    opacity: 1,
                    font: {color: 'black'}
                });
            });
        });

        network.visualisation.on('zoom', function(params) {

            // limiter le de-zoom
            if (params.scale <= network.zoom.min) {
                network.visualisation.moveTo({
                    position: { x: 0, y: 0 },
                    scale: network.zoom.min
                });
            }

            // limiter le zoom
            if (params.scale >= network.zoom.max) {
                network.visualisation.moveTo({ scale: network.zoom.max }); }
        });

        // Stockage données
        network.isLoaded = true;
        network.allNodesIds = network.data.nodes.getIds();

        board.init();

        // Si l'id d'un nœud est entré dans l'URL, on l'active
        var urlPathnameArray = window.location.pathname.split('/');
        var nodeId = urlPathnameArray[urlPathnameArray.length -1];
        if (switchNode(nodeId, false)) {
            fiche.open();
            historique.init(nodeId);
        }

    });
    
});

let generatedNodesObjectList = [];
function createNodeObject(entite) {

    var nodeObject = {
        id: entite.id,
        label: entite.label,
        font: {
            face: 'Source Sans Pro',
            size: 22,
            strokeWidth: 3
        },
        title: entite.titre,
        group: entite.relation_otlet,
        image: './assets/photos/' + entite.photo,
        size : 30,
        borderWidth: 3,
        borderWidthSelected: 60,
        margin: 20,
        metas: {
            genre: entite.genre,
            annee_naissance: entite.annee_naissance,
            annee_mort: entite.annee_mort,
            pays: entite.pays,
            pays_en: entite.pays_en,
            discipline: entite.discipline,
            discipline_en: entite.discipline_en,
            description: entite.description,
            description_en: entite.description_en,
            lien_wikipedia: entite.lien_wikipedia
        },
        interaction: {hover:true},
        hidden: false
    };

    if (entite.nom) {
        var splitName = entite.nom.split(' ', 2);
        // rejet de la particule "de"
        if (splitName.length == 2 && splitName[0] == 'de') {
            nodeObject.sortName = splitName[1];
        } else {
            nodeObject.sortName = entite.nom;
        }
    } else {
        nodeObject.sortName = entite.label
    }
    generatedNodesObjectList.push(nodeObject);
}

let generatedEdgesObjectList = [];
function createEdgeObject(lien) {
    if (lien.from == 1 || lien.to == 1) {
        // si le lien a une relation avec Otelt
        var color = null;
    } else { var color = 'gray'; }

    var edgeObject = {
        from: lien.from,
        to: lien.to,
        title: lien.label,
        color: color
    };
    generatedEdgesObjectList.push(edgeObject);
}

/**
 * Retourne une couleur type RGB ou RGBA
 * selon le nom d'un groupe d'entité
 * @param {String} relationEntite 
 * @param {Boolean} [lowerOpacity = false] true : retuns RGBA : false : retuns RGB
 * @returns {String}
 */

function chooseColor(relationEntite, lowerOpacity = false) {
    switch (relationEntite) {
        case 'collegue':
            var color = '128, 0, 128'; break;
        case 'contemporain':
            var color = '0, 128, 0'; break;
        case 'collaborateur':
            var color = '250, 128, 114'; break;
        case 'opposant':
            var color = '255,0,0'; break;
        case 'famille':
            var color = '135, 206, 235'; break;
        case 'otlet':
            var color = '244, 164, 96'; break;
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

function getNodeMetas(id) { 
    var nodeMetas = false;

    network.data.nodes.get({

        filter: function (item) {
            if (item.id == id) {
                nodeMetas = item.metas;
                nodeMetas.id = id;
                nodeMetas.label = item.label;
                nodeMetas.image = item.image;
                nodeMetas.relation = item.group;
            }
        }
    });

    return nodeMetas;
}

function findConnectedNodes(nodeId) {
    var nodesConnected = network.visualisation.getConnectedNodes(nodeId);
    var edgesConnected = network.visualisation.getConnectedEdges(nodeId);

    var connectedNodesList = [];
    for (let i = 0; i < nodesConnected.length; i++) {
        const id = nodesConnected[i];
        var nodeMetas = getNodeMetas(id);
        var nodeLinkTitle = network.data.edges.get(edgesConnected[i]).title;
        connectedNodesList.push({
            id: nodeMetas.id,
            label: nodeMetas.label,
            relation: nodeMetas.relation,
            title: nodeLinkTitle
        });
    }

    return connectedNodesList;
}

function zoomToNode(nodeId) {
    var nodeId = Number(nodeId);
    var nodeCoordonates = network.visualisation.getPosition(nodeId);
    
    if (network.data.nodes.get(nodeId).hidden === true) {
        // si le nœeud est hidden
        return;
    }

    network.visualisation.moveTo({
        position: {
            x: nodeCoordonates.x,
            y: nodeCoordonates.y
        },
        scale: network.zoom.max,
        animation: true
    });

    network.visualisation.selectNodes([nodeId]);
}

function backToCenterView() {
    network.visualisation.fit({ animation: true });
}

function switchNode(nodeId, mustZoom = true) {

    var nodeMetas = getNodeMetas(nodeId);

    if (nodeMetas == false) { return false; }

    network.selectedNode = nodeId;

    // renommer la page web
    document.title = nodeMetas.label + ' - Otetosphère';

    if (mustZoom) {zoomToNode(nodeId);}

    fiche.fill(nodeMetas, findConnectedNodes(nodeId));
    fiche.open();

    return true;
}