var fiche = {
    body: document.querySelector('#fiche'),
    content: document.querySelector('#fiche-content'),
    entete: document.querySelector('#fiche-entete'),
    showinNodeId: undefined,
    contol: {
        open: document.querySelector('#fiche-open'),
        close: document.querySelector('#fiche-close')
    },
    isOpen: false,
    fields: {
        // champs du fiche
        img: document.querySelector('#fiche-meta-img'),
        label: document.querySelector('#fiche-meta-label'),
        date: document.querySelector('#fiche-meta-date'),
        pays: document.querySelector('#fiche-meta-pays'),
        discipline: document.querySelector('#fiche-meta-discipline'),
        description: document.querySelector('#fiche-meta-description'),
        connexion: document.querySelector('#fiche-connexion')
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
        if (movement.currentSection === 'fiches') { return; }
        
        fiche.body.classList.remove('lateral--active');
        this.isOpen = false;
    },
    canClose: function(bool) {
        if (bool) { this.contol.close.classList.remove('fiche__btn-control--hidde'); }
        else { this.contol.close.classList.add('fiche__btn-control--hidde'); }
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
        this.fields.pays.innerHTML = entitePays;
    },
    setDiscipline: function(entiteDiscipline) {
        if (entiteDiscipline === null) { return; }
        this.fields.discipline.innerHTML = entiteDiscipline;
    },
    setDescription: function(entiteDescription) {
        if (entiteDescription === null) { return; }
        this.fields.description.innerHTML = entiteDescription;
    },
    setConnexion: function(nodeConnectedList, entiteLabel) {
        if (nodeConnectedList === false) { return; }
        this.fields.connexion.innerHTML = '';

        var list = document.createElement('ul');
        list.classList.add('connexions__list');
        this.fields.connexion.appendChild(list);

        for (let i = 0; i < nodeConnectedList.length; i++) {
            const connexion = nodeConnectedList[i];

            if (connexion.label == entiteLabel) { continue; }

            var listElt = document.createElement('li');
            listElt.classList.add('connexions__elt');
            listElt.textContent = connexion.label;
            this.fields.connexion.appendChild(listElt);

            var puceColored = document.createElement('span');
            puceColored.classList.add('connexions__puce');
            puceColored.style.backgroundColor = chooseColor(connexion.relation);
            listElt.prepend(puceColored);

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
        commands.visualiser.allow();
        this.showinNodeId = nodeMetas.id;

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

Object.values(fiche.contol).forEach(btn => {
    btn.addEventListener('click', () => {
        // toggle du lateral fiche
        if (fiche.isOpen) { fiche.close(); }
        else { fiche.open(); }
    });
});