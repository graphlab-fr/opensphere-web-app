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
            this.btn.classList.remove('lateral__btn-control--hidde');
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

commands.visualiser.btn.addEventListener('click', () => {
    zoomToNode(fiche.activeNodeMetas.id);
    movement.goTo('reseau');
});

/**
 * ============
 * Filtres
 * ============
 */

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
filter.volet.btnOpen.addEventListener('click', () => {
    filter.volet.body.classList.add('lateral--active'); });
filter.volet.btnClose.addEventListener('click', () => {
    filter.volet.body.classList.remove('lateral--active'); });
var fiche = {
    body: document.querySelector('#fiche'),
    content: document.querySelector('#fiche-content'),
    entete: document.querySelector('#fiche-entete'),
    activeNodeMetas: null,
    contol: {
        open: document.querySelector('#fiche-open'),
        close: document.querySelector('#fiche-close')
    },
    isOpen: false,
    fields: {
        wikiLink: document.querySelector('#fiche-wiki-link'),
        img: document.querySelector('#fiche-meta-img'),
        label: document.querySelector('#fiche-meta-label'),
        date: document.querySelector('#fiche-meta-date'),
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
        this.fields.img.setAttribute('src', entitePhoto);
        this.fields.img.setAttribute('alt', 'photo de ' + entiteLabel);
    },
    setLabel: function(entiteLabel) {
        if (entiteLabel === null) {  
            this.fields.label.textContent = '';
        } else {
            this.fields.label.textContent = entiteLabel;
        }
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
            mort = ' - <time class="fiche__dates" datetime="' + entiteDateMort + '">' +
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
    setPays: function(entitePays) {
        if (entitePays === null) {
            this.fields.pays.innerHTML = '';
        } else {
            this.fields.pays.innerHTML = entitePays;
        }
    },
    setDiscipline: function(entiteDiscipline) {
        if (entiteDiscipline === null) {
            this.fields.discipline.innerHTML = '';
        } else {
            this.fields.discipline.innerHTML = entiteDiscipline;
        }
    },
    setDescription: function(entiteDescription) {
        if (entiteDescription === null) {
            this.fields.description.innerHTML = '';
        } else {
            this.fields.description.innerHTML = entiteDescription;
        }
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
    fill: function(nodeMetas, nodeConnectedList = null) {
        // affichage du contenant
        this.content.classList.add('fiche__content--visible');
        commands.visualiser.allow();
        this.activeNodeMetas = nodeMetas;

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

        this.setConnexion(nodeConnectedList);
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
    height: 115,

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
        movement.goTo(e.target.dataset.section);
    })
});

var movement = {
    currentSection: undefined,
    offset: {
        introduction: 0,
        graph: introduction.clientHeight - header.height,
        board: introduction.clientHeight * 2 - header.height
    },
    goTo: function(section) {

        if (section == this.currentSection) { return; }

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

var langage = {
    flags: {
        french: document.querySelector('#lang-fr'),
        english: document.querySelector('#lang-en')
    },
    actual: 'fr'
}

Object.values(langage.flags).forEach(flag => {
    flag.addEventListener('click', (e) => {
        var flag = e.target;
        
        if (flag.dataset.lang == langage.actual) {
            // si le bouton flag cliqué active la langue active
            return;
        }

        // désactiver la surbrillance du flag de la précédante langue
        document.querySelector('[data-lang="' + langage.actual + '"]')
            .classList.remove('lang-box__flag--active');
        // activer la surbrillance du flag de l'actuelle langue
        flag.classList.add('lang-box__flag--active');

        langage.actual = flag.dataset.lang;
        
        filter.translate();
        navigation.translate();

        if (fiche.activeNodeMetas !== null) {
            fiche.fill(fiche.activeNodeMetas); }
    });
});

movement.goTo('reseau');

window.onresize = function() {
    movement.offset = {
        introduction: 0,
        graph: introduction.clientHeight - header.height,
        board: introduction.clientHeight * 2 - header.height
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
                nodeMetas.hidden = item.hidden;
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

    network.selectedNode = nodeId;

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