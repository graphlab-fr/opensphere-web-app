var fiche = {
    body: document.querySelector('#fiche'),
    content: document.querySelector('#fiche-content'),
    entete: document.querySelector('#fiche-entete'),
    activeNodeMetas: null,
    contol: {
        open: document.querySelector('#fiche-open'),
        close: document.querySelector('#fiche-close')
    },
    isOpen: false,
    fields: {
        wikiLink: document.querySelector('#fiche-wiki-link'),
        img: document.querySelector('#fiche-meta-img'),
        label: document.querySelector('#fiche-meta-label'),
        date: document.querySelector('#fiche-meta-date'),
        pays: document.querySelector('#fiche-meta-pays'),
        discipline: document.querySelector('#fiche-meta-discipline'),
        description: document.querySelector('#fiche-meta-description'),
        connexion: document.querySelector('#fiche-connexion')
    },

    fixer: function(bool) {
        if (bool) { fiche.body.classList.add('lateral--fixed'); }
        else { fiche.body.classList.remove('lateral--fixed'); }
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
        this.fields.img.setAttribute('src', entitePhoto);
        this.fields.img.setAttribute('alt', 'photo de ' + entiteLabel);
    },
    setLabel: function(entiteLabel) {
        if (entiteLabel === null) {  
            this.fields.label.textContent = '';
        } else {
            this.fields.label.textContent = entiteLabel;
        }
    },
    setDates: function(entiteDateNaissance, entiteDateMort) {
        if (entiteDateNaissance === null && entiteDateMort === null) {
            this.fields.date.innerHTML = '';
            return;
        }

        let naissance = '';
        let mort = '';

        if (entiteDateNaissance !== null) {
            naissance = '<div class="fiche__dates"><time class="" datetime="' 
                + entiteDateNaissance + '">' + entiteDateNaissance + '</time>';
        }

        if (entiteDateMort !== null) {
            mort = ' - <time class="fiche__dates" datetime="' + entiteDateMort + '">' +
                entiteDateMort + '</time><div>';
        }

        this.fields.date.innerHTML = [naissance, mort].join('');
    },
    setWikiLink: function(wikiLink) {
        if (wikiLink === null) {
            this.fields.wikiLink.classList.remove('fiche__wiki-link--visible')
            this.fields.wikiLink.setAttribute('href', '')
        } else {
            this.fields.wikiLink.classList.add('fiche__wiki-link--visible')
            this.fields.wikiLink.setAttribute('href', wikiLink)
        }
    },
    setPays: function(entitePays) {
        if (entitePays === null) {
            this.fields.pays.innerHTML = '';
        } else {
            this.fields.pays.innerHTML = entitePays;
        }
    },
    setDiscipline: function(entiteDiscipline) {
        if (entiteDiscipline === null) {
            this.fields.discipline.innerHTML = '';
        } else {
            this.fields.discipline.innerHTML = entiteDiscipline;
        }
    },
    setDescription: function(entiteDescription) {
        if (entiteDescription === null) {
            this.fields.description.innerHTML = '';
        } else {
            this.fields.description.innerHTML = entiteDescription;
        }
    },
    setConnexion: function(nodeConnectedList) {
        this.fields.connexion.innerHTML = '';

        if (nodeConnectedList === null) { return; }

        var list = document.createElement('ul');
        list.classList.add('connexions__list');
        this.fields.connexion.appendChild(list);

        for (let i = 0; i < nodeConnectedList.length; i++) {
            const connectedNode = nodeConnectedList[i];

            if (connectedNode.hidden == true) {
                continue;
            }

            var listElt = document.createElement('li');
            listElt.classList.add('connexions__elt');
            listElt.textContent = connectedNode.label;
            this.fields.connexion.appendChild(listElt);

            var puceColored = document.createElement('span');
            puceColored.classList.add('connexions__puce');
            puceColored.style.backgroundColor = chooseColor(connectedNode.relation);
            listElt.prepend(puceColored);

            listElt.addEventListener('click', () => {
                switchNode(connectedNode.id);
                historique.actualiser(connectedNode.id);
            });

            if (connectedNode.title !== null) {
                listElt.setAttribute('title', connectedNode.title);

                listElt.addEventListener('mouseenter', (e) => {
                    overflow.classList.add('overflow--active');
                    overflow.style.left = e.pageX + 20 + 'px';
                    overflow.style.top = e.pageY - overflow.offsetHeight + 'px';
                    overflow.textContent = connectedNode.title;
                })

                listElt.addEventListener('mouseout', () => {
                    overflow.classList.remove('overflow--active');
                })
            }
        }
    },
    fill: function(nodeMetas, nodeConnectedList = null) {
        // affichage du contenant
        this.content.classList.add('fiche__content--visible');
        commands.visualiser.allow();
        this.activeNodeMetas = nodeMetas;

        // remplissage métadonnées
        this.setImage(nodeMetas.image, nodeMetas.label);
        this.setLabel(nodeMetas.label);
        this.setDates(nodeMetas.annee_naissance, nodeMetas.annee_mort);
        this.setWikiLink(nodeMetas.lien_wikipedia);

        switch (langage.actual) {
            case 'fr':
                this.setPays(nodeMetas.pays);
                this.setDiscipline(nodeMetas.discipline);
                this.setDescription(nodeMetas.description);
                break;
            case 'en':
                this.setPays(nodeMetas.pays_en);
                this.setDiscipline(nodeMetas.discipline_en);
                this.setDescription(nodeMetas.description_en);
                break;
        }

        this.setConnexion(nodeConnectedList);
    }
}

Object.values(fiche.contol).forEach(btn => {
    btn.addEventListener('click', () => {
        // toggle du lateral fiche
        if (fiche.isOpen) { fiche.close(); }
        else { fiche.open(); }
    });
});

const overflow = document.querySelector('#overflow');