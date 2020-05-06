var volet = {
    body: document.querySelector('#volet'),
    content: document.querySelector('#volet-content'),
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
    },
    close: function() {
        volet.body.classList.remove('volet--active');
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

        var libelle = '<h3 class="volet-libelle">Date extrèmes</h3>';

        if (entiteDateNaissance !== null) {
            var naissance = '<div class="volet__dates"><time class="" datetime="' 
            + entiteDateNaissance + '">' + entiteDateNaissance + '</time>';
        }

        if (entiteDateNaissance !== null) {
            var mort = ' - <time class="" datetime="' + entiteDateMort + '">' +
                entiteDateMort + '</time><div>';
        } else {var mort}

        this.fields.date.innerHTML = [libelle, naissance, mort].join('');
    },
    setPays: function(entitePays) {
        if (entitePays === null) { return; }
        var libelle = '<h3 class="volet-libelle">Pays</h3>';
        var pays = '<div class="volet__pays"></div>';
        this.fields.pays.innerHTML = entitePays;
    },
    setDiscipline: function(entiteDiscipline) {
        if (entiteDiscipline === null) {
            this.libelle.discipline.textContent = '';
            return;
        }
        this.libelle.discipline.textContent = 'Discipline';
        this.fields.discipline.textContent = entiteDiscipline;
    },
    setDescription: function(entiteDescription) {
        if (entiteDescription === null) {
            this.libelle.description.textContent = '';
            return;
        }
        this.libelle.description.textContent = 'Description';
        this.fields.description.textContent = entiteDescription;
    },
    fill: function(nodeMetas) {
        // affichage du contenant
        this.content.classList.add('visible');

        // remplissage
        this.setImage(nodeMetas.image, nodeMetas.label);
        this.setLabel(nodeMetas.label);
        this.setDates(nodeMetas.annee_naissance, nodeMetas.annee_mort);
        this.setPays(nodeMetas.pays);
        this.setDiscipline(nodeMetas.discipline);
        this.setDescription(nodeMetas.description);
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