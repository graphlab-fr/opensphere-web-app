var fiche = {
    body: document.querySelector('#fiche'),
    content: document.querySelector('#fiche-content'),
    connexionList: document.querySelector('#fiche-connexion'),
    btnControl: document.querySelector('#fiche-control'),
    isOpen: false,
    fields: {
        // champs du fiche
        img: document.querySelector('#fiche-meta-img'),
        label: document.querySelector('#fiche-meta-label'),
        date: document.querySelector('#fiche-meta-date'),
        pays: document.querySelector('#fiche-meta-pays'),
        discipline: document.querySelector('#fiche-meta-discipline'),
        description: document.querySelector('#fiche-meta-description')
    },

    fixer: function() {
        fiche.body.classList.add('lateral--fixed');
    },
    open: function() {
        if (!network.isLoaded) { return; }
        
        fiche.body.classList.add('lateral--active');
        this.isOpen = true;
    },
    close: function() {
        fiche.body.classList.remove('lateral--active');
        this.isOpen = false;
    },
    setImage: function(entitePhoto, entiteLabel) {
        if (entitePhoto === null) { return; }
        this.fields.img.setAttribute('src', entitePhoto);
        this.fields.img.setAttribute('alt', 'photo de ' + entiteLabel);
    },
    setLabel: function(entiteLabel) {
        if (entiteLabel === null) { return; }
        this.fields.label.textContent = entiteLabel;
    },
    setDates: function(entiteDateNaissance, entiteDateMort) {
        if (entiteDateNaissance === null && entiteDateMort === null) { return; }

        if (entiteDateNaissance !== null) {
            var naissance = '<div class="fiche__dates"><time class="" datetime="' 
            + entiteDateNaissance + '">' + entiteDateNaissance + '</time>';
        }

        if (entiteDateMort !== null) {
            var mort = ' - <time class="fiche__dates" datetime="' + entiteDateMort + '">' +
                entiteDateMort + '</time><div>';
        }

        this.fields.date.innerHTML = [naissance, mort].join('');
    },
    setPays: function(entitePays) {
        if (entitePays === null) { return; }
        var libelle = '<h3 class="fiche__libelle">Pays</h3>';
        var pays = '<div class="fiche__pays">' + entitePays + '</div>';
        this.fields.pays.innerHTML = [libelle, pays].join('');
    },
    setDiscipline: function(entiteDiscipline) {
        if (entiteDiscipline === null) { return; }
        var libelle = '<h3 class="fiche__libelle">Discipline</h3>';
        var discipline = '<div class="fiche__discipline">' + entiteDiscipline + '</div>';
        this.fields.discipline.innerHTML = [libelle, discipline].join('');
    },
    setDescription: function(entiteDescription) {
        if (entiteDescription === null) { return; }
        var libelle = '<h3 class="fiche__libelle">Description</h3>';
        var description = '<div class="fiche__description">' + entiteDescription + '</div>';
        this.fields.description.innerHTML = [libelle, description].join('');
    },
    setConnexion: function(nodeConnectedList, entiteLabel) {
        if (nodeConnectedList === false) { return; }
        this.connexionList.innerHTML = '';

        for (let i = 0; i < nodeConnectedList.length; i++) {
            const connexion = nodeConnectedList[i];

            if (connexion.label == entiteLabel) { continue; }

            var listElt = document.createElement('li');
            listElt.classList.add('connexion-list__elt')
            listElt.textContent = connexion.label;
            this.connexionList.appendChild(listElt);

            listElt.addEventListener('click', () => {
                var id = connexion.id;

                switchNode(id);
                historique.actualiser(id);
            });
        }
    },
    fill: function(nodeMetas, nodeConnectedList = false) {
        // affichage du contenant
        this.content.classList.add('fiche__content--visible');

        // remplissage métadonnées
        this.setImage(nodeMetas.image, nodeMetas.label);
        this.setLabel(nodeMetas.label);
        this.setDates(nodeMetas.annee_naissance, nodeMetas.annee_mort);
        this.setPays(nodeMetas.pays);
        this.setDiscipline(nodeMetas.discipline);
        this.setDescription(nodeMetas.description);

        // remplissage nœuds connectés
        this.setConnexion(nodeConnectedList, nodeMetas.label);
        
    }
}

fiche.btnControl.addEventListener('click', () => {
    // toggle du lateral fiche
    if (fiche.isOpen) { fiche.close(); }
    else { fiche.open(); }
});