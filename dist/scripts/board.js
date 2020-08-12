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