var board = {
    content: document.querySelector('#board-content'),
    init: function() {
        if (!network.isLoaded) { return; }
        this.content.innerHTML = '';
        console.log('coucou');
        
        network.data.nodes.forEach(createCard);
    }
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