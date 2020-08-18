var board = {
    content: document.querySelector('#board-content'),
    wrapper: document.querySelector('#board-wrapper'),
    engine: new Board,

    init: function() {
        this.engine.empty();

        network.data.nodes.forEach((entity) => {
            var card = new Card;
            card.id = entity.id;
            card.label = entity.label;
            card.labelFirstLetter = entity.sortName.charAt(0);
            card.title = entity.title;
            card.img = entity.image;

            if (entity.hidden === false) {
                this.engine.cards.push(card); }

        }, { order: 'sortName' });

        this.engine.init();
    }
}

function Card() {
    this.id = null;
    this.label = 'No name';
    this.labelFirstLetter = undefined;
    this.title = 'No title';
    this.text = null;
    this.domElt = document.createElement('article');
}

Card.prototype.inscribe = function(container) {
    this.domElt.classList.add('card');
    this.domElt.innerHTML = 
    `<div class="card__presentation">
        <img class="card__img" src="${this.img}" alt="${this.label}">
        <div class="card__identite">
            <h3 class="card__label">${this.label}</h3>
        </div>
    </div>
    <h4 class="card__titre">${this.title}</h4>`;

    container.appendChild(this.domElt);

    this.domElt.addEventListener('click', () => {
        switchNode(this.id)
        historique.actualiser(this.id);
    });
}

function Board() {
    this.domElt = document.querySelector('#board-content');
    this.domLetterList = document.querySelector('#board-alphabetic');
    this.cards = [];
    this.letterList = [];
    this.alphaSpace = [];
}

Board.prototype.bundle = function() {
    var letter = this.cards[0].labelFirstLetter;
    var letterBundle = [];
    
    this.cards.forEach(card => {
        if (card.labelFirstLetter != letter) {
            this.alphaSpace.push(letterBundle);
            letterBundle = [];
            letter = card.labelFirstLetter;
        }

        letterBundle.push(card);
    });

    this.alphaSpace.push(letterBundle);
}

Board.prototype.fill = function() {
    this.alphaSpace.forEach(letterStack => {
        var letter = letterStack[0].labelFirstLetter;
        this.letterList.push(letter);

        var divider = document.createElement('div');
        divider.id = 'letter-' + letter;
        divider.classList.add('board__section-title');
        divider.textContent = letter;
        this.domElt.appendChild(divider);

        var cardStack = document.createElement('div');
        cardStack.classList.add('board__section');
        this.domElt.appendChild(cardStack);

        letterStack.forEach(card => {
            card.inscribe(cardStack);
        });
    });
}

Board.prototype.listLetters = function() {
    this.letterList.forEach(letter => {
        var listElt = document.createElement('li');
        listElt.classList.add('sort-alphabetic-list__caracter');
        listElt.textContent = letter;
        this.domLetterList.appendChild(listElt);

        listElt.addEventListener('click', () => {
            board.wrapper.scrollTop = 0;
            board.wrapper.scrollTo({
                top: document.querySelector('#letter-' + letter).getBoundingClientRect().y - headerHeight,
                behavior: 'smooth'
            });
        })
    });
}

Board.prototype.init = function() {
    this.bundle();
    this.fill();
    this.listLetters();
}

Board.prototype.empty = function() {
    this.domElt.innerHTML = '';
    this.domLetterList.innerHTML = '';

    this.cards = [];
    this.alphaSpace = [];
    this.letterList = [];
}
Promise.all([
    fetch('/otletosphere/data/entite.json'), // = data[0]
    fetch('/otletosphere/data/lien.json') // = data[1]
]).then(function(data) {
    // get data
    const entites = data[0]
    const liens = data[1]
    
    Promise.all([
        entites.json(),
        liens.json()
    ]).then(function(data) {
        // get JSON from data
        const entites = data[0]
        const liens = data[1]

        network.data.nodes.add(
            entites.map(function(entite) {
                var entiteObj = {
                    // entite metas
                    id: entite.id,
                    label: entite.label,
                    title: entite.titre,
                    title_fr: entite.titre,
                    title_en: entite.titre_en,
                    group: entite.relation_otlet,
                    image: '/otletosphere/assets/photos/' + entite.photo,
                    genre: entite.genre,
                    annee_naissance: entite.annee_naissance,
                    annee_mort: entite.annee_mort,
                    pays: entite.pays,
                    pays_fr: entite.pays,
                    pays_en: entite.pays_en,
                    domaine: entite.domaine,
                    domaine_fr: entite.domaine,
                    domaine_en: entite.domaine_en,
                    description: entite.description,
                    description_fr: entite.description,
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
                        color: '#fff',
                        strokeWidth: 2,
                        strokeColor: '#000'
                    }
                };
            
                if (entite.nom) {
                    var splitName = entite.nom.split(' ', 2);
                    // rejet de la particule "de"
                    if (splitName.length == 2 && splitName[0] == 'de') {
                        entiteObj.sortName = splitName[1];
                    } else {
                        entiteObj.sortName = entite.nom;
                    }
                } else {
                    entiteObj.sortName = entite.label
                }

                return entiteObj;
            })
        );

        network.data.edges.add(
            liens.map(function(lien) {
                var lienObj = {
                    id: lien.id,
                    from: lien.from,
                    to: lien.to,
                    title: lien.label,
                    title_fr: lien.label,
                    title_en: lien.label_en
                };

                if (lien.from == 1 || lien.to == 1) {
                    // si le lien a une relation avec Otlet
                    lienObj.color = null; }
                else {
                    lienObj.color = 'gray'; }

                return lienObj;
            })
        );

        network.init();

    });
});
var fiche = {
    body: document.querySelector('#fiche'),
    content: document.querySelector('#fiche-content'),
    entete: document.querySelector('#fiche-entete'),
    currentEntityId: undefined,
    toggle: document.querySelector('#fiche-toggle'),
    isOpen: false,
    fields: {
        wikiLink: document.querySelector('#fiche-wiki-link'),
        img: document.querySelector('#fiche-meta-img'),
        label: document.querySelector('#fiche-meta-label'),
        date: document.querySelector('#fiche-meta-date'),
        titre: document.querySelector('#fiche-meta-titre'),
        pays: document.querySelector('#fiche-meta-pays'),
        domaine: document.querySelector('#fiche-meta-domaine'),
        description: document.querySelector('#fiche-meta-description'),
        connexion: document.querySelector('#fiche-connexion')
    },

    fixer: function(bool) {
        if (bool) { fiche.body.classList.add('lateral--fixed'); }
        else { fiche.body.classList.remove('lateral--fixed'); }
    },
    open: function() {
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
    fill: function() {
        var nodeMetas = getNodeMetas(network.selectedNode);
        var nodeConnectedList = findConnectedNodes(network.selectedNode);

        // affichage du contenant
        this.content.classList.add('fiche__content--visible');

        // remplissage métadonnées
        this.setMeta(nodeMetas.label, this.fields.label);
        this.setMeta(nodeMetas.title, this.fields.titre);
        this.setImage(nodeMetas.image, nodeMetas.label);
        this.setDates(nodeMetas.annee_naissance, nodeMetas.annee_mort);
        this.setWikiLink(nodeMetas.lien_wikipedia);
        this.setMeta(nodeMetas.pays, this.fields.pays);
        this.setMeta(nodeMetas.domaine, this.fields.domaine);
        this.setMeta(nodeMetas.description, this.fields.description);

        this.setConnexion(nodeConnectedList);
    }
}

fiche.toggle.addEventListener('click', () => {
    // toggle close and open du lateral fiche
    if (fiche.isOpen) { fiche.close(); }
    else { fiche.open(); }
});

const overflow = document.querySelector('#overflow');

fiche.fields.img.addEventListener('click', () => {
    // au clic sur l'image : zoom sur le nœud contenu dans la mémoire
    zoomToNode(network.selectedNode);
});
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
MicroModal.init();
document.querySelector('#about-btn').addEventListener('click', () => {
    MicroModal.show('modal-about');
})

var navigation = {
    links: document.querySelectorAll('[data-section]'),
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

const headerHeight = 140;

var movement = {
    currentSection: undefined,
    offset: {
        graph: 0,
        board: window.innerHeight + headerHeight
    },
    goTo: function(section) {

        navigation.activLink(section);
        this.currentSection = section;

        switch (section) {
            case 'reseau':
                this.scroll(this.offset.graph);

                fiche.fixer(true);
                fiche.canClose(true);
                // MicroModal.close('modal-about');
                break;
                
            case 'fiches':
                this.scroll(this.offset.board);

                fiche.fixer(true);
                fiche.canClose(false);
                fiche.open();
                // MicroModal.close('modal-about');
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
    movement.goTo(movement.currentSection);
}
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
        
        network.visualisation.on('deselectNode', function() {
            network.selectedNode = undefined;
        });
        
        network.visualisation.on('hoverNode', function(params) {
            var idNodeHovered = params.node;
        
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

        zoom.btnPlus.addEventListener('click', zoomIn);
        zoom.btnMoins.addEventListener('click', zoomOut);
        zoom.btnReinitialiser.addEventListener('click', backToCenterView);
        
        board.init();
        search.input.addEventListener('focus', search.init);
        filter.init();
        
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
            var color = '154, 60, 154'; break;
        case 'contemporain':
            var color = '128,128,128'; break;
        case 'collaborateur':
            var color = '97, 172, 97'; break;
        case 'opposant':
            var color = '250, 128, 114'; break;
        case 'famille':
            var color = '102, 179, 222'; break;
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

    fiche.fill();
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
    },
    init: function() {
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
    }
}

search.reset();

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
            eval('elt.innerHTML = elt.dataset.lang' + langage.actual);
        });
    }
}

// active actual langage button
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

        switch (langage.actual) {
            case 'Fr':
                network.data.nodes.update(
                    network.data.nodes.map(entite => ({
                            id: entite.id,
                            title: entite.title_fr,
                            description: entite.description_fr,
                            domaine: entite.domaine_fr,
                            pays: entite.pays_fr,
                        })
                    )
                );
                network.data.edges.update(
                    network.data.edges.map(lien => ({
                            id: lien.id,
                            title: lien.title_fr,
                        })
                    )
                );
            break;

            case 'En':
                network.data.nodes.update(
                    network.data.nodes.map(entite => ({
                            id: entite.id,
                            title: entite.title_en,
                            description: entite.description_en,
                            domaine: entite.domaine_en,
                            pays: entite.pays_en,
                        })
                    )
                );
                network.data.edges.update(
                    network.data.edges.map(lien => ({
                            id: lien.id,
                            title: lien.title_en,
                        })
                    )
                );
            break;
        }

        fiche.fill();

    });
});
var zoom = {
    btnPlus: document.querySelector('#zoom-plus'),
    btnMoins: document.querySelector('#zoom-moins'),
    btnReinitialiser: document.querySelector('#zoom-general'),
    interval: 0.1
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
}

function zoomIn() {
    var scale = network.visualisation.getScale() + zoom.interval;

    if (scale >= network.zoom.max) {
        // si l'échelle de zoom dépasse le maximum, elle s'y limite
        scale = network.zoom.max
    }

    network.visualisation.moveTo({ scale: scale });
}

function zoomOut() {
    var scale = network.visualisation.getScale() - zoom.interval;

    if (scale <= network.zoom.min) {
        // si l'échelle de zoom dépasse le minium, elle s'y limite
        scale = network.zoom.min
    }

    network.visualisation.moveTo({ scale: scale });
}

function backToCenterView() {
    network.visualisation.fit({ animation: true });
}