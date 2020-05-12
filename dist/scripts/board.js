var board = {
    content: document.querySelector('#board-content')
}

function createCard(entite) {
        const cardBox = document.createElement('div');
        cardBox.classList.add('card');
        board.content.appendChild(cardBox);

        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('card__wrapper');
        cardBox.appendChild(cardWrapper);

        const cardPhoto = document.createElement('img');
        cardPhoto.classList.add('card__img');
        cardPhoto.setAttribute('src', './assets/photos/' + entite.photo)
        cardPhoto.setAttribute('alt', 'Photo de ' + entite.label)
        cardWrapper.appendChild(cardPhoto);

        const cardLabel = document.createElement('h3');
        cardLabel.classList.add('card__label');
        cardLabel.textContent = entite.label;
        cardWrapper.appendChild(cardLabel);


        if (entite.annee_naissance !== null) {
            var chaine = '(' + entite.annee_naissance;

            if (entite.annee_mort !== null) {
                chaine += ' - ' + entite.annee_mort; }

            const cardDate = document.createElement('span');
            cardDate.classList.add('card__date');
            cardDate.textContent = chaine + ')';
            cardLabel.appendChild(cardDate);
        }

        if (entite.titre !== null) {
            const cardTitre = document.createElement('h4');
            cardTitre.classList.add('card__titre');
            cardTitre.textContent = entite.titre;
            cardWrapper.appendChild(cardTitre);
        }

        cardBox.addEventListener('click', () => {
            cardBox.classList.toggle('active');
        });

        const cardDetailsBox = document.createElement('div');
        cardDetailsBox.classList.add('card__details');
        cardWrapper.appendChild(cardDetailsBox);

        const cardPays = document.createElement('div');
        cardPays.classList.add('card__pays');
        cardPays.textContent = entite.pays;
        cardDetailsBox.appendChild(cardPays);

        const cardDescription = document.createElement('div');
        cardDescription.classList.add('card__description');
        cardDescription.textContent = entite.description;
        cardDetailsBox.appendChild(cardDescription);
    }