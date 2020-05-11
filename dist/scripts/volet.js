var volet = {
    body: document.querySelector('#volet'),
    content: document.querySelector('#volet-content'),
    connexionList: document.querySelector('#volet-connexion'),
    btnControl: document.querySelector('#lateral-control'),
    isOpen: false,
    fields: {
        // champs du volet
        img: document.querySelector('#volet-meta-img'),
        label: document.querySelector('#volet-meta-label'),
        date: document.querySelector('#volet-meta-date'),
        pays: document.querySelector('#volet-meta-pays'),
        discipline: document.querySelector('#volet-meta-discipline'),
        description: document.querySelector('#volet-meta-description')
    },

    open: function() {
        if (!network.isLoaded) { return; }
        
        volet.body.classList.add('volet--active');
        this.isOpen = true;
    },
    close: function() {
        volet.body.classList.remove('volet--active');
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

        var libelle = '<h3 class="volet-libelle">Dates extremes</h3>';

        if (entiteDateNaissance !== null) {
            var naissance = '<div class="volet__dates"><time class="" datetime="' 
            + entiteDateNaissance + '">' + entiteDateNaissance + '</time>';
        }

        if (entiteDateMort !== null) {
            var mort = ' - <time class="" datetime="' + entiteDateMort + '">' +
                entiteDateMort + '</time><div>';
        }

        this.fields.date.innerHTML = [libelle, naissance, mort].join('');
    },
    setPays: function(entitePays) {
        if (entitePays === null) { return; }
        var libelle = '<h3 class="volet-libelle">Pays</h3>';
        var pays = '<div class="volet__pays">' + entitePays + '</div>';
        this.fields.pays.innerHTML = [libelle, pays].join('');
    },
    setDiscipline: function(entiteDiscipline) {
        if (entiteDiscipline === null) { return; }
        var libelle = '<h3 class="volet-libelle">Discipline</h3>';
        var discipline = '<div class="volet__discipline">' + entiteDiscipline + '</div>';
        this.fields.discipline.innerHTML = [libelle, discipline].join('');
    },
    setDescription: function(entiteDescription) {
        if (entiteDescription === null) { return; }
        var libelle = '<h3 class="volet-libelle">Description</h3>';
        var description = '<div class="volet__description">' + entiteDescription + '</div>';
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
            });
        }
    },
    fill: function(nodeMetas, nodeConnectedList = false) {
        // affichage du contenant
        this.content.classList.add('visible');

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

volet.btnControl.addEventListener('click', () => {
    // toggle du volet
    if (volet.isOpen) { volet.close(); }
    else { volet.open(); }
});