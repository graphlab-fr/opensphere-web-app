var board = {
    content: document.querySelector('#board-content')
}

function createCard(entite) {
    const cardBox = document.createElement('div');
    cardBox.classList.add('card');
    board.content.appendChild(cardBox);

    // const cardWrapper = document.createElement('div');
    // cardWrapper.classList.add('card__wrapper');
    // cardBox.appendChild(cardWrapper);

    const cardPhoto = document.createElement('img');
    cardPhoto.classList.add('card__img');
    cardPhoto.setAttribute('src', './assets/photos/' + entite.photo)
    cardPhoto.setAttribute('alt', 'Photo de ' + entite.label)
    cardBox.appendChild(cardPhoto);

    const cardLabel = document.createElement('h3');
    cardLabel.classList.add('card__label');
    cardLabel.textContent = entite.label;
    cardBox.appendChild(cardLabel);


    if (entite.annee_naissance !== null) {
        var chaine = '(' + entite.annee_naissance;

        if (entite.annee_mort !== null) {
            chaine += ' - ' + entite.annee_mort;
        }

        const cardDate = document.createElement('span');
        cardDate.classList.add('card__date');
        cardDate.textContent = chaine + ')';
        cardLabel.appendChild(cardDate);
    }

    if (entite.titre !== null) {
        const cardTitre = document.createElement('h4');
        cardTitre.classList.add('card__titre');
        cardTitre.textContent = entite.titre;
        cardBox.appendChild(cardTitre);
    }
}