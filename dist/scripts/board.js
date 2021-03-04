

/**
 * ================================================================================================
 * board.js =======================================================================================
 * ================================================================================================
 * Display of the alphabetical list of entities in the form of cards
 */


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