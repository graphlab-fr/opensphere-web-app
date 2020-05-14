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

    const cardBox = document.createElement('div');
    cardBox.classList.add('card');
    cardBox.innerHTML = [presentation, titre].join('');
    board.content.appendChild(cardBox);

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