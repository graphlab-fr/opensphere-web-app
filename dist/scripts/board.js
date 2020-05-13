var board = {
    content: document.querySelector('#board-content'),
    sort: {
        conteneur: document.querySelector('#sort-alphabetic'),
        caracters: [],
        init: function() {
            this.caracters.forEach(caracter => {
                caract = document.createElement('li');
                caract.classList.add('sort-alphabetic-list__caracter');
                caract.textContent = caracter;
                this.conteneur.appendChild(caract);

                caract.addEventListener('click', () => {
                    if (!network.isLoaded) { return; }
                    allNodesVisible();
                    sortByCaracter(caracter);
                    board.init();
                });
            });
        }
    },
    init: function() {
        if (!network.isLoaded) { return; }

        this.content.innerHTML = '';
        network.data.nodes.forEach(createCard);
    }
}

board.sort.caracters = genAlphabet();
board.sort.init();

function sortByCaracter(sortCaracter) {
    network.data.nodes.forEach(function(data) {
        var firstCaracterFromLabel = data.label.charAt(0);
        if (firstCaracterFromLabel != sortCaracter && data.hidden != true) {
            // caché s'il n'a pas la première lettre et qu'il n'est pas déjà caché
            network.data.nodes.update({id: data.id, hidden: true});
        }
    });
}


function createCard(entite) {

    if (entite.hidden == true) { return; }

    const cardBox = document.createElement('div');
    cardBox.classList.add('card');
    board.content.appendChild(cardBox);

    const cardPhoto = document.createElement('img');
    cardPhoto.classList.add('card__img');
    cardPhoto.setAttribute('src', entite.image)
    cardPhoto.setAttribute('alt', 'Photo de ' + entite.label)
    cardBox.appendChild(cardPhoto);

    const cardLabel = document.createElement('h3');
    cardLabel.classList.add('card__label');
    cardLabel.textContent = entite.label;
    cardBox.appendChild(cardLabel);


    if (entite.metas.annee_naissance !== null) {
        var chaine = '(' + entite.metas.annee_naissance;

        if (entite.metas.annee_mort !== null) {
            chaine += ' - ' + entite.metas.annee_mort;
        }

        const cardDate = document.createElement('span');
        cardDate.classList.add('card__date');
        cardDate.textContent = chaine + ')';
        cardLabel.appendChild(cardDate);
    }

    if (entite.titre !== null) {
        const cardTitre = document.createElement('h4');
        cardTitre.classList.add('card__titre');
        cardTitre.textContent = entite.title;
        cardBox.appendChild(cardTitre);
    }

    cardBox.addEventListener('click', () => {
        switchNode(entite.id, false)
        historique.actualiser(entite.id);
    });
}

function genAlphabet() {
    var alphabet = [];
    var start = 'A'.charCodeAt(0);
    var last  = 'Z'.charCodeAt(0);
    for (var i = start; i <= last; ++i) {
        alphabet.push(String.fromCharCode(i)); }
  
    return alphabet;
}