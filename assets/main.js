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

function sortByCaracter(sortCaracter) {
    network.data.nodes.forEach(function(data) {
        var firstCaracterFromLabel = data.label.charAt(0);
        if (firstCaracterFromLabel != sortCaracter && data.hidden != true) {
            // caché s'il n'a pas la première lettre et qu'il n'est pas déjà caché
            network.data.nodes.update({id: data.id, hidden: true});
        }
    },);
}


function createCard(entite) {

    if (entite.hidden == true) { return; }

    var firstCaracterFromLabel = entite.sortName.charAt(0);
    if (firstCaracterFromLabel != board.sort.lastCaracter) {
        // si l'on change de caractère : enregistrement d'une nouvelle section de cartes
        board.sort.lastCaracter = firstCaracterFromLabel;

        var caracterSection = document.createElement('div');
        caracterSection.classList.add('board__section');

        board.sort.caracters.push({
            caracter: firstCaracterFromLabel,
            cardsContent: caracterSection
        });
    }

    var photo = '<img class="card__img" src="' + entite.image + '" alt="' + entite.label + '" />';
    var label = '<h3 class="card__label">' + entite.label + '</h3>';
    var dates = null;
    if (entite.metas.annee_naissance !== null) {
        if (entite.metas.annee_mort !== null) {
            var dateAjoutMort = ' - ' + entite.metas.annee_mort; }

        dates = ['<span class="card__date">(', entite.metas.annee_naissance,
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
        switchNode(entite.id, false)
        historique.actualiser(entite.id);
    });
}
/**
 * ============
 * Mouvements réseau
 * ============
 */

var commands = {
    visualiser: {
        btn: document.querySelector('#zoom-selection'),
        allow: function() {
            this.btn.classList.remove('fiche__btn-control--hidde');
            this.btn.disabled = false;
        }
    },
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
        scale = network.zoom.max }

    network.visualisation.moveTo({ scale: scale });
});

commands.zoom.btnMoins.addEventListener('click', () => {
    if (!network.isLoaded) { return; }

    var scale = network.visualisation.getScale() - commands.zoom.interval;

    if (scale <= network.zoom.min) {
        scale = network.zoom.min }

    network.visualisation.moveTo({ scale: scale });
});

commands.zoom.btnReinitialiser.addEventListener('click', backToCenterView);

commands.visualiser.btn.addEventListener('click', () => {
    zoomToNode(fiche.showingNodeMetas.id);
    movement.goTo('reseau');
});

/**
 * ============
 * Filtres
 * ============
 */

var filter = {
    btnsGroups: document.querySelectorAll('.btn-group'),
    init: function() {
        this.btnsGroups.forEach(btn => {
            var group = btn.dataset.group;
        
            btn.style.backgroundColor = chooseColor(group);
        
            let isActiveGroup = true;
        
            btn.addEventListener('click', () => {
        
                if (!network.isLoaded) { return; }
        
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
        
                search.reset();
                board.init();
            
            });
        });
    },
    translate: function() {
        switch (langage.actual) {
            case 'fr':
                this.btnsGroups.forEach(btn => {
                    btn.textContent = btn.dataset.langFr; });
                break;
            case 'en':
                this.btnsGroups.forEach(btn => {
                    btn.textContent = btn.dataset.langEn; });
                break;
        }
    }
}

filter.init();
var fiche = {
    body: document.querySelector('#fiche'),
    content: document.querySelector('#fiche-content'),
    entete: document.querySelector('#fiche-entete'),
    showingNodeMetas: null,
    contol: {
        open: document.querySelector('#fiche-open'),
        close: document.querySelector('#fiche-close')
    },
    isOpen: false,
    fields: {
        // champs du fiche
        wikiLink: document.querySelector('#fiche-wiki-link'),
        img: document.querySelector('#fiche-meta-img'),
        label: document.querySelector('#fiche-meta-label'),
        date: document.querySelector('#fiche-meta-date'),
        pays: document.querySelector('#fiche-meta-pays'),
        discipline: document.querySelector('#fiche-meta-discipline'),
        description: document.querySelector('#fiche-meta-description'),
        connexion: document.querySelector('#fiche-connexion')
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
        if (movement.currentSection === 'fiches') { return; }
        
        fiche.body.classList.remove('lateral--active');
        this.isOpen = false;
    },
    canClose: function(bool) {
        if (bool) { this.contol.close.classList.remove('fiche__btn-control--hidde'); }
        else { this.contol.close.classList.add('fiche__btn-control--hidde'); }
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
    setWikiLink: function(wikiLink) {
        if (wikiLink === null) { return; }
        this.fields.wikiLink.classList.add('fiche__wiki-link--visible')
        this.fields.wikiLink.setAttribute('href', wikiLink)
    },
    setPays: function(entitePays) {
        if (entitePays === null) { return; }
        this.fields.pays.innerHTML = entitePays;
    },
    setDiscipline: function(entiteDiscipline) {
        if (entiteDiscipline === null) { return; }
        this.fields.discipline.innerHTML = entiteDiscipline;
    },
    setDescription: function(entiteDescription) {
        if (entiteDescription === null) { return; }
        this.fields.description.innerHTML = entiteDescription;
    },
    setConnexion: function(nodeConnectedList, entiteLabel) {
        if (nodeConnectedList === false) { return; }
        this.fields.connexion.innerHTML = '';

        var list = document.createElement('ul');
        list.classList.add('connexions__list');
        this.fields.connexion.appendChild(list);

        for (let i = 0; i < nodeConnectedList.length; i++) {
            const connexion = nodeConnectedList[i];

            if (connexion.label == entiteLabel) { continue; }

            var listElt = document.createElement('li');
            listElt.classList.add('connexions__elt');
            listElt.textContent = connexion.label;
            this.fields.connexion.appendChild(listElt);

            var puceColored = document.createElement('span');
            puceColored.classList.add('connexions__puce');
            puceColored.style.backgroundColor = chooseColor(connexion.relation);
            listElt.prepend(puceColored);

            listElt.addEventListener('click', () => {
                var id = connexion.id;

                switchNode(id);
                historique.actualiser(id);
            });

            if (connexion.title !== null) {
                listElt.setAttribute('title', connexion.title);

                listElt.addEventListener('mouseenter', (e) => {

                    overflow.classList.add('overflow--active');
                    overflow.style.left = e.pageX + 20 + 'px';
                    overflow.style.top = e.pageY - overflow.offsetHeight + 'px';
                    overflow.textContent = connexion.title;
                })

                listElt.addEventListener('mouseout', () => {
                    overflow.classList.remove('overflow--active');
                })
            }
        }
    },
    fill: function(nodeMetas, nodeConnectedList = false) {
        // affichage du contenant
        this.content.classList.add('fiche__content--visible');
        commands.visualiser.allow();
        this.showingNodeMetas = nodeMetas;

        // remplissage métadonnées
        this.setImage(nodeMetas.image, nodeMetas.label);
        this.setLabel(nodeMetas.label);
        this.setDates(nodeMetas.annee_naissance, nodeMetas.annee_mort);
        this.setWikiLink(nodeMetas.lien_wikipedia);

        switch (langage.actual) {
            case 'fr':
                this.setPays(nodeMetas.pays);
                this.setDiscipline(nodeMetas.discipline);
                this.setDescription(nodeMetas.description);
                break;
            case 'en':
                this.setPays(nodeMetas.pays_en);
                this.setDiscipline(nodeMetas.discipline_en);
                this.setDescription(nodeMetas.description_en);
                break;
        }

        // remplissage nœuds connectés
        this.setConnexion(nodeConnectedList, nodeMetas.label);
        
    }
}

Object.values(fiche.contol).forEach(btn => {
    btn.addEventListener('click', () => {
        // toggle du lateral fiche
        if (fiche.isOpen) { fiche.close(); }
        else { fiche.open(); }
    });
});

const overflow = document.querySelector('#overflow');
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

var navigation = {
    links: document.querySelectorAll('.navigation__link'),
    activLink: function(section) {
        document.querySelector('[data-section="' + movement.currentSection + '"]')
            .classList.remove('navigation__link--active');

        document.querySelector('[data-section="' + section + '"]')
            .classList.add('navigation__link--active');
    },
    translate: function() {
        switch (langage.actual) {
            case 'fr':
                this.links.forEach(link => {
                    link.textContent = link.dataset.langFr; });
                break;
            case 'en':
                this.links.forEach(link => {
                    link.textContent = link.dataset.langEn; });
                break;
        }
    }
}

navigation.links.forEach(link => {
    link.addEventListener('click', (e) => {
        if (movement.currentSection === e.target.dataset.section) { return; }
        movement.goTo(e.target.dataset.section);
    })
});

var headerHeight = interface.headerFixeur.clientHeight + 8;

var movement = {
    currentSection: 'reseau',
    offset: {
        introduction: 0,
        graph: introduction.clientHeight - headerHeight,
        board: introduction.clientHeight * 2 - headerHeight
    },
    goTo: function(section) {
        switch (section) {
            case 'a_propos':
                this.scroll(0);
                interface.fix(false);
                navigation.activLink(section);
                this.currentSection = section;
                break;
                
            case 'reseau':
                this.scroll(this.offset.graph);
                interface.fix(true);
                navigation.activLink(section);
                this.currentSection = section;

                fiche.canClose(true);
                break;
                
            case 'fiches':
                this.scroll(this.offset.board);
                interface.fix(true);
                navigation.activLink(section);
                this.currentSection = section;

                fiche.open();
                fiche.canClose(false);
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
    headerHeight = interface.headerFixeur.clientHeight;
    movement.offset = {
        introduction: 0,
        graph: introduction.clientHeight - headerHeight,
        board: introduction.clientHeight * 2 - headerHeight
    }
    movement.goTo(movement.currentSection);
}

var langage = {
    flags: {
        french: document.querySelector('#lang-fr'),
        english: document.querySelector('#lang-en')
    },
    actual: 'fr'
}

Object.values(langage.flags).forEach(flag => {
    flag.addEventListener('click', (e) => {
        
        if (e.target.dataset.lang == langage.actual) { return; }

        e.target.classList.add('lang-box__flag--active');
        document.querySelector('[data-lang="' + langage.actual + '"]')
            .classList.remove('lang-box__flag--active');
        
            
        langage.actual = e.target.dataset.lang;
        
        filter.translate();
        navigation.translate();

        if (fiche.showingNodeMetas !== null) {
            fiche.fill(fiche.showingNodeMetas); }
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
    
        network.nodeIds = network.data.nodes.getIds();
        
            // Évent au clic sur un nœud
        network.visualisation.on('selectNode', function(nodeMetasBrutes) {
            var id = nodeMetasBrutes.nodes[0];

            if (id === undefined) {
                return; }
            
            if (network.selectedNode !== undefined && network.selectedNode == id) {
                return; }

            switchNode(id);
            historique.actualiser(id);
        });
        // Évent au clic sur l'espace blanc
        network.visualisation.on('deselectNode', function(params) {
            network.selectedNode = undefined;
        });
    
        // Évent au survol : les autres nœuds deviennent translucide
        network.visualisation.on('hoverNode', function(params) {
            activNodeId = params.node;

            var ids = network.nodeIds;

            var noTransparentNodesIds = [activNodeId, network.selectedNode];
            noTransparentNodesIds = noTransparentNodesIds.concat(network.visualisation.getConnectedNodes(activNodeId));
            if (network.selectedNode !== undefined) {
                noTransparentNodesIds = noTransparentNodesIds.concat(network.visualisation.getConnectedNodes(network.selectedNode));
            }
            

            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                if (noTransparentNodesIds.indexOf(id) !== -1) { continue; }
                var groupName = network.data.nodes.get(id).group;
                
                network.data.nodes.update({
                    id: id,
                    color: chooseColor(groupName, true),
                    opacity: 0.4,
                    font: {color: 'rgba(0, 0, 0, 0.5)'}
                });
            }
            
        });
        // Évent fin de survol : les nœuds retrouvent leur couleur initiale
        network.visualisation.on('blurNode', function(params) {
            var ids = network.nodeIds;

            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                if (id == params.node) { continue; }
                network.data.nodes.update({
                    id: id,
                    color: false,
                    opacity: 1,
                    font: {color: 'black'}
                })
            }
            
        });

        // Évent au zoom
        network.visualisation.on('zoom', function(params) {

            // limiter le de-zoom
            if (params.scale <= network.zoom.min) {
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
        board.init();

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
    nodeList.push(nodeObject);
}

let edgeList = [];
function createEdge(lien) {
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
    var connectedNodesList = [];
    var nodesConnected = network.visualisation.getConnectedNodes(nodeId);
    var edgesConnected = network.visualisation.getConnectedEdges(nodeId);


    for (let i = 0; i < nodesConnected.length; i++) {
        const id = nodesConnected[i];
        var nodeConnected = getNodeMetas(id);
        var titleOfLink = network.data.edges.get(edgesConnected[i]).title;
        connectedNodesList.push({id: nodeConnected.id, label: nodeConnected.label, relation: nodeConnected.relation, title: titleOfLink});
    }
    
    // nodesConnected.forEach(id => {
    // });
    return connectedNodesList;
}

function zoomToNode(id) {
    id = Number(id);
    // Trouver le nœud et zommer sur lui
    var nodeCoordonates = network.visualisation.getPosition(id);
    
    // si le nœeud est hidden, interrompre
    if (network.data.nodes.get(id).hidden === true) { return; }
    
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
    fiche.open();

    return true;
}

function allNodesVisible() {
    if (!network.isLoaded) { return; }

    network.data.nodes.forEach(function(data) {
        network.data.nodes.update({id: data.id, hidden: false}); });
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