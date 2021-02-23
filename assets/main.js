var board = {
    content: document.querySelector('#board-content'),
    wrapper: document.querySelector('#board-wrapper'),
    engine: new Board,

    init: function() {
        this.engine.empty();

        // nodes become cards in alphabetical order
        network.data.nodes.forEach((entity) => {
            var card = new Card;
            card.id = entity.id;
            card.label = entity.label;
            card.labelFirstLetter = entity.sortName.charAt(0);
            card.title = (entity.title || '');
            card.img = entity.image;

            if (entity.hidden === false) {
                this.engine.cards.push(card); }

        }, { order: 'sortName' });

        this.engine.init();
    }
}

/**
 * Init instance of Card.
 * @constructs Card
 * @param {number} id - Entity id
 * @param {string} label - Entity label
 * @param {string} labelFirstLetter - Letter for alphabetical diplaying
 * @param {string} title - Entity title
 * @param {HTMLElement} domElt - <article> who contain card HTML
 */

function Card() {
    this.id = null;
    this.label = 'No name';
    this.labelFirstLetter = undefined;
    this.title = '';
    this.domElt = document.createElement('article');
}

/**
 * Make card HTML & appendChild in its container
 * @param {HTMLElement} container - Container for cards linked by the same first letter
 */

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
        switchNode(this.id);
        historique.actualiser(this.id);
    });
}

/**
 * Init instance of Card.
 * @constructs Card
 * @param {array} cards - Cards objects
 * @param {array} letterList - First letters list, feed by Board.fill()
 * @param {array} alphaSpace - For store same first letter cards in groups, feed by Board.bundle()
 */

function Board() {
    this.domElt = document.querySelector('#board-content');
    this.domLetterList = document.querySelector('#board-alphabetic');
    this.cards = [];
    this.letterList = [];
    this.alphaSpace = [];
}

/**
 * For each card, verif the first letter. If it change between
 * two card put the second and others in a new array (group) while waiting
 * for another change
 */

Board.prototype.bundle = function() {
    var letter = this.cards[0].labelFirstLetter; // current letter
    var letterBundle = []; // same first letter cards array
    
    this.cards.forEach(card => {
        if (card.labelFirstLetter != letter) {
            // first letter has change
            this.alphaSpace.push(letterBundle);
            letterBundle = [];
            letter = card.labelFirstLetter;
        }

        letterBundle.push(card);
    });

    this.alphaSpace.push(letterBundle);
}

/**
 * For each cards groups, appendCild the Board elements
 * and the Cards prototypes
 */

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

/**
 * Generate the nav bar with all context letters
 */

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

/**
 * Delete all Board elements & data
 */

Board.prototype.empty = function() {
    this.domElt.innerHTML = '';
    this.domLetterList.innerHTML = '';

    this.cards = [];
    this.alphaSpace = [];
    this.letterList = [];
}
Promise.all([
    fetch('data/entite.json'), // = data[0]
    fetch('data/lien.json') // = data[1]
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
                    // entite metas, default langage
                    id: entite.id,
                    label: entite.label,
                    title: entite.titre,
                    group: entite.relation_otlet,
                    image: './assets/photos/' + entite.photo,
                    genre: entite.genre,
                    annee_naissance: entite.annee_naissance,
                    annee_mort: ((!entite.annee_mort) ? undefined : ' - ' + entite.annee_mort),
                    pays: entite.pays,
                    domaine: entite.domaine,
                    description: entite.description,
                    lien_wikipedia: entite.lien_wikipedia,
                    // translated metas
                    Fr: {
                        title: entite.titre,
                        pays: entite.pays,
                        domaine: entite.domaine,
                        description: entite.description
                    },
                    En: {
                        title: entite.titre,
                        pays: entite.pays_en,
                        domaine: entite.domaine_en,
                        description: entite.description_en
                    },
        
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

                /**
                 * We set a sortName value without the 'de' particle
                 * sortName value is used on board.js for alphabetical ordering
                 */

                if (entite.nom) {
                    var splitName = entite.nom.split(' ', 2);

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

                    Fr: {
                        title: lien.label
                    },
                    En: {
                        title: lien.label_en
                    },
                };

                if (lien.from !== 1 && lien.to !== 1) {
                    // if link not about Otlet -> gray color
                    lienObj.color = 'gray'; }

                return lienObj;
            })
        );

        network.init();

    });
});
const overflow = document.querySelector('#overflow');

var fiche = {
    body: document.querySelector('#fiche'),
    content: document.querySelector('#fiche-content'),
    entete: document.querySelector('#fiche-entete'),
    toggle: document.querySelector('#fiche-toggle'), // arrow button
    isOpen: false,
    fields: {
        head: document.querySelector('#fiche-head'),
        wikiLink: document.querySelector('#fiche-wiki-link'),
        img: document.querySelector('#fiche-meta-img'),
        connexion: document.querySelector('#fiche-connexion'),
        permalien: document.querySelector('#fiche-permalien')
    },
    domFields: document.querySelectorAll('#fiche [data-meta]'),

    /** position; fixed; the description bar on Board view */
    fixer: function(bool) {
        if (bool) { fiche.body.classList.add('lateral--fixed'); }
        else { fiche.body.classList.remove('lateral--fixed'); }
    },
    /** open description bar */
    open: function() {
        this.toggle.classList.add('fiche__toggle-btn--active');
        fiche.body.classList.add('lateral--active');
        this.isOpen = true;
    },
    /** close description bar */
    close: function() {
        if (movement.currentSection === 'fiches') { return; }
        
        this.toggle.classList.remove('fiche__toggle-btn--active');
        fiche.body.classList.remove('lateral--active');
        this.isOpen = false;
    },
    /** show/hide closure button from the description bar */
    canClose: function(bool) {
        if (bool) { this.toggle.classList.remove('d-none'); }
        else { this.toggle.classList.add('d-none'); }
    },
    /**
     * Show entity image on description bar
     * @param {string} photoPath - photo path
     * @param {string} entiteLabel - Entity name for alt img attribute
     */
    setImage: function(photoPath, entiteLabel) {
        if (!this.fields.img) { return ; }
        if (!photoPath) { return this.fields.img.style.display = 'none'; }

        this.fields.img.setAttribute('src', photoPath);
        this.fields.img.setAttribute('alt', 'photo de ' + entiteLabel);
    },
    /**
     * Set the entity link to Wikipedia on description bar 
     * @param {string} wikiLink - URL adress
     */
    setWikiLink: function(wikiLink) {
        if (!this.fields.wikiLink) { return ; }

        if (!wikiLink) {
            this.fields.wikiLink.style.display = 'none';
            this.fields.wikiLink.setAttribute('href', '')
        } else {
            this.fields.wikiLink.style.display = 'flex';
            this.fields.wikiLink.setAttribute('href', wikiLink)
        }
    },
    /**
     * Set an entity meta on a field from description bar 
     * @param {string} meta - meta text
     * @param {HTMLElement} content - HTML element from description bar
     */
    setMeta: function(meta, content) {
        if (!content) { return ; }

        if (!meta) {
            content.innerHTML = ''; }
        else {
            content.innerHTML = meta; }
    },
    /**
     * Set the permanent link button from description bar
     * onlick : save link on clipboard
     */
    setPermaLink: function() {
        this.fields.permalien.addEventListener('click', () => {
            const tempInput = document.createElement('input');

            document.body.appendChild(tempInput);
            tempInput.value = window.location.protocol + '//' + window.location.host + window.location.pathname;
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);

            this.fields.permalien.classList.add('fiche__permalien--active'); // CSS animation
            this.fields.permalien.textContent = '✓';
            
            this.fields.permalien.addEventListener('animationend', () => {
                this.fields.permalien.textContent = 'Permalink' ;
                this.fields.permalien.classList.remove('fiche__permalien--active')
            });
        });
    },
    /**
     * Generate the connected nodes <ul> list, its description frame
     * @param {array} nodeConnectedList - Connected nodes array
     */
    setConnexion: function(nodeConnectedList) {
        this.fields.connexion.innerHTML = ''; // reset

        if (nodeConnectedList === null) { return; }

        var list = document.createElement('ul');
        list.classList.add('connexions__list');
        this.fields.connexion.appendChild(list);

        for (const connectedNode of nodeConnectedList) {
            if (connectedNode.hidden == true) { continue; }

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
            // link description frame at scroll on list element
            if (connectedNode.title !== null) {
                listElt.addEventListener('mouseenter', (e) => {
                    overflow.classList.add('overflow--active');
                    overflow.style.left = e.pageX + 20 + 'px';
                    overflow.style.top = e.pageY - overflow.offsetHeight + 'px';
                    overflow.textContent = connectedNode.title;
                })

                listElt.addEventListener('mouseout', () => {
                    overflow.classList.remove('overflow--active'); })
            }
        }
    },
    /**
     * Feed all fields from the description bar about the selected entity
     */
    fill: function() {
        const nodeMetas = getNodeMetas(network.selectedNode)
        if (nodeMetas === false)  { return ; }
        const nodeConnectedList = findConnectedNodes(network.selectedNode);

        // show description bar fields
        this.content.classList.add('fiche__content--visible');
        // feed all element marked by [data-meta] into description bar
        this.domFields.forEach(elt => {
            const metaName = elt.dataset.meta;
            this.setMeta(nodeMetas[metaName], elt);
        });

        this.setImage(nodeMetas.image, nodeMetas.label);
        this.setWikiLink(nodeMetas.lien_wikipedia);
        this.setPermaLink(network.selectedNode);

        this.setConnexion(nodeConnectedList);
    }
}

fiche.toggle.addEventListener('click', () => {
    if (fiche.isOpen) { fiche.close(); }
    else { fiche.open(); }
});

fiche.fields.head.addEventListener('click', () => {
    switchNode(network.selectedNode); });
var filter = {
    btnsGroups: document.querySelectorAll('.btn-group'),
    volet: {
        body: document.querySelector('#filter-volet'),
        btnOpen: document.querySelector('#filtre-open'),
        btnClose: document.querySelector('#filtre-close')
    },
    init: function() {
        this.btnsGroups.forEach(btn => {
            var meta = btn.dataset.meta;
            var type = btn.dataset.type;
        
            btn.style.backgroundColor = chooseColor(meta);
        
            let isActiveGroup = true;
        
            btn.addEventListener('click', () => {

                network.visualisation.stabilize();
        
                if (isActiveGroup) {
                    network.data.nodes.get({
                        filter: function (item) {
                            if (item[type] == meta) {
                                network.data.nodes.update({id: item.id, hidden: true}) }
                        }
                    });

                    // activation visuelle boutons filtre de entête et volet
                    document.querySelectorAll('[data-meta="' + btn.dataset.meta + '"]').forEach(btn => {
                        btn.classList.add('active'); });
        
                    isActiveGroup = false;
                } else {
                    network.data.nodes.get({
                        filter: function (item) {
                            if (item[type] == meta) {
                                network.data.nodes.update({id: item.id, hidden: false}) }
                        }
                    });

                    // deactivation visuelle boutons filtre de entête et volet
                    document.querySelectorAll('[data-meta="' + btn.dataset.meta + '"]').forEach(btn => {
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
            collaborateur: {shape: 'circularImage', color: {border: chooseColor('collaborateur')}},
            famille: {shape: 'circularImage', color: {border: chooseColor('famille')}},
            opposant: {shape: 'circularImage', color: {border: chooseColor('opposant')}},
            otlet: {shape: 'circularImage', color: {border: chooseColor('otlet')}},
            'non-catégorisé': {shape: 'circularImage', color: {border: chooseColor('non-catégorisé')}},
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
        const urlPathnameArray = window.location.pathname.split('/');
        const nodeId = urlPathnameArray[urlPathnameArray.length -1];
        if (switchNode(nodeId, false)) {
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

        const noHiddenNodes = network.data.nodes.map(entite => ({
            id: entite.id,
            label: entite.label
        }), {
            filter: function(entite) {
                return(entite.hidden !== true);
            }
        })

        const fuse = new Fuse(noHiddenNodes, search.options);

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
(function() {
const activFlag = document.querySelector('.lang-box__flag[data-active="true"]');

if (!activFlag) { return; }

var langage = {
    flags: document.querySelectorAll('.lang-box__flag'),
    actual: activFlag.dataset.lang,
    translateAll: function() {
        document.querySelectorAll('[data-lang-' + langage.actual.toLowerCase() + ']').forEach(elt => {
            eval('elt.innerHTML = elt.dataset.lang' + langage.actual);
        });
    }
}

// active actual langage button
activFlag.classList.add('lang-box__flag--active');

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

        // translate website interface
        langage.translateAll();
        // translate graph & entities metas
        network.data.nodes.update(
            network.data.nodes.map(entite => ({
                    id: entite.id,
                    title: entite[langage.actual].title,
                    description: entite[langage.actual].description,
                    domaine: entite[langage.actual].domaine,
                    pays: entite[langage.actual].pays,
                })
            )
        );
        network.data.edges.update(
            network.data.edges.map(lien => ({
                    id: lien.id,
                    title: lien[langage.actual].title,
                })
            )
        );

        fiche.fill();
        board.init();

    });
});
})()
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
            x: nodeCoordonates.x + 100,
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