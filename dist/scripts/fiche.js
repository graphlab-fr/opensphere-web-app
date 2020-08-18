var fiche = {
    body: document.querySelector('#fiche'),
    content: document.querySelector('#fiche-content'),
    entete: document.querySelector('#fiche-entete'),
    memory: undefined,
    toggle: document.querySelector('#fiche-toggle'),
    isOpen: false,
    fields: {
        wikiLink: document.querySelector('#fiche-wiki-link'),
        img: document.querySelector('#fiche-meta-img'),
        label: document.querySelector('#fiche-meta-label'),
        date: document.querySelector('#fiche-meta-date'),
        titre: document.querySelector('#fiche-meta-titre'),
        pays: document.querySelector('#fiche-meta-pays'),
        domaine: document.querySelector('#fiche-meta-domaine'),
        description: document.querySelector('#fiche-meta-description'),
        connexion: document.querySelector('#fiche-connexion')
    },

    fixer: function(bool) {
        if (bool) { fiche.body.classList.add('lateral--fixed'); }
        else { fiche.body.classList.remove('lateral--fixed'); }
    },
    open: function() {
        this.toggle.classList.add('fiche__toggle-btn--active');
        fiche.body.classList.add('lateral--active');
        this.isOpen = true;
    },
    close: function() {
        if (movement.currentSection === 'fiches') { return; }
        
        this.toggle.classList.remove('fiche__toggle-btn--active');
        fiche.body.classList.remove('lateral--active');
        this.isOpen = false;
    },
    canClose: function(bool) {
        if (bool) { this.toggle.classList.remove('d-none'); }
        else { this.toggle.classList.add('d-none'); }
    },
    setImage: function(entitePhoto, entiteLabel) {
        this.fields.img.setAttribute('src', entitePhoto);
        this.fields.img.setAttribute('alt', 'photo de ' + entiteLabel);
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
            mort = ' - <time  datetime="' + entiteDateMort + '">' +
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
    setMeta: function(meta, content) {
        if (meta === null) {
            content.innerHTML = ''; }
        else {
            content.innerHTML = meta; }
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
    fill: function(nodeMetas, nodeConnectedList) {
        // affichage du contenant
        this.content.classList.add('fiche__content--visible');
        this.memory = {
            activeNodeMetas: nodeMetas,
            activeNodeConnectedList: nodeConnectedList
        };

        // remplissage métadonnées
        this.setMeta(nodeMetas.label, this.fields.label);
        this.setMeta(nodeMetas.title, this.fields.titre);
        this.setImage(nodeMetas.image, nodeMetas.label);
        this.setDates(nodeMetas.annee_naissance, nodeMetas.annee_mort);
        this.setWikiLink(nodeMetas.lien_wikipedia);

        switch (langage.actual) {
            case 'Fr':
                this.setMeta(nodeMetas.pays, this.fields.pays);
                this.setMeta(nodeMetas.domaine, this.fields.domaine);
                this.setMeta(nodeMetas.description, this.fields.description);
                break;
            case 'En':
                this.setMeta(nodeMetas.pays_en, this.fields.pays);
                this.setMeta(nodeMetas.domaine_en, this.fields.domaine);
                this.setMeta(nodeMetas.description_en, this.fields.description);
                break;
        }

        this.setConnexion(nodeConnectedList);
    }
}

fiche.toggle.addEventListener('click', () => {
    // toggle close and open du lateral fiche
    if (fiche.isOpen) { fiche.close(); }
    else { fiche.open(); }
});

const overflow = document.querySelector('#overflow');

fiche.fields.img.addEventListener('click', () => {
    // au clic sur l'image : zoom sur le nœud contenu dans la mémoire
    zoomToNode(fiche.memory.activeNodeMetas.id);
});