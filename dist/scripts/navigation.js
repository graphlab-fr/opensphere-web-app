var header = {
    fixBox: document.querySelector('#entete-fixeur'),
    height: 115,

    fixer: function(bool) {
        if (bool) { this.fixBox.classList.add('entete__fixe--active') }
        else { this.fixBox.classList.remove('entete__fixe--active') }
    }
}

var navigation = {
    links: document.querySelectorAll('.navigation__link'),
    activLink: function(section) {
        // désactiver la surbrillance du lien vers la précédante section
        document.querySelector('[data-section="' + movement.currentSection + '"]')
            .classList.remove('navigation__link--active');
        
        // activer la surbrillance du lien vers la nouvelle section
        document.querySelector('[data-section="' + section + '"]')
            .classList.add('navigation__link--active');
    },
    translate: function() {
        switch (langage.actual) {
            case 'fr':
                this.links.forEach(link => {
                    link.textContent = link.dataset.langFr; });
                break;
            case 'en':
                this.links.forEach(link => {
                    link.textContent = link.dataset.langEn; });
                break;
        }
    }
}

navigation.links.forEach(link => {
    link.addEventListener('click', (e) => {
        if (movement.currentSection === e.target.dataset.section) { return; }
        movement.goTo(e.target.dataset.section);
    })
});

var movement = {
    currentSection: 'reseau',
    offset: {
        introduction: 0,
        graph: introduction.clientHeight - header.height,
        board: introduction.clientHeight * 2 - header.height
    },
    goTo: function(section) {
        navigation.activLink(section);
        this.currentSection = section;

        switch (section) {
            case 'a_propos':
                this.scroll(0);

                header.fixer(false);
                fiche.fixer(false);
                fiche.canClose(true);
                break;
                
            case 'reseau':
                this.scroll(this.offset.graph);

                header.fixer(true);
                fiche.fixer(true);
                fiche.canClose(true);
                break;
                
            case 'fiches':
                this.scroll(this.offset.board);

                header.fixer(true);
                fiche.fixer(true);
                fiche.canClose(false);
                fiche.open();
                break;
        }
    },
    scroll: function(offset) {
        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });
    }
}

var langage = {
    flags: {
        french: document.querySelector('#lang-fr'),
        english: document.querySelector('#lang-en')
    },
    actual: 'fr'
}

Object.values(langage.flags).forEach(flag => {
    flag.addEventListener('click', (e) => {
        var flag = e.target;
        
        if (flag.dataset.lang == langage.actual) {
            // si le bouton flag cliqué active la langue active
            return;
        }

        // désactiver la surbrillance du flag de la précédante langue
        document.querySelector('[data-lang="' + langage.actual + '"]')
            .classList.remove('lang-box__flag--active');
        // activer la surbrillance du flag de l'actuelle langue
        flag.classList.add('lang-box__flag--active');

        langage.actual = flag.dataset.lang;
        
        filter.translate();
        navigation.translate();

        if (fiche.activeNodeMetas !== null) {
            fiche.fill(fiche.activeNodeMetas); }
    });
});

movement.goTo('reseau');

window.onresize = function() {
    movement.offset = {
        introduction: 0,
        graph: introduction.clientHeight - header.height,
        board: introduction.clientHeight * 2 - header.height
    }
    movement.goTo(movement.currentSection);
}