var volet = {
    body: document.querySelector('#volet'),
    content: document.querySelector('#volet-content'),
    btnControl: document.querySelector('#lateral-control'),
    isOpen: false,
    fields: {
        // champs du volet
        img: document.querySelector('#volet-meta-img'),
        label: document.querySelector('#volet-meta-label'),
        dateNaissance: document.querySelector('#volet-meta-date-naissance'),
        dateMort: document.querySelector('#volet-meta-date-mort'),
        pays: document.querySelector('#volet-meta-pays'),
        discipline: document.querySelector('#volet-meta-discipline'),
        description: document.querySelector('#volet-meta-description')
    },

    open: function() {
        if (!network.isLoaded) { return; }
        
        volet.body.classList.add('volet--active');
    },
    close: function() {
        volet.body.classList.remove('volet--active');
    },
    setImage: function(entitePhoto, entiteLabel) {
        this.fields.img.setAttribute('src', entitePhoto);
        this.fields.img.setAttribute('alt', 'photo de ' + entiteLabel);
    },
    setLabel: function(entiteLabel) {
        this.fields.label.textContent = entiteLabel;
    },
    setDates: function(entiteDateNaissance, entiteDateMort) {
        this.fields.dateNaissance.setAttribute('datetime', entiteDateNaissance);
        this.fields.dateNaissance.textContent = entiteDateNaissance;

        this.fields.dateMort.setAttribute('datetime', entiteDateMort);
        this.fields.dateMort.textContent = entiteDateMort;
    },
    fill: function(nodeMetas) {
        // affichage du contenant
        this.content.classList.add('visible');

        // remplissage
        this.setImage(nodeMetas.image, nodeMetas.label);
        this.setLabel(nodeMetas.label);
        this.setDates(nodeMetas.annee_naissance, nodeMetas.annee_mort);
        this.fields.pays.textContent = nodeMetas.pays;
        this.fields.discipline.textContent = nodeMetas.discipline;
        this.fields.description.textContent = nodeMetas.description;
    }
}

volet.btnControl.addEventListener('click', () => {
    // toggle du volet
    if (volet.isOpen) {
        volet.close();
        volet.isOpen = false;
    } else {
        volet.open();
        volet.isOpen = true;
    }
});