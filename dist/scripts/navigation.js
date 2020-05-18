var interface = {
    headerFixeur: document.querySelector('#entete-fixeur'),
    fix: function(bool) {
        if (bool) {
            this.headerFixeur.classList.add('entete__fixe--active');
            fiche.body.classList.add('lateral--fixed');
        } else {
            this.headerFixeur.classList.remove('entete__fixe--active');
            fiche.body.classList.remove('lateral--fixed');
        }
    }
}

var navigation = {
    links: document.querySelectorAll('.navigation__link'),
    activLink: function(section) {
        document.querySelector('[data-section="' + movement.currentSection + '"]')
            .classList.remove('navigation__link--active');

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

var headerHeight = interface.headerFixeur.clientHeight + 8;

var movement = {
    currentSection: 'reseau',
    offset: {
        introduction: 0,
        graph: introduction.clientHeight - headerHeight,
        board: introduction.clientHeight * 2 - headerHeight
    },
    goTo: function(section) {
        switch (section) {
            case 'a_propos':
                this.scroll(0);
                interface.fix(false);
                navigation.activLink(section);
                this.currentSection = section;
                break;
                
            case 'reseau':
                this.scroll(this.offset.graph);
                interface.fix(true);
                navigation.activLink(section);
                this.currentSection = section;

                fiche.canClose(true);
                break;
                
            case 'fiches':
                this.scroll(this.offset.board);
                interface.fix(true);
                navigation.activLink(section);
                this.currentSection = section;

                fiche.open();
                fiche.canClose(false);
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

movement.goTo('reseau');

window.onresize = function() {
    headerHeight = interface.headerFixeur.clientHeight;
    movement.offset = {
        introduction: 0,
        graph: introduction.clientHeight - headerHeight,
        board: introduction.clientHeight * 2 - headerHeight
    }
    movement.goTo(movement.currentSection);
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
        
        if (e.target.dataset.lang == langage.actual) { return; }

        e.target.classList.add('lang-box__flag--active');
        document.querySelector('[data-lang="' + langage.actual + '"]')
            .classList.remove('lang-box__flag--active');
        
            
        langage.actual = e.target.dataset.lang;
        
        filter.translate();
        navigation.translate();

        if (fiche.showingNodeMetas !== null) {
            fiche.fill(fiche.showingNodeMetas); }
    });
});