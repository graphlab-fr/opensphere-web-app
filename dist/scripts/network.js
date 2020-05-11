var network = {
    container: document.querySelector('#network'),
    isLoaded: false,
    interaction: {
        navigationButtons: true,
        zoomView: false
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
        groups: {
            collegue: {shape: 'circularImage', color: {border: chooseColor('collegue')}},
            contemporain: {shape: 'circularImage', color: {border: chooseColor('contemporain')}},
            collaborateur: {shape: 'circularImage', color: {border: chooseColor('collaborateur')}},
            famille: {shape: 'circularImage', color: {border: chooseColor('famille')}},
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
    selectedNode: undefined,
    
    unselect: function() {
        network.selectedNode = undefined;
        network.visualisation.unselectAll();
    }
}

fetch('data.json').then(function(response) {
    // Chargement de données...
    
    response.text().then(function(text) {
        // Traitement des données...
        var data = JSON.parse(text);

        Object.values(data.Entites).forEach(entite => {
            createNode(entite); });
        
        Object.values(data.Extraction).forEach(lien => {
            createEdge(lien); });

        // Génération de la visualisation
        network.data = {
            nodes: new vis.DataSet(nodeList),
            edges: new vis.DataSet(edgeList)
        }
    
        network.visualisation = new vis.Network(network.container,
            network.data, network.options);
    
        // Évent au clic sur un nœud
        network.visualisation.on('click', nodeView);

        network.nodeIds = network.data.nodes.getIds();
    
        // Évent au survol : les autres nœuds deviennent translucide
        network.visualisation.on('hoverNode', function(params) {
            activNodeId = params.node;

            var ids = network.nodeIds;

            var noColorNodesIds = network.visualisation.getConnectedNodes(activNodeId);
            noColorNodesIds.push(activNodeId);

            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                if (noColorNodesIds.indexOf(id) !== -1) { continue; }
                var groupName = network.data.nodes.get(id).group;
                
                network.data.nodes.update({id: id, color: chooseColor(groupName, true)})
            }
            
        });
        // Évent fin de survol : les nœuds retrouvent leur couleur initiale
        network.visualisation.on('blurNode', function(params) {
            var ids = network.nodeIds;

            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                if (id == params.node) { continue; }
                network.data.nodes.update({id: id, color: false})
            }
            
        });

        // Évent au zoom
        network.visualisation.on('zoom', function(params) {

            // limiter le de-zoom
            if (params.scale <= 0.2) {
                network.visualisation.moveTo({
                    position: { x: 0, y: 0 },
                    scale: network.zoom.min
                });
            }

            // limiter le zoom
            if (params.scale >= 1) {
                network.visualisation.moveTo({ scale: network.zoom.max }); }
            
        });

        // Visuation générée chargée
        network.isLoaded = true;

        // Si l'id d'un nœud est entré dans l'URL, on l'active
        var pathnameArray = window.location.pathname.split('/')
        var idNode = pathnameArray[pathnameArray.length -1];
        if (switchNode(idNode, false)) {
            volet.open();
        }
    });
    
});

let nodeList = [];
function createNode(entite) {
    
    var nodeObject = {
        id: entite.id,
        label: entite.label,
        font: {strokeWidth: 3},
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
            discipline: entite.discipline,
            description: entite.description
        },
        interaction: {hover:true}
    };
    nodeList.push(nodeObject);
}

let edgeList = [];
function createEdge(lien) {
    var edgeObject = {
        from: lien.from,
        to: lien.to,
        title: lien.label
    };
    edgeList.push(edgeObject);
}

function chooseColor(relationEntite, lowerOpacity = false) {
    switch (relationEntite) {
        case 'collegue':
            var color = '128, 0, 128'; break; // notation RGB
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
    // ajout opacité '0,4'
    if (lowerOpacity) { return ['rgba(', color, ', 0.4)'].join(''); }
    else { return ['rgb(', color, ')'].join(''); }

}

function nodeView(nodeMetasBrutes) {
    
    var id = nodeMetasBrutes.nodes[0];

    if (id === undefined) {
        return; }
    
    if (network.selectedNode !== undefined && network.selectedNode == id) {
        return; }

    switchNode(id);
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
            }
        }
    });

    return nodeMetas;
}

function findConnectedNodes(nodeId) {
    var connectedNodesList = [];
    var nodesConnected = network.visualisation.getConnectedNodes(nodeId);
    nodesConnected.forEach(id => {
        var nodeConnected = getNodeMetas(id);
        connectedNodesList.push({id: nodeConnected.id, label: nodeConnected.label});
    });
    return connectedNodesList;
}

function zoomToNode(id) {
    // Trouver le nœud et zommer sur lui
    var nodeCoordonates = network.visualisation.getPosition(id);
    network.visualisation.moveTo({
        position: {
            x: nodeCoordonates.x,
            y: nodeCoordonates.y
        },
        scale: 1,
        animation: true
    });
    // L'activer, lui et ses liens
    network.visualisation.selectNodes([id]);
}

function backToCenterView() {
    network.visualisation.fit({
        animation: true
    });
}

function switchNode(id, mustZoom = true) {

    var nodeMetas = getNodeMetas(id);

    if (nodeMetas == false) { return false; }

    network.selectedNode = id;

    history.pushState({}, 'entite ' + id, id);

    document.title = nodeMetas.label + ' - Otetosphère';

    if (mustZoom) {zoomToNode(id);}

    volet.fill(nodeMetas, findConnectedNodes(id));

    return true;
}

window.onpopstate = function() {
    var pathnameArray = window.location.pathname.split('/')
    var idNode = pathnameArray[pathnameArray.length -1];
    switchNode(idNode)
};