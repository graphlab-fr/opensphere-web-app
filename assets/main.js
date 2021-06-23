/**
 * @ignore
 * ================================================================================================
 * fetch.js =======================================================================================
 * ================================================================================================
 * Extract data from JSON files for activate diplays (graph, board, search engine)
 */

/**
 * Graph attributs and methods
 * @namespace Graph
 */

const graph = {
    /**
     * All nodes attributes
     * @type array
     * @memberof Graph
     */
    nodes: [],
    /**
     * All links attributes
     * @type array
     * @memberof Graph
     */
    links: [],
    /**
     * If the nodes must contain an image
     * @type bool
     * @memberof Graph
     */
    nodeContainImage: true,
    /**
     * Graph SVG position as the user view parameters
     * @type obj
     * @default
     * @memberof Graph
     */
    pos: {
        zoom: 1,
        x: 0,
        y: 0
    },
    elts: {},
    defs: {},
    /**
     * Id of the current selected node
     * @type obj
     * @default
     * @memberof Graph
     */
    selectedNodeId: undefined,
    /**
     * Selected SVG as a d3 object
     * @type obj
     * @memberof Graph
     */
    svg: d3.select("#graph")
}

Promise.all([
    fetch('data/entites.json'), // = data[0]
    fetch('data/liens.json') // = data[1]
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

        /**
         * Fetch the entites from 'entites.json'
         * @namespace Fetch_entites
         */

        graph.nodes = entites
            .filter(entite => entite.id)
            .map(function(entite) {
                return {
                    id: entite.id,
                    label: entite.label,
                    title: entite.titre,
                    group: entite.relation_otlet,
                    image: './assets/images/' + entite.photo,
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
                        title: entite.titre_en,
                        pays: entite.pays_en,
                        domaine: entite.domaine_en,
                        description: entite.description_en
                    },

                    sortName: entite.nom || entite.label,
                    hidden: false
                };
            });


        /**
         * Fetch the entites from 'entites.json'
         * @namespace Fetch_links
         */

        graph.links = liens
            .filter(lien => lien.id && lien.from && lien.to)
            .map(function(lien) {
                return {
                    id: lien.id,
                    source: lien.from,
                    target: lien.to,
                    title: lien.label,

                    Fr: {
                        title: lien.label
                    },
                    En: {
                        title: lien.label_en
                    },
                }
            });

        graph.init();

    });
});


/**
 * @ignore
 * ================================================================================================
 * network.js =====================================================================================
 * ================================================================================================
 * Display & lauch events of the graph
 * Distribute the data extracted from fetch.js
 */

/**
 * Parameters for graph : node gravity, appearance
 * @type obj
 * @default
 * @memberof Graph
 */

graph.params = {
    nodeSize: 12,
    nodeStrokeSize: 2,
    force: 800,
    distanceMax: 400,
    highlightColor: 'red'
};

/**
 * Graph svg with
 * @type number
 * @memberof Graph
 */
graph.width =+ graph.svg.node().getBoundingClientRect().width;
/**
 * Graph svg height
 * @type number
 * @memberof Graph
 */
graph.height =+ graph.svg.node().getBoundingClientRect().height;

/**
 * Graph initialisation
 * @memberof Graph
 */
graph.init = function() {

    graph.params.imgSize = graph.params.nodeSize + 10;

    d3.select(window).on("resize", function () {
        graph.width =+ graph.svg.node().getBoundingClientRect().width;
        graph.height =+ graph.svg.node().getBoundingClientRect().height;
        toPosition();
    });

    graph.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(graph.width / 2, graph.height / 2));

    /**
     * Infotip (on hover links)
     * @memberof Graph
     */

    graph.elts.tip = undefined;

    /**
     * Graph links (d3) elements
     * @memberof Graph
     */

    graph.elts.links = graph.svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("class", (d) => 'l_' + d.type)
        .attr("title", (d) => d.title)
        .attr("data-source", (d) => d.source)
        .attr("data-target", (d) => d.target)
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)
        .on("mouseenter", function (d) {

            if (d.description === '') { return; }

            const coordinates = d3.mouse(this)
                , x = coordinates[0] + 10
                , y = coordinates[1] + 10;
    
            graph.elts.tip = graph.svg.append("g")
                .attr("transform", `translate(200,200)`);
    
            let rect = graph.elts.tip.append("rect")
                .style("fill", "white")
                .style("stroke", "black")
                .attr("rx", 2)
                .attr("ry", 2);
    
            graph.elts.tip.append("text")
                .text(function() {
                    return d.title;
                })
                .style("fill", "black")
                .attr('font-size', 17 - graph.pos.zoom * 3)
                .attr("dy", "1em")
                .attr("x", 7)
                .attr("class", "tip_description");
    
            const bbox = graph.elts.tip.node().getBBox();
            rect.attr("width", bbox.width + 20)
                .attr("height", bbox.height);
    
            graph.elts.tip.attr("transform", "translate(" + x + "," + y + ")")
        })
        .on("mouseout", function (d) {
            graph.elts.tip.remove();
        })

    /**
     * Graph nodes (d3) elements
     * @memberof Graph
     */

    graph.elts.nodes = graph.svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter().append("g")
        .attr("data-node", (d) => d.id)
        .on('click', function(d) {
            // openRecord(nodeMetas.id);
            switchNode(d.id);
            historique.actualiser(d.id);
        });

    /**
     * Graph circle (into nodes) (d3) elements
     * @memberof Graph
     */

    graph.elts.circles = graph.elts.nodes.append("circle")
        .attr("r", (d) => graph.params.nodeSize)
        .style("stroke", (d) => chooseColor(d.group))
        .attr("stroke-width", graph.params.nodeStrokeSize)
        .on('mouseenter', hoverNode)
        .on('mouseout', hoverNodeRemove);

    if (graph.nodeContainImage === true) {

        /**
         * Graph images (into nodes) (d3) elements
         * @memberof Graph
         */
    
        graph.elts.images = graph.elts.nodes.append("svg:image")
            .attr("xlink:href",  function(d) { return d.image;})
            .attr("clip-path", "url(#image-clip-path)")
            .attr('transform', 'translate(-' + graph.params.imgSize / 2 + ', -' + graph.params.imgSize / 2 + ')')
            .attr("height", graph.params.imgSize)
            .attr("width", graph.params.imgSize)
            .call(d3.drag()
                .on("start", function(d) {
                    if (!d3.event.active) graph.simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y; })
                .on("drag", function(d) {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y; })
                .on("end", function(d) {
                    if (!d3.event.active) graph.simulation.alphaTarget(0.0001);
                    d.fx = null;
                    d.fy = null; })
            )
            .on('mouseenter', hoverNode)
            .on('mouseout', hoverNodeRemove);
    }

    /**
     * Graph texts (into nodes) (d3) elements
     * @memberof Graph
     */

    graph.elts.labels = graph.elts.nodes.append("text")
        .each(function(d) {
            const words = d.label.split(' ')
                , max = 25
                , text = d3.select(this);
            let label = '';

            for (let i = 0; i < words.length; i++) {
                // combine words and seperate them by a space caracter into label
                label += words[i] + ' ';

                // if label (words combination) is longer than max & not the single iteration
                if (label.length < max && i !== words.length - 1) { continue; }

                text.append("tspan")
                    .attr('x', 0)
                    .attr('dy', '1.2em')
                    .text(label.slice(0, -1)); // remove last space caracter

                label = '';
            }
        })
        .attr('font-size', 10)
        .attr('x', 0)
        .attr('y', (d) => graph.params.nodeSize)
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle');

    graph.elts.defs = graph.svg.append("defs")

    graph.defs.imageClipPath = graph.elts.defs.append("clipPath")
        .attr("id", "image-clip-path")
        .append("circle")
        .attr("cx", graph.params.imgSize / 2)
        .attr("cy", graph.params.imgSize / 2)
        .attr("r", graph.params.imgSize / 2);

    graph.simulation
        .nodes(graph.nodes)
        .on("tick", function() {
            graph.elts.links
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            const marge = 20;

            graph.elts.nodes
                .attr("transform", function(d) {
                    d.x = Math.max(graph.params.nodeSize + marge, Math.min(graph.width - graph.params.nodeSize - marge, d.x));
                    d.y = Math.max(graph.params.nodeSize + marge, Math.min(graph.height - graph.params.nodeSize - marge, d.y));

                    return "translate(" + d.x + "," + d.y + ")";
                });
        });

    graph.simulation
        .force("link")
        .links(graph.links);

    graph.simulation
        .force("center", d3.forceCenter())
        .force("charge", d3.forceManyBody());

    graph.simulation.force("charge")
        .strength(-Math.abs(graph.params.force)) // turn force value to negative number
        .distanceMax(graph.params.distanceMax);

    function toPosition() {
        graph.simulation.force("center")
            .x(graph.width * 0.5)
            .y(graph.height * 0.5);

        graph.simulation
            .alpha(1).restart();
    }

    toPosition();

    board.init(); // activate the alphabetical list display
    search.input.addEventListener('focus', search.init); // activate the search engine
    filter.init(); // activate filters
    
    // If there is entity id one URL : activate
    const urlPathnameArray = window.location.pathname.split('/');
    let nodeId = urlPathnameArray[urlPathnameArray.length -1];
    nodeId = Number(nodeId);
    if (switchNode(nodeId, false)) {
        historique.init(nodeId);
    }

    function hoverNode(d) {
        graph.elts.nodes.classed('translucent', true);
            graph.elts.links.classed('translucent', true);

            const ntwOfHoveredNode = getNodeNetwork(d.id)
                , nodeHovered = ntwOfHoveredNode.node
                , linksHovered = ntwOfHoveredNode.links
                , connectedNodesHovered = ntwOfHoveredNode.connectedNodes;

            nodeHovered.classed('translucent', false);
            linksHovered.classed('translucent', false);
            connectedNodesHovered.classed('translucent', false);

            if (graph.selectedNodeId) {
                const ntwOfSelectedNode = getNodeNetwork(graph.selectedNodeId)
                    , nodeSelected = ntwOfSelectedNode.node
                    , linksSelected = ntwOfSelectedNode.links
                    , connectedNodesSelected = ntwOfSelectedNode.connectedNodes;

                nodeSelected.classed('translucent', false);
                linksSelected.classed('translucent', false);
                connectedNodesSelected.classed('translucent', false);
            }
    }

    function hoverNodeRemove(d) {
        graph.elts.nodes.classed('translucent', false);
        graph.elts.links.classed('translucent', false);
    }
}

/**
 * Get d3 elts objects : the node, its links and its linked nodes
 * @param {number} nodeId 
 * @returns {object} - {node, links, connectedNodes}
 */

function getNodeNetwork(nodeId) {
    const ntw = {
        node: graph.elts.nodes.filter(node => node.id === nodeId),
        connectedNodes: []
    }

    ntw.links = graph.elts.links.filter(function(link) {
        if (link.source.id === nodeId && link.target.hidden === false) {
            ntw.connectedNodes.push(link.target.id);
            return true;
        }

        if (link.target.id === nodeId && link.source.hidden === false) {
            ntw.connectedNodes.push(link.source.id);
            return true;
        }
    });
    
    ntw.connectedNodes = graph.elts.nodes.filter(node => ntw.connectedNodes.includes(node.id));

    return ntw;
}

/**
 * Highlight a node with the highlight color
 * @param {number} nodeId
 */

function highlightNodeNetwork(nodeId) {
    const ntw = getNodeNetwork(nodeId)
        , node = ntw.node
        , links = ntw.links;

    node.select('circle').style("stroke", graph.params.highlightColor);
    links.classed('highlight', true);
}

/**
 * Unlight the selected node (by his id)
 */

function unlightNodeNetwork() {
    const ntw = getNodeNetwork(graph.selectedNodeId)
        , node = ntw.node
        , links = ntw.links;

    node.select('circle').style("stroke", (d) => chooseColor(d.group));
    links.classed('highlight', false);
}

/**
 * Return the RGB color linked to the group name
 * @param {string} name - Group name
 * @returns {string} - RGB formated color
 */

function chooseColor(name) {
    let color;

    switch (name) {
        case 'collegue':
            color = '154, 60, 154'; break;
        case 'collaborateur':
            color = '97, 172, 97'; break;
        case 'opposant':
            color = '250, 128, 114'; break;
        case 'famille':
            color = '102, 179, 222'; break;
        case 'otlet':
            color = '244, 164, 96'; break;
        case 'non-catégorisé':
            color = '128,128,128'; break;
        case 'institution':
            color = '128,128,128'; break;
        case 'œuvre':
            color = '128,128,128'; break;
        case 'évènement':
            color = '128,128,128'; break;
        default:
            color = '169, 169, 169'; break;
    }
    
    return ['rgb(', color, ')'].join('');
}

/**
 * Return the metadatas from a node (d3) element
 * @param {number} nodeId - Entity id
 * @returns {mixed} metadatas of false if malfunction
 */

function getNodeMetas(nodeId) {
    const nodeMetas = graph.elts.nodes.filter(node => node.id === nodeId).data()[0];

    if (!nodeMetas) { return false; }

    return nodeMetas;
}

/**
 * Return metas from connected nodes
 * @param {number} nodeId - Entity id
 * @returns {array} objects array contains metadatas
 */

function findConnectedNodes(nodeId) {
    return graph.links
        .filter(link => link.source.id === nodeId || link.target.id === nodeId)
        .map(function(link) {
            if (link.source.id === nodeId) {
                return link.target;
            } else {
                return link.source;
            }
        })
        .map(function(link) {
            return {
                id: link.id,
                label: link.label,
                relation: link.group,
                title: link.title,
                hidden: link.hidden
            };
        });
}

/**
 * Change view (graph focus & description bar content) about a node
 * @param {number} nodeId - Entity id
 * @param {boolean} mustZoom - if true : zoom on node
 * @returns {boolean} if it works
 */

function switchNode(nodeId, mustZoom = true) {

    var nodeMetas = getNodeMetas(nodeId);

    if (nodeMetas === false) { return false; }

    if (graph.selectedNodeId) { unlightNodeNetwork(); }

    highlightNodeNetwork(nodeId);

    graph.selectedNodeId = Number(nodeId);

    // rename webpage
    document.title = nodeMetas.label + ' - Otetosphère';

    if (mustZoom) { zoomToNode(nodeId); }

    fiche.fill();
    fiche.open();

    return true;
}


/**
 * @ignore
 * ================================================================================================
 * board.js =======================================================================================
 * ================================================================================================
 * Display of the alphabetical list of entities in the form of cards
 */


/**
 * Records list attributs & methods
 * @namespace Board
 */

var board = {
    content: document.querySelector('#board-content'),
    wrapper: document.querySelector('#board-wrapper'),
    engine: new Board,

    /**
     * Initialize the records list display
     * @memberof Board
     */

    init: function() {
        this.engine.empty();

        this.engine.cards = graph.elts.nodes.filter(node => node.hidden !== true)
            .data()
            .sort(function (a, b) { return a.sortName.localeCompare(b.sortName); })
            .map(function(d) {
                let card = new Card;
                card.id = d.id;
                card.label = d.label;
                card.labelFirstLetter = d.sortName.charAt(0);
                card.title = (d.title || '');
                card.img = d.image;

                return card;
            });

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
    `<header>
        <img src="${this.img}" alt="${this.label}">
        <div class="card-identite">
            <h3 class="card__label">${this.label}</h3>
        </div>
    </header>
    <h4 class="card__titre">${this.title}</h4>`;

    container.appendChild(this.domElt);

    this.domElt.addEventListener('click', () => {
        switchNode(this.id);
        historique.actualiser(this.id);
    });
}

/**
 * Init instance of the Board.
 * @constructs Board
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

        var cardStack = document.createElement('div');
        cardStack.classList.add('section');
        this.domElt.appendChild(cardStack);

        var divider = document.createElement('div');
        divider.id = 'letter-' + letter;
        divider.classList.add('title');
        divider.textContent = letter;
        cardStack.appendChild(divider);

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
        listElt.textContent = letter;
        this.domLetterList.appendChild(listElt);

        listElt.addEventListener('click', () => {
            board.wrapper.scrollTop = 0;
            board.wrapper.scrollTo({
                top: document.querySelector('#letter-' + letter).getBoundingClientRect().y - 100,
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


/**
 * @ignore
 * ================================================================================================
 * filter.js =======================================================================================
 * ================================================================================================
 * Activate filters buttons & hide/show entitied from the graph
 */


/**
 * Filters attributs & methods
 * @namespace Filter
 */

var filter = {
    btnsGroups: document.querySelectorAll('.btn-group'),
    volet: {
        body: document.querySelector('#filter-volet'),
        btnOpen: document.querySelector('#filtre-open'),
        btnClose: document.querySelector('#filtre-close')
    },

    /**
     * Initialize the filters click events
     * @memberof Filter
     */

    init: function() {
        this.btnsGroups.forEach(btn => {
            var meta = btn.dataset.meta;
            var type = btn.dataset.type;
        
            btn.style.backgroundColor = chooseColor(meta);
        
            let isActiveGroup = true;
        
            btn.addEventListener('click', () => {
        
                if (isActiveGroup) {
                    graph.elts.nodes.filter(node => node[type] == meta)
                        .each(function(d) {
                            d.hidden = true;

                            const ntw = getNodeNetwork(d.id)
                                , node = ntw.node
                                , links = ntw.links;

                            node.style('display', 'none');
                            links.style('display', 'none');
                        });

                    // activation visuelle boutons filtre de entête et volet
                    document.querySelectorAll('[data-meta="' + btn.dataset.meta + '"]').forEach(btn => {
                        btn.classList.add('active'); });
        
                    isActiveGroup = false;
                } else {
                    graph.elts.nodes.filter(node => node[type] == meta)
                        .each(function(d) {
                            d.hidden = false;

                            const ntw = getNodeNetwork(d.id)
                                , node = ntw.node
                                , links = ntw.links;

                            node.style('display', null);
                            links.style('display', null);
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


/**
 * @ignore
 * ================================================================================================
 * fiche.js ========================================================================================
 * ================================================================================================
 * Display the description bar & its fields
 */

/**
 * Description bar attributs & methods
 * @namespace Fiche
 */

var fiche = {
    body: document.querySelector('#fiche'),
    content: document.querySelector('#fiche-content'),
    entete: document.querySelector('#fiche-entete'),
    toggle: document.querySelector('#fiche-toggle-btn'), // arrow button
    isOpen: false,
    fields: {
        title: document.querySelector('#fiche-title'),
        wikiLink: document.querySelector('#fiche-wiki-link'),
        img: document.querySelector('#fiche-meta-img'),
        connexion: document.querySelector('#fiche-connexion'),
        permalien: document.querySelector('#fiche-permalien')
    },
    domFields: document.querySelectorAll('#fiche [data-meta]'),

    /**
     * position: fixed; the description bar
     * @memberof Filter
     */
    fixer: function(bool) {
        if (bool) { fiche.body.classList.add('lateral--fixed'); }
        else { fiche.body.classList.remove('lateral--fixed'); }
    },
    /**
     * Open the description bar
     * @memberof Filter
     */
    open: function() {
        this.toggle.classList.add('active');
        fiche.body.classList.add('lateral--active');
        this.isOpen = true;
    },
    /**
     * Close the description bar
     * @memberof Filter
     */
    close: function() {
        if (movement.currentSection === 'fiches') { return; }
        
        this.toggle.classList.remove('active');
        fiche.body.classList.remove('lateral--active');
        this.isOpen = false;
    },
    /**
     * True : description bar can be closed, False : description bar can not be closed
     * @param {bool} bool
     * @memberof Filter
     */
    canClose: function(bool) {
        if (bool) { this.toggle.classList.remove('d-none'); }
        else { this.toggle.classList.add('d-none'); }
    },
    /**
     * Show entity image on description bar
     * @param {string} photoPath - photo path
     * @param {string} entiteLabel - Entity name for alt img attribute
     * @memberof Filter
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
     * @memberof Filter
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
     * @memberof Filter
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
     * @memberof Filter
     */
    setPermaLink: function() {
        this.fields.permalien.addEventListener('click', () => {
            const tempInput = document.createElement('input');

            document.body.appendChild(tempInput);
            tempInput.value = window.location.protocol + '//' + window.location.host + window.location.pathname;
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);

            this.fields.permalien.classList.add('active'); // CSS animation
            this.fields.permalien.textContent = '✓';
            
            this.fields.permalien.addEventListener('animationend', () => {
                this.fields.permalien.textContent = 'Permalink' ;
                this.fields.permalien.classList.remove('active')
            });
        });
    },
    /**
     * Generate the connected nodes <ul> list, its description frame
     * @param {array} nodeConnectedList - Connected nodes array
     * @memberof Filter
     */
    setConnexion: function(nodeConnectedList) {
        this.fields.connexion.innerHTML = ''; // reset

        if (nodeConnectedList === null) { return; }

        for (const connectedNode of nodeConnectedList) {
            if (connectedNode.hidden == true) { continue; }

            var listElt = document.createElement('li');
            listElt.textContent = connectedNode.label;
            listElt.setAttribute('title', connectedNode.title);
            this.fields.connexion.appendChild(listElt);

            var puceColored = document.createElement('span');
            puceColored.style.backgroundColor = chooseColor(connectedNode.relation);
            listElt.prepend(puceColored);

            listElt.addEventListener('click', () => {
                switchNode(connectedNode.id);
                historique.actualiser(connectedNode.id);
            });
        }
    },
    /**
     * Feed all fields from the description bar about the selected entity
     * @memberof Filter
     */
    fill: function() {
        const nodeMetas = getNodeMetas(graph.selectedNodeId)
        if (nodeMetas === false)  { return ; }
        const nodeConnectedList = findConnectedNodes(graph.selectedNodeId);

        // show description bar fields
        this.content.classList.add('visible');
        // feed all element marked by [data-meta] into description bar
        this.domFields.forEach(elt => {
            const metaName = elt.dataset.meta;
            this.setMeta(nodeMetas[metaName], elt);
        });

        this.setImage(nodeMetas.image, nodeMetas.label);
        this.setWikiLink(nodeMetas.lien_wikipedia);
        this.setPermaLink(graph.selectedNodeId);

        this.setConnexion(nodeConnectedList);
    }
}

fiche.toggle.addEventListener('click', () => {
    if (fiche.isOpen) { fiche.close(); }
    else { fiche.open(); }
});

fiche.fields.title.addEventListener('click', () => {
    switchNode(graph.selectedNodeId); });


/**
 * @ignore
 * ================================================================================================
 * search.js ======================================================================================
 * ================================================================================================
 * Set search engine parameters & data
 */


/**
 * Search bar attributs & methods
 * @namespace Search
 */

var search = {
    input: document.querySelector('#search'),
    resultContent: document.querySelector('#search-result'),
    options: {
        includeScore: true,
        keys: ['label']
    },

    /**
     * Display results from a search request into 'resultContent' elt
     * @param {object} resultObj - array of objects (request results)
     * @memberof Search
     */
    showResult: function(resultObj) {
        var nodeId = resultObj.item.id;
        var nodeLabel = resultObj.item.label;

        var resultElement = document.createElement('li');
        resultElement.classList.add('search__result');
        resultElement.textContent = nodeLabel;
        search.resultContent.appendChild(resultElement);

        resultElement.addEventListener('click', () => {

            if (graph.selectedNodeId !== undefined && graph.selectedNodeId == nodeId) {
                // si cette id correpond à celle du nœeud selectionné
                return;
            }
            
            search.input.value = nodeLabel;
            this.cleanResultContent();

            switchNode(nodeId);
            historique.actualiser(nodeId);
        });
    },
    /**
     * Empty search bar and results
     * @memberof Search
     */
    reset: function() {
        search.input.value = ''; // form value
        this.cleanResultContent();
    },
    /**
     * Empty search results
     * @memberof Search
     */
    cleanResultContent: function() {
        search.resultContent.innerHTML = ''; // results
    },
    /**
     * Launch search events on search input and on input
     * @memberof Search
     */
    init: function() {

        const noHiddenNodes = graph.elts.nodes.filter(node => node.hidden !== true)
            .data()
            .map(function(d) {
                return {
                    id: d.id,
                    label: d.label
                }
            });

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


/**
 * @ignore
 * ================================================================================================
 * translate.js ===================================================================================
 * ================================================================================================
 * Activate translate buttons & translate website elements on click
 */


(function() {
const activFlag = document.querySelector('.lang-flag[data-active="true"]');

if (!activFlag) { return; }

var langage = {
    flags: document.querySelectorAll('.lang-flag'),
    actual: activFlag.dataset.lang,
    translateAll: function() {
        document.querySelectorAll('[data-lang-' + langage.actual.toLowerCase() + ']').forEach(elt => {
            eval('elt.innerHTML = elt.dataset.lang' + langage.actual);
        });
    }
}

langage.flags.forEach(flag => {
    flag.addEventListener('click', (e) => {
        var flagCliked = e.target;
        
        if (flagCliked.dataset.lang == langage.actual) {
            // si le bouton flag cliqué active la langue déjà active
            return;
        }

        // désactiver la surbrillance du flag de la précédante langue
        document.querySelector('[data-lang="' + langage.actual + '"]')
            .dataset.active = 'false';
        // activer la surbrillance du flag de l'actuelle langue
        flagCliked.dataset.active = 'true';

        langage.actual = flagCliked.dataset.lang;

        // translate website interface
        langage.translateAll();

        // translate graph & entities metas
        graph.elts.nodes.each(function(d) {
            if (!d[langage.actual]) { return; }

            d.title = d[langage.actual].title,
            d.description = d[langage.actual].description,
            d.domaine = d[langage.actual].domaine,
            d.pays = d[langage.actual].pays
        });

        graph.elts.links.each(function(d) {
            if (!d[langage.actual]) { return; }

            d.title = d[langage.actual].title
        });

        fiche.fill();
        board.init();

    });
});
})()


/**
 * @ignore
 * ================================================================================================
 * zoom.js ========================================================================================
 * ================================================================================================
 * Manage the point of view of the user on the graph, on nodes
 */


/**
 * Graph zoom parameters
 * @default
 * @memberof Graph
 */

graph.zoomParams = {
    zoomInterval: 0.3, // interval between two (de)zoom
    zoomMax: 3,
    zoomMin: 1
}

var zoom = {
    btnPlus: document.querySelector('#zoom-plus'),
    btnMoins: document.querySelector('#zoom-moins'),
    btnReinitialiser: document.querySelector('#zoom-general'),
    interval: 0.1
}

graph.svg.call(d3.zoom().on('zoom', function () {
    // for each move one the SVG

    if (d3.event.sourceEvent === null) {
        zoomMore();
        return;
    }

    switch (d3.event.sourceEvent.type) {
        case 'wheel':
            // by mouse wheel
            if (d3.event.sourceEvent.deltaY >= 0) {
                zoomLess();
            } else {
                zoomMore();
            }
            break;

        case 'mousemove':
            // by drag and move with mouse
            graph.pos.x += d3.event.sourceEvent.movementX;
            graph.pos.y += d3.event.sourceEvent.movementY;
    
            translate();
            break;
    }
}));

/**
 * Zoom in from graph SVG
 */

function zoomMore() {
    graph.pos.zoom += graph.zoomParams.zoomInterval;

    if (graph.pos.zoom >= graph.zoomParams.zoomMax) {
        graph.pos.zoom = graph.zoomParams.zoomMax; }

    translate();
}

/**
 * Zoom out from graph SVG
 */

function zoomLess() {
    graph.pos.zoom -= graph.zoomParams.zoomInterval;

    if (graph.pos.zoom <= graph.zoomParams.zoomMin) {
        graph.pos.zoom = graph.zoomParams.zoomMin; }

    translate();
}

/**
 * Set default parameter to 'graph.zoomParams' then apply them
 */

function zoomReset() {
    graph.pos.zoom = 1;
    graph.pos.x = 0;
    graph.pos.y = 0;

    translate();
}

/**
 * Apply zoom paramters from 'graph.zoomParams'
 */

function translate() {
    graph.svg.attr('style', `transform:translate(${graph.pos.x}px, ${graph.pos.y}px) scale(${graph.pos.zoom});`);
}

/**
 * Zoom to a node from its coordinates
 * @param {number} nodeId
 */

function zoomToNode(nodeId) {
    const nodeToZoomMetas = graph.elts.nodes.filter(node => node.id === nodeId).datum()
        , svgSize = graph.svg.node().getBBox()
        , zoom = 2; // can not be changed

    let x = nodeToZoomMetas.x
        , y = nodeToZoomMetas.y

    // coordonates to put the node at the graph top-left corner
    x = graph.width / 2 - zoom * x;
    y = graph.height / 2 - zoom * y;

    // add px to put the node to the graph center
    x += svgSize.width / 2;
    y += svgSize.height / 2;

    graph.pos = {
        zoom: zoom,
        x: x,
        y: y
    };

    translate();
}


/**
 * @ignore
 * ================================================================================================
 * navigation.js ==================================================================================
 * ================================================================================================
 * Display and coordinate three website sections : graph, board & about menu
 */


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
                .classList.remove('active');
        }

        // activer la surbrillance du lien vers la nouvelle section
        document.querySelector('[data-section="' + section + '"]')
            .classList.add('active');
    }
}

navigation.links.forEach(link => {
    link.addEventListener('click', (e) => {
        movement.goTo(e.target.dataset.section);
    })
});

const headerHeight = 140;

/**
 * Navigation into the website views
 * @namespace Movement
 */

var movement = {
    currentSection: undefined,
    offset: {
        graph: 0,
        board: window.innerHeight + headerHeight
    },

    /**
     * Get the position of the section to scroll and apply displaying options
     * @param {string} section - 'reseau' or 'fiches'
     * @memberof Movement
     */
    goTo: function(section) {

        navigation.activLink(section);
        this.currentSection = section;

        switch (section) {
            case 'reseau':
                this.scroll(this.offset.graph);

                fiche.fixer(true);
                fiche.canClose(true);
                break;
                
            case 'fiches':
                this.scroll(this.offset.board);

                fiche.fixer(true);
                fiche.canClose(false);
                fiche.open();
                break;
        }
    },
    /**
     * Scroll to the position
     * @param {number} offset
     * @memberof Movement
     */
    scroll: function(offset) {
        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });
    }
}

movement.goTo('reseau'); // default

window.onresize = function() {
    movement.goTo(movement.currentSection);
}


/**
 * @ignore
 * ================================================================================================
 * history.js =====================================================================================
 * ================================================================================================
 * Manage the navigation history by sync with the web browser historical functions
 */


/**
 * History of the navigation
 * @namespace Historique
 */

var historique = {
    /**
     * Register the node id into the navigation history
     * @param {number} nodeId
     * @memberof Historique
     */
    actualiser: function(nodeId) {
        if (history.state == null) { this.init(nodeId); }
        else {
            var timeline = history.state.hist;
            timeline.push(nodeId);
            history.pushState({hist : timeline}, 'entite ' + nodeId, nodeId);
        }
    },
    /**
     * Initialise the navigation history, for the first 
     * @param {number} nodeId
     * @memberof Historique
     */
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