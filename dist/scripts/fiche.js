

/**
 * ================================================================================================
 * fiche.js ========================================================================================
 * ================================================================================================
 * Display the description bar & its fields
 */


const overflow = document.querySelector('#overflow');

var fiche = {
    body: document.querySelector('#fiche'),
    content: document.querySelector('#fiche-content'),
    entete: document.querySelector('#fiche-entete'),
    toggle: document.querySelector('#fiche-toggle'), // arrow button
    isOpen: false,
    fields: {
        head: document.querySelector('#fiche-head'),
        wikiLink: document.querySelector('#fiche-wiki-link'),
        img: document.querySelector('#fiche-meta-img'),
        connexion: document.querySelector('#fiche-connexion'),
        permalien: document.querySelector('#fiche-permalien')
    },
    domFields: document.querySelectorAll('#fiche [data-meta]'),

    /** position; fixed; the description bar on Board view */
    fixer: function(bool) {
        if (bool) { fiche.body.classList.add('lateral--fixed'); }
        else { fiche.body.classList.remove('lateral--fixed'); }
    },
    /** open description bar */
    open: function() {
        this.toggle.classList.add('fiche__toggle-btn--active');
        fiche.body.classList.add('lateral--active');
        this.isOpen = true;
    },
    /** close description bar */
    close: function() {
        if (movement.currentSection === 'fiches') { return; }
        
        this.toggle.classList.remove('fiche__toggle-btn--active');
        fiche.body.classList.remove('lateral--active');
        this.isOpen = false;
    },
    /** show/hide closure button from the description bar */
    canClose: function(bool) {
        if (bool) { this.toggle.classList.remove('d-none'); }
        else { this.toggle.classList.add('d-none'); }
    },
    /**
     * Show entity image on description bar
     * @param {string} photoPath - photo path
     * @param {string} entiteLabel - Entity name for alt img attribute
     */
    setImage: function(photoPath, entiteLabel) {
        if (!this.fields.img) { return ; }
        if (!photoPath) { return this.fields.img.style.display = 'none'; }

        this.fields.img.setAttribute('src', photoPath);
        this.fields.img.setAttribute('alt', 'photo de ' + entiteLabel);
    },
    /**
     * Set the entity link to Wikipedia on description bar 
     * @param {string} wikiLink - URL adress
     */
    setWikiLink: function(wikiLink) {
        if (!this.fields.wikiLink) { return ; }

        if (!wikiLink) {
            this.fields.wikiLink.style.display = 'none';
            this.fields.wikiLink.setAttribute('href', '')
        } else {
            this.fields.wikiLink.style.display = 'flex';
            this.fields.wikiLink.setAttribute('href', wikiLink)
        }
    },
    /**
     * Set an entity meta on a field from description bar 
     * @param {string} meta - meta text
     * @param {HTMLElement} content - HTML element from description bar
     */
    setMeta: function(meta, content) {
        if (!content) { return ; }

        if (!meta) {
            content.innerHTML = ''; }
        else {
            content.innerHTML = meta; }
    },
    /**
     * Set the permanent link button from description bar
     * onlick : save link on clipboard
     */
    setPermaLink: function() {
        this.fields.permalien.addEventListener('click', () => {
            const tempInput = document.createElement('input');

            document.body.appendChild(tempInput);
            tempInput.value = window.location.protocol + '//' + window.location.host + window.location.pathname;
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);

            this.fields.permalien.classList.add('fiche__permalien--active'); // CSS animation
            this.fields.permalien.textContent = '✓';
            
            this.fields.permalien.addEventListener('animationend', () => {
                this.fields.permalien.textContent = 'Permalink' ;
                this.fields.permalien.classList.remove('fiche__permalien--active')
            });
        });
    },
    /**
     * Generate the connected nodes <ul> list, its description frame
     * @param {array} nodeConnectedList - Connected nodes array
     */
    setConnexion: function(nodeConnectedList) {
        this.fields.connexion.innerHTML = ''; // reset

        if (nodeConnectedList === null) { return; }

        var list = document.createElement('ul');
        list.classList.add('connexions__list');
        this.fields.connexion.appendChild(list);

        for (const connectedNode of nodeConnectedList) {
            if (connectedNode.hidden == true) { continue; }

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
            // link description frame at scroll on list element
            if (connectedNode.title !== null) {
                listElt.addEventListener('mouseenter', (e) => {
                    overflow.classList.add('overflow--active');
                    overflow.style.left = e.pageX + 20 + 'px';
                    overflow.style.top = e.pageY - overflow.offsetHeight + 'px';
                    overflow.textContent = connectedNode.title;
                })

                listElt.addEventListener('mouseout', () => {
                    overflow.classList.remove('overflow--active'); })
            }
        }
    },
    /**
     * Feed all fields from the description bar about the selected entity
     */
    fill: function() {
        const nodeMetas = getNodeMetas(network.selectedNode)
        if (nodeMetas === false)  { return ; }
        const nodeConnectedList = findConnectedNodes(network.selectedNode);

        // show description bar fields
        this.content.classList.add('fiche__content--visible');
        // feed all element marked by [data-meta] into description bar
        this.domFields.forEach(elt => {
            const metaName = elt.dataset.meta;
            this.setMeta(nodeMetas[metaName], elt);
        });

        this.setImage(nodeMetas.image, nodeMetas.label);
        this.setWikiLink(nodeMetas.lien_wikipedia);
        this.setPermaLink(network.selectedNode);

        this.setConnexion(nodeConnectedList);
    }
}

fiche.toggle.addEventListener('click', () => {
    if (fiche.isOpen) { fiche.close(); }
    else { fiche.open(); }
});

fiche.fields.head.addEventListener('click', () => {
    switchNode(network.selectedNode); });