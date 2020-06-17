var board = {
    content: document.querySelector('#board-content'),
    wrapper: document.querySelector('#board-wrapper'),
    sort: {
        conteneur: document.querySelector('#board-alphabetic'),
        caracters: [],
        lastCaracter: undefined,
        init: function() {
            this.caracters.forEach(caracter => {
                caract = document.createElement('li');
                caract.classList.add('sort-alphabetic-list__caracter');
                caract.textContent = caracter.caracter;
                this.conteneur.appendChild(caract);

                var caracterSectionTitle = document.createElement('label');
                caracterSectionTitle.classList.add('board__section-title');
                caracterSectionTitle.textContent = caracter.caracter;
                board.content.appendChild(caracterSectionTitle);

                board.content.appendChild(caracter.cardsContent);

                caract.addEventListener('click', () => {
                    board.wrapper.scrollTop = 0;
                    board.wrapper.scrollTo({
                        top: caracter.cardsContent.getBoundingClientRect().y -180,
                        behavior: 'smooth'
                    });
                });
            });
        }
    },
    init: function() {
        if (!network.isLoaded) { return; }

        this.content.innerHTML = '';
        board.sort.caracters = [];
        board.sort.conteneur.innerHTML = '';
        
        network.data.nodes.forEach(createCard, { order: 'sortName' });
        board.sort.init();
    }
}

function createCard(entite) {

    if (entite.hidden == true) { return; }

    var firstCaracterFromLabel = entite.sortName.charAt(0);
    if (firstCaracterFromLabel != board.sort.lastCaracter) {
        // si le caractère n'est pas le dernier enregistré on a changé de caractère
        // donc instance d'une nouvelle section de cartes

        var caracterSection = document.createElement('div');
        caracterSection.classList.add('board__section');

        board.sort.caracters.push({
            caracter: firstCaracterFromLabel,
            cardsContent: caracterSection
        });

        board.sort.lastCaracter = firstCaracterFromLabel;
    }

    var photo = '<img class="card__img" src="' + entite.image + '" alt="' + entite.label + '" />';
    var label = '<h3 class="card__label">' + entite.label + '</h3>';
    var dates = null;
    if (entite.annee_naissance !== null) {
        if (entite.annee_mort !== null) {
            var dateAjoutMort = ' - ' + entite.annee_mort; }

        dates = ['<span class="card__date">(', entite.annee_naissance,
            dateAjoutMort, ')</span>'].join('');
    }
    var identite = ['<div class="card__identite">', label, dates, '</div>'].join('');
    var presentation = ['<div class="card__presentation">', photo, identite, '</div>'].join('');

    var titre = null;
    if (entite.title !== null) {
        titre = '<h4 class="card__titre">' + entite.title + '</h4>'; }

    // dernier contenant de cartes créé où mettre les cartes pour un même caractère
    var cardContent = board.sort.caracters[board.sort.caracters.length - 1].cardsContent;

    const cardBox = document.createElement('div');
    cardBox.classList.add('card');
    cardBox.innerHTML = [presentation, titre].join('');
    cardContent.appendChild(cardBox);

    cardBox.addEventListener('click', () => {
        switchNode(entite.id)
        historique.actualiser(entite.id);
    });
}
let generatedNodesObjectList = [];
function createNodeObject(data) {

    var imagePath  = './assets/photos/';

    data.forEach(entite => {
                    
        var nodeObject = {
            // entite metas
            id: entite.id,
            label: entite.label,
            title: entite.titre,
            group: entite.relation_otlet,
            image: imagePath + entite.photo,
            genre: entite.genre,
            annee_naissance: entite.annee_naissance,
            annee_mort: entite.annee_mort,
            pays: entite.pays,
            pays_en: entite.pays_en,
            discipline: entite.discipline,
            discipline_en: entite.discipline_en,
            description: entite.description,
            description_en: entite.description_en,
            lien_wikipedia: entite.lien_wikipedia,

            // node style
            size : 30,
            borderWidth: 3,
            borderWidthSelected: 60,
            margin: 20,
            interaction: {hover: true},
            hidden: false,
            font: {
                face: 'Open Sans',
                size: 22,
                strokeWidth: 3
            }
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
    });

    return generatedEdgesObjectList;
}

let generatedEdgesObjectList = [];
function createEdgeObject(data) {

    data.forEach(lien => {
                    
        if (lien.from == 1 || lien.to == 1) {
            // si le lien a une relation avec Otlet
            var color = null;
        } else { var color = 'gray'; }
    
        var edgeObject = {
            // edge metas
            from: lien.from,
            to: lien.to,
            title: lien.label,

            // edge style
            color: color
        };
        generatedEdgesObjectList.push(edgeObject);
    });

    return generatedEdgesObjectList;
}

Promise.all([
    fetch('./data/entite.json'),
    fetch('./data/lien.json')
]).then(function(data) {
    // console.log(data);
    const entite = data[0]
    const lien = data[1]
    
    Promise.all([
        entite.json(),
        lien.json()
    ]).then(function(data) {
        const entite = data[0]
        const lien = data[1]

        createNodeObject(entite);
        createEdgeObject(lien);

        network.init();

    });
});
var fiche = {
    body: document.querySelector('#fiche'),
    content: document.querySelector('#fiche-content'),
    entete: document.querySelector('#fiche-entete'),
    memory: {},
    toggle: document.querySelector('#fiche-toggle'),
    isOpen: false,
    fields: {
        wikiLink: document.querySelector('#fiche-wiki-link'),
        img: document.querySelector('#fiche-meta-img'),
        label: document.querySelector('#fiche-meta-label'),
        date: document.querySelector('#fiche-meta-date'),
        titre: document.querySelector('#fiche-meta-titre'),
        pays: document.querySelector('#fiche-meta-pays'),
        discipline: document.querySelector('#fiche-meta-discipline'),
        description: document.querySelector('#fiche-meta-description'),
        connexion: document.querySelector('#fiche-connexion')
    },

    fixer: function(bool) {
        if (bool) { fiche.body.classList.add('lateral--fixed'); }
        else { fiche.body.classList.remove('lateral--fixed'); }
    },
    open: function() {
        if (!network.isLoaded) { return; }
        
        this.toggle.classList.add('fiche__toggle-btn--active');
        fiche.body.classList.add('lateral--active');
        this.isOpen = true;
    },
    close: function() {
        if (movement.currentSection === 'fiches') { return; }
        
        this.toggle.classList.remove('fiche__toggle-btn--active');
        fiche.body.classList.remove('lateral--active');
        this.isOpen = false;
    },
    canClose: function(bool) {
        if (bool) { this.toggle.classList.remove('d-none'); }
        else { this.toggle.classList.add('d-none'); }
    },
    setImage: function(entitePhoto, entiteLabel) {
        this.fields.img.setAttribute('src', entitePhoto);
        this.fields.img.setAttribute('alt', 'photo de ' + entiteLabel);
    },
    setDates: function(entiteDateNaissance, entiteDateMort) {
        if (entiteDateNaissance === null && entiteDateMort === null) {
            this.fields.date.innerHTML = '';
            return;
        }

        let naissance = '';
        let mort = '';

        if (entiteDateNaissance !== null) {
            naissance = '<div class="fiche__dates"><time class="" datetime="' 
                + entiteDateNaissance + '">' + entiteDateNaissance + '</time>';
        }

        if (entiteDateMort !== null) {
            mort = ' - <time  datetime="' + entiteDateMort + '">' +
                entiteDateMort + '</time><div>';
        }

        this.fields.date.innerHTML = [naissance, mort].join('');
    },
    setWikiLink: function(wikiLink) {
        if (wikiLink === null) {
            this.fields.wikiLink.classList.remove('fiche__wiki-link--visible')
            this.fields.wikiLink.setAttribute('href', '')
        } else {
            this.fields.wikiLink.classList.add('fiche__wiki-link--visible')
            this.fields.wikiLink.setAttribute('href', wikiLink)
        }
    },
    setMeta: function(meta, content) {
        if (meta === null) {
            content.innerHTML = ''; }
        else {
            content.innerHTML = meta; }
    },
    setConnexion: function(nodeConnectedList) {
        this.fields.connexion.innerHTML = '';

        if (nodeConnectedList === null) { return; }

        var list = document.createElement('ul');
        list.classList.add('connexions__list');
        this.fields.connexion.appendChild(list);

        for (let i = 0; i < nodeConnectedList.length; i++) {
            const connectedNode = nodeConnectedList[i];

            if (connectedNode.hidden == true) {
                continue;
            }

            var listElt = document.createElement('li');
            listElt.classList.add('connexions__elt');
            listElt.textContent = connectedNode.label;
            this.fields.connexion.appendChild(listElt);

            var puceColored = document.createElement('span');
            puceColored.classList.add('connexions__puce');
            puceColored.style.backgroundColor = chooseColor(connectedNode.relation);
            listElt.prepend(puceColored);

            listElt.addEventListener('click', () => {
                switchNode(connectedNode.id);
                historique.actualiser(connectedNode.id);
            });

            if (connectedNode.title !== null) {
                listElt.setAttribute('title', connectedNode.title);

                listElt.addEventListener('mouseenter', (e) => {
                    overflow.classList.add('overflow--active');
                    overflow.style.left = e.pageX + 20 + 'px';
                    overflow.style.top = e.pageY - overflow.offsetHeight + 'px';
                    overflow.textContent = connectedNode.title;
                })

                listElt.addEventListener('mouseout', () => {
                    overflow.classList.remove('overflow--active');
                })
            }
        }
    },
    fill: function(nodeMetas, nodeConnectedList) {
        // affichage du contenant
        this.content.classList.add('fiche__content--visible');
        this.memory.activeNodeMetas = nodeMetas;
        this.memory.activeNodeConnectedList = nodeConnectedList;

        // remplissage métadonnées
        this.setMeta(nodeMetas.label, this.fields.label);
        this.setMeta(nodeMetas.title, this.fields.titre);
        this.setImage(nodeMetas.image, nodeMetas.label);
        this.setDates(nodeMetas.annee_naissance, nodeMetas.annee_mort);
        this.setWikiLink(nodeMetas.lien_wikipedia);

        switch (langage.actual) {
            case 'Fr':
                this.setMeta(nodeMetas.pays, this.fields.pays);
                this.setMeta(nodeMetas.discipline, this.fields.discipline);
                this.setMeta(nodeMetas.description, this.fields.description);
                break;
            case 'En':
                this.setMeta(nodeMetas.pays_en, this.fields.pays);
                this.setMeta(nodeMetas.discipline_en, this.fields.discipline);
                this.setMeta(nodeMetas.description_en, this.fields.description);
                break;
        }

        this.setConnexion(nodeConnectedList);
    }
}

fiche.toggle.addEventListener('click', () => {
    // toggle close and open du lateral fiche
    if (fiche.isOpen) { fiche.close(); }
    else { fiche.open(); }
});

const overflow = document.querySelector('#overflow');
var filter = {
    btnsGroups: document.querySelectorAll('.btn-group'),
    volet: {
        body: document.querySelector('#filter-volet'),
        btnOpen: document.querySelector('#filtre-open'),
        btnClose: document.querySelector('#filtre-close')
    },
    init: function() {
        this.btnsGroups.forEach(btn => {
            var group = btn.dataset.group;
        
            btn.style.backgroundColor = chooseColor(group);
        
            let isActiveGroup = true;
        
            btn.addEventListener('click', () => {

                network.visualisation.stabilize();
        
                if (!network.isLoaded) { return; }
        
                if (isActiveGroup) {
                    network.data.nodes.get({
                        filter: function (item) {
                            if (item.group == group) {
                                network.data.nodes.update({id: item.id, hidden: true}) }
                        }
                    });

                    // activation visuelle boutons filtre de entête et volet
                    document.querySelectorAll('[data-group="' + btn.dataset.group + '"]').forEach(btn => {
                        btn.classList.add('active'); });
        
                    isActiveGroup = false;
                } else {
                    network.data.nodes.get({
                        filter: function (item) {
                            if (item.group == group) {
                                network.data.nodes.update({id: item.id, hidden: false}) }
                        }
                    });

                    // deactivation visuelle boutons filtre de entête et volet
                    document.querySelectorAll('[data-group="' + btn.dataset.group + '"]').forEach(btn => {
                        btn.classList.remove('active'); });

                    isActiveGroup = true;
                }
        
                search.reset();
                board.init();
            
            });
        });
    }
}

filter.init();
filter.volet.btnOpen.addEventListener('click', () => {
    filter.volet.body.classList.add('lateral--active'); });
filter.volet.btnClose.addEventListener('click', () => {
    filter.volet.body.classList.remove('lateral--active'); });
var historique = {
    actualiser: function(nodeId) {
        if (history.state == null) { this.init(nodeId); }
        else {
            var timeline = history.state.hist;
            timeline.push(nodeId);
            history.pushState({hist : timeline}, 'entite ' + nodeId, nodeId);
        }
    },
    init: function(nodeId) {
        history.pushState({hist : [nodeId]}, 'entite ' + nodeId, nodeId);
    }
}

window.onpopstate = function(e) {
    if (e.state === null) { return; }

    var timeline = e.state.hist;

    var nodeId = timeline[timeline.length - 1];
    switchNode(nodeId);
};
var header = {
    fixBox: document.querySelector('#entete-fixeur'),
    height: 175,

    fixer: function(bool) {
        if (bool) { this.fixBox.classList.add('entete__fixe--active') }
        else { this.fixBox.classList.remove('entete__fixe--active') }
    }
}

var navigation = {
    links: document.querySelectorAll('.navigation__link'),
    activLink: function(section) {

        if (movement.currentSection !== undefined) {
            // désactiver la surbrillance du lien vers la précédante section
            document.querySelector('[data-section="' + movement.currentSection + '"]')
                .classList.remove('navigation__link--active');
        }

        // activer la surbrillance du lien vers la nouvelle section
        document.querySelector('[data-section="' + section + '"]')
            .classList.add('navigation__link--active');
    }
}

navigation.links.forEach(link => {
    link.addEventListener('click', (e) => {
        movement.goTo(e.target.dataset.section);
    })
});

var movement = {
    currentSection: undefined,
    offset: {
        introduction: 0,
        graph: window.innerHeight - header.height,
        board: window.innerHeight * 2 - header.height
    },
    goTo: function(section) {

        navigation.activLink(section);
        this.currentSection = section;

        switch (section) {
            case 'a_propos':
                this.scroll(0);

                header.fixer(false);
                fiche.fixer(false);
                fiche.canClose(true);
                break;
                
            case 'reseau':
                this.scroll(this.offset.graph);

                header.fixer(true);
                fiche.fixer(true);
                fiche.canClose(true);
                break;
                
            case 'fiches':
                this.scroll(this.offset.board);

                header.fixer(true);
                fiche.fixer(true);
                fiche.canClose(false);
                fiche.open();
                break;
        }
    },
    scroll: function(offset) {
        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });
    }
}

movement.goTo('reseau');

window.onresize = function() {
    movement.offset = {
        introduction: 0,
        graph: window.innerHeight - header.height,
        board: window.innerHeight * 2 - header.height
    }
    movement.goTo(movement.currentSection);
}
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
    selectedNode: undefined,

    init: function() {
        
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
    }
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
                nodeMetas = item; }
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
            relation: nodeMetas.group,
            title: nodeLinkTitle,
            hidden: nodeMetas.hidden,
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

    network.visualisation.selectNodes([nodeId]);
    network.selectedNode = Number(nodeId);

    // renommer la page web
    document.title = nodeMetas.label + ' - Otetosphère';

    if (mustZoom) {zoomToNode(nodeId);}

    fiche.fill(nodeMetas, findConnectedNodes(nodeId));
    fiche.open();

    return true;
}
var search = {
    input: document.querySelector('#search'),
    resultContent: document.querySelector('#search-result'),
    options: {
        includeScore: true,
        keys: ['label']
    },    

    showResult: function(resultObj) {
        var nodeId = resultObj.item.id;
        var nodeLabel = resultObj.item.label;

        var resultElement = document.createElement('li');
        resultElement.classList.add('search__result');
        resultElement.textContent = nodeLabel;
        search.resultContent.appendChild(resultElement);

        resultElement.addEventListener('click', () => {

            if (network.selectedNode !== undefined && network.selectedNode == nodeId) {
                // si cette id correpond à celle du nœeud selectionné
                return;
            }
            
            search.input.value = nodeLabel;
            this.cleanResultContent();

            switchNode(nodeId);
            historique.actualiser(nodeId);
        });
    },
    reset: function() {
        search.input.value = ''; // form value
        this.cleanResultContent();
    },
    cleanResultContent: function() {
        search.resultContent.innerHTML = ''; // results
    }
}

search.reset();

search.input.addEventListener('focus', () => {

    if (!network.isLoaded) { return; }
    
    const fuse = new Fuse(getNoHiddenNodes(), search.options);

    search.input.addEventListener('input', () => {

        search.resultContent.innerHTML = '';

        if (search.input.value == '') { return; }

        const resultList = fuse.search(search.input.value);
        
        if (resultList.length > 5) {
            // si plus de 5 résultats, limiter à 5
            var nbResult = 5;
        } else {
            // sinon garder l nombre de résultats
            var nbResult = resultList.length;
        }
        
        for (let i = 0; i < nbResult; i++) {
            search.showResult(resultList[i]); }
    });
});

function getNoHiddenNodes() {
    var activeNodes = network.data.nodes.get({
        filter: function (item) {
            return (item.hidden !== true);
        }
    });
    return activeNodes;
}
var langage = {
    flags: [document.querySelector('#lang-fr'), document.querySelector('#lang-en')],
    actual: 'Fr',
    translateAll: function() {
        document.querySelectorAll('[data-lang-' + langage.actual.toLowerCase() + ']').forEach(elt => {
            eval('elt.textContent = elt.dataset.lang' + langage.actual);
        });
    }
}

document.querySelector('[data-lang="' + langage.actual + '"]')
    .classList.add('lang-box__flag--active');

langage.flags.forEach(flag => {
    flag.addEventListener('click', (e) => {
        var flagCliked = e.target;
        
        if (flagCliked.dataset.lang == langage.actual) {
            // si le bouton flag cliqué active la langue déjà active
            return;
        }

        // désactiver la surbrillance du flag de la précédante langue
        document.querySelector('[data-lang="' + langage.actual + '"]')
            .classList.remove('lang-box__flag--active');
        // activer la surbrillance du flag de l'actuelle langue
        flagCliked.classList.add('lang-box__flag--active');

        langage.actual = flagCliked.dataset.lang;

        langage.translateAll();

        if (fiche.memory !== undefined) {
            fiche.fill(fiche.memory.activeNodeMetas, fiche.memory.activeNodeConnectedList); }
    });
});
var commands = {
    zoom: {
        btnPlus: document.querySelector('#zoom-plus'),
        btnMoins: document.querySelector('#zoom-moins'),
        btnReinitialiser: document.querySelector('#zoom-general'),
        interval: 0.2
    }
}

commands.zoom.btnPlus.addEventListener('click', () => {
    if (!network.isLoaded) { return; }

    var scale = network.visualisation.getScale() + commands.zoom.interval;

    if (scale >= network.zoom.max) {
        // si l'échelle de zoom dépasse le maximum, elle s'y limite
        scale = network.zoom.max
    }

    network.visualisation.moveTo({ scale: scale });
});

commands.zoom.btnMoins.addEventListener('click', () => {
    if (!network.isLoaded) { return; }

    var scale = network.visualisation.getScale() - commands.zoom.interval;

    if (scale <= network.zoom.min) {
        // si l'échelle de zoom dépasse le minium, elle s'y limite
        scale = network.zoom.min
    }

    network.visualisation.moveTo({ scale: scale });
});

commands.zoom.btnReinitialiser.addEventListener('click', backToCenterView);