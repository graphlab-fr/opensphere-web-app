/**
 * ============
 * Zoom
 * ============
 */

const btnZoomPlus = document.querySelector('#zoom-plus');
const btnZoomMoins = document.querySelector('#zoom-moins');

btnZoomPlus.addEventListener('click', () => {
    if (!network.isLoaded) { return; }

    var scale = network.visualisation.getScale() + 0.3;

    if (scale >= network.zoom.max) {
        scale = network.zoom.max }

    network.visualisation.moveTo({ scale: scale });
});

btnZoomMoins.addEventListener('click', () => {
    if (!network.isLoaded) { return; }

    var scale = network.visualisation.getScale() - 0.3;

    if (scale <= network.zoom.min) {
        scale = network.zoom.min }

    network.visualisation.moveTo({ scale: scale });
});

const btnZoomGeneral = document.querySelector('#zoom-general');
btnZoomGeneral.addEventListener('click', backToCenterView);

/**
 * ============
 * Filtres
 * ============
 */

const btnsGroups = document.querySelectorAll('.btn-group');
btnsGroups.forEach(btn => {
    var group = btn.dataset.group;

    btn.style.backgroundColor = chooseColor(group);

    let isActiveGroup = true;

    btn.addEventListener('click', () => {

        if (!network.isLoaded) { return; }

        search.reset();

        if (isActiveGroup) {
            network.data.nodes.get({
                filter: function (item) {
                    if (item.group == group) {
                        network.data.nodes.update({id: item.id, hidden: true}) }
                }
            });

            btn.classList.add('active');

            isActiveGroup = false;
        } else {
            network.data.nodes.get({
                filter: function (item) {
                    if (item.group == group) {
                        network.data.nodes.update({id: item.id, hidden: false}) }
                }
            });

            btn.classList.remove('active');

            isActiveGroup = true;
        }
    
    });
});
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
    
        network.visualisation.on('afterDrawing', function() {
            // Visuation générée chargée
            network.isLoaded = true;
        });
    
        // Évent au clic sur un nœud
        network.visualisation.on('click', nodeView);
    
        // Évent au clic sur un nœud
        network.visualisation.on('hoverNode', function(params) {
            network.visualisation.selectNodes([params.node]);
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
    });
    
});

let nodeList = [];
function createNode(entite) {
    
    var nodeObject = {
        id: entite.id,
        label: entite.label,
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

function chooseColor(relationEntite) {
    switch (relationEntite) {
        case 'collegue':
            return 'purple';
        case 'contemporain':
            return 'green';
        case 'collaborateur':
            return 'orange';
        case 'opposant':
            return 'red';
        case 'famille':
            return 'blue';
        case 'otlet':
            return 'gray';
        case 'institution':
            return 'gray';
        case 'œuvre':
            return 'gray';
        case 'évènement':
            return 'gray';
    }
}

function nodeView(nodeMetasBrutes) {
    
    var id = nodeMetasBrutes.nodes[0];

    if (id === undefined) {
        return; }
    
    if (network.selectedNode !== undefined && network.selectedNode == id) {
        return; }

    zoomToNode(id);

    var nodeMetas = getNodeMetas(id);

    volet.fill(nodeMetas);
}

function getNodeMetas(id) { 
    var nodeMetas = null;

    network.data.nodes.get({

        filter: function (item) {
            if (item.id == id) {
                nodeMetas = item.metas;
                nodeMetas.label = item.label;
                nodeMetas.image = item.image;

                network.selectedNode = id;
            }
        }
    });

    return nodeMetas;
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
var search = {
    input: document.querySelector('#search'),
    resultContent: document.querySelector('#search-result'),

    showResult: function(resultObj) {
        var display = document.createElement('li');
        display.classList.add('search__result');
        display.textContent = resultObj.item.label;
        search.resultContent.appendChild(display);

        var id = resultObj.item.id;

        display.addEventListener('click', () => {

            if (network.selectedNode !== undefined && network.selectedNode == id) {
                return; }
            
            search.input.value = resultObj.item.label;
            search.resultContent.innerHTML = '';

            zoomToNode(id);
            
            var nodeMetas = getNodeMetas(id);

            volet.fill(nodeMetas);
        });
    },
    reset: function() {
        search.input.value = ''; // form value
        search.resultContent.innerHTML = ''; // results
    }
}

const options = {
    includeScore: true,
    keys: ['label']
}

search.input.value = '';

search.input.addEventListener('focus', () => {

    if (!network.isLoaded) { return; }
    
    const fuse = new Fuse(getActiveNodes(), options);

    search.input.addEventListener('input', () => {

        search.resultContent.innerHTML = '';

        if (search.input.value == '') {
            return; }

        const resultList = fuse.search(search.input.value);
        
        if (resultList.length > 5) { var nbResult = 5; }
        else { var nbResult = resultList.length; }
        
        for (let i = 0; i < nbResult; i++) {
            search.showResult(resultList[i]); }
    });
});

function getActiveNodes() {
    var activeNodes = network.data.nodes.get({
        filter: function (item) {
            return (item.hidden !== true);
        }
    });
    return activeNodes;
}
var volet = {
    body: document.querySelector('#volet'),
    content: document.querySelector('#volet-content'),
    btnControl: document.querySelector('#lateral-control'),
    isOpen: false,

    open: function() {
        if (!network.isLoaded) { return; }
        
        volet.body.classList.add('volet--active');
    },
    close: function() {
        volet.body.classList.remove('volet--active');
    },
    fill: function(nodeMetas) {
        var img = '<img class="volet__img" alt="" src="' + nodeMetas.image + '" />';
        var label = '<div class="volet__label">' + nodeMetas.label + '</div>';
        var dates = '<div class="volet__dates">' + nodeMetas.annee_naissance +  ' - '
            + nodeMetas.annee_mort + '</div>';
        var pays = '<div class="volet__pays">' + nodeMetas.pays + '</div>';
        var discipline = '<div class="volet__discipline">' + nodeMetas.discipline + '</div>';
        var description = '<div class="volet__description">' + nodeMetas.description + '</div>';

        volet.content.innerHTML = [img, label, dates, pays, discipline, description].join('');
    }
}

volet.btnControl.addEventListener('click', () => {

    if (volet.isOpen) {
        volet.close();
        volet.isOpen = false;
    } else {
        volet.open();
        volet.isOpen = true;
    }
});