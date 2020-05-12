var board = {
    content: document.querySelector('#board-content')
}

function createCard(entite) {
    const cardBox = document.createElement('div');
    cardBox.classList.add('card');
    board.content.appendChild(cardBox);

    // const cardWrapper = document.createElement('div');
    // cardWrapper.classList.add('card__wrapper');
    // cardBox.appendChild(cardWrapper);

    const cardPhoto = document.createElement('img');
    cardPhoto.classList.add('card__img');
    cardPhoto.setAttribute('src', './assets/photos/' + entite.photo)
    cardPhoto.setAttribute('alt', 'Photo de ' + entite.label)
    cardBox.appendChild(cardPhoto);

    const cardLabel = document.createElement('h3');
    cardLabel.classList.add('card__label');
    cardLabel.textContent = entite.label;
    cardBox.appendChild(cardLabel);


    if (entite.annee_naissance !== null) {
        var chaine = '(' + entite.annee_naissance;

        if (entite.annee_mort !== null) {
            chaine += ' - ' + entite.annee_mort;
        }

        const cardDate = document.createElement('span');
        cardDate.classList.add('card__date');
        cardDate.textContent = chaine + ')';
        cardLabel.appendChild(cardDate);
    }

    if (entite.titre !== null) {
        const cardTitre = document.createElement('h4');
        cardTitre.classList.add('card__titre');
        cardTitre.textContent = entite.titre;
        cardBox.appendChild(cardTitre);
    }
}
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

const btnZoomOnSelection = document.querySelector('#zoom-selection');
btnZoomOnSelection.addEventListener('click', () => {
    zoomToNode(network.selectedNode);
});

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
var fiche = {
    body: document.querySelector('#fiche'),
    content: document.querySelector('#fiche-content'),
    connexionList: document.querySelector('#fiche-connexion'),
    btnControl: document.querySelector('#fiche-control'),
    isOpen: false,
    fields: {
        // champs du fiche
        img: document.querySelector('#fiche-meta-img'),
        label: document.querySelector('#fiche-meta-label'),
        date: document.querySelector('#fiche-meta-date'),
        pays: document.querySelector('#fiche-meta-pays'),
        discipline: document.querySelector('#fiche-meta-discipline'),
        description: document.querySelector('#fiche-meta-description')
    },

    fixer: function() {
        fiche.body.classList.add('lateral--fixed');
    },
    open: function() {
        if (!network.isLoaded) { return; }
        
        fiche.body.classList.add('lateral--active');
        this.isOpen = true;
    },
    close: function() {
        fiche.body.classList.remove('lateral--active');
        this.isOpen = false;
    },
    setImage: function(entitePhoto, entiteLabel) {
        if (entitePhoto === null) { return; }
        this.fields.img.setAttribute('src', entitePhoto);
        this.fields.img.setAttribute('alt', 'photo de ' + entiteLabel);
    },
    setLabel: function(entiteLabel) {
        if (entiteLabel === null) { return; }
        this.fields.label.textContent = entiteLabel;
    },
    setDates: function(entiteDateNaissance, entiteDateMort) {
        if (entiteDateNaissance === null && entiteDateMort === null) { return; }

        if (entiteDateNaissance !== null) {
            var naissance = '<div class="fiche__dates"><time class="" datetime="' 
            + entiteDateNaissance + '">' + entiteDateNaissance + '</time>';
        }

        if (entiteDateMort !== null) {
            var mort = ' - <time class="fiche__dates" datetime="' + entiteDateMort + '">' +
                entiteDateMort + '</time><div>';
        }

        this.fields.date.innerHTML = [naissance, mort].join('');
    },
    setPays: function(entitePays) {
        if (entitePays === null) { return; }
        var libelle = '<h3 class="fiche__libelle">Pays</h3>';
        var pays = '<div class="fiche__pays">' + entitePays + '</div>';
        this.fields.pays.innerHTML = [libelle, pays].join('');
    },
    setDiscipline: function(entiteDiscipline) {
        if (entiteDiscipline === null) { return; }
        var libelle = '<h3 class="fiche__libelle">Discipline</h3>';
        var discipline = '<div class="fiche__discipline">' + entiteDiscipline + '</div>';
        this.fields.discipline.innerHTML = [libelle, discipline].join('');
    },
    setDescription: function(entiteDescription) {
        if (entiteDescription === null) { return; }
        var libelle = '<h3 class="fiche__libelle">Description</h3>';
        var description = '<div class="fiche__description">' + entiteDescription + '</div>';
        this.fields.description.innerHTML = [libelle, description].join('');
    },
    setConnexion: function(nodeConnectedList, entiteLabel) {
        if (nodeConnectedList === false) { return; }
        this.connexionList.innerHTML = '';

        for (let i = 0; i < nodeConnectedList.length; i++) {
            const connexion = nodeConnectedList[i];

            if (connexion.label == entiteLabel) { continue; }

            var listElt = document.createElement('li');
            listElt.classList.add('connexion-list__elt')
            listElt.textContent = connexion.label;
            this.connexionList.appendChild(listElt);

            listElt.addEventListener('click', () => {
                var id = connexion.id;

                switchNode(id);
                historique.actualiser(id);
            });
        }
    },
    fill: function(nodeMetas, nodeConnectedList = false) {
        // affichage du contenant
        this.content.classList.add('fiche__content--visible');

        // remplissage métadonnées
        this.setImage(nodeMetas.image, nodeMetas.label);
        this.setLabel(nodeMetas.label);
        this.setDates(nodeMetas.annee_naissance, nodeMetas.annee_mort);
        this.setPays(nodeMetas.pays);
        this.setDiscipline(nodeMetas.discipline);
        this.setDescription(nodeMetas.description);

        // remplissage nœuds connectés
        this.setConnexion(nodeConnectedList, nodeMetas.label);
        
    }
}

fiche.btnControl.addEventListener('click', () => {
    // toggle du lateral fiche
    if (fiche.isOpen) { fiche.close(); }
    else { fiche.open(); }
});
var historique = {
    actualiser: function(id) {
        if (history.state == null) { this.init(id); }
        else {
            var timeline = history.state.hist;
            timeline.push(id);
            history.pushState({hist : timeline}, 'entite ' + id, id);
        }
    },
    init: function(id) {
        history.pushState({hist : [id]}, 'entite ' + id, id);
    }
}

window.onpopstate = function(e) {
    if (e.state === null) { return; }

    var timeline = e.state.hist;

    var id = timeline[timeline.length -1];
    switchNode(id);
};
var interface = {
    headerFixeur: document.querySelector('#entete-fixeur'),
    fix: function(bool) {
        if (bool) {
            this.headerFixeur.classList.add('entete__fixe--active');
            fiche.body.classList.add('lateral--fixed');
        } else {
            this.headerFixeur.classList.remove('entete__fixe--active');
            fiche.body.classList.remove('lateral--fixed');
        }
    }
}


var movement = {
    offset: {
        introduction: document.querySelector('#introduction').offsetTop,
        graph: introduction.clientHeight - 105,
        board: introduction.clientHeight * 2
    },
    goTo: function(section) {
        switch (section) {
            case 'introduction':
                this.scroll(0);
                interface.fix(false);
                break;
                
            case 'graph':
                this.scroll(this.offset.graph);
                interface.fix(true);
                break;
                
            case 'board':
                this.scroll(this.offset.board);
                interface.fix(true);
                break;
        }
    },
    scroll: function(offset) {
        // console.log(offset);
        
        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });
    }
}

movement.goTo('graph');
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

        Object.values(data.Entites).forEach(entite => {
            createCard(entite); });

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
                
                network.data.nodes.update({id: id, color: chooseColor(groupName, true), opacity: 0.4})
            }
            
        });
        // Évent fin de survol : les nœuds retrouvent leur couleur initiale
        network.visualisation.on('blurNode', function(params) {
            var ids = network.nodeIds;

            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                if (id == params.node) { continue; }
                network.data.nodes.update({id: id, color: false, opacity: 1})
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
        var pathnameArray = window.location.pathname.split('/');
        var idNode = pathnameArray[pathnameArray.length -1];
        if (switchNode(idNode, false)) {
            fiche.open();
            historique.init(idNode);
        }
    });
    
});

let nodeList = [];
function createNode(entite) {
    
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
    historique.actualiser(id);
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

    document.title = nodeMetas.label + ' - Otetosphère';

    if (mustZoom) {zoomToNode(id);}

    fiche.fill(nodeMetas, findConnectedNodes(id));

    return true;
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

            switchNode(id);
            historique.actualiser(id);
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