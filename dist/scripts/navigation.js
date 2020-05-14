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
    activatedLink: document.querySelector('[data-section="reseau"]')
}

navigation.links.forEach(link => {
    link.addEventListener('click', (e) => {
        if (navigation.activatedLink === e.target) { return; }
        navigation.activatedLink.classList.remove('navigation__link--active');

        e.target.classList.add('navigation__link--active');
        movement.goTo(e.target.dataset.section);

        navigation.activatedLink = e.target
    })
});

// console.log(navigation.links);


var movement = {
    currentSection: undefined,
    offset: {
        introduction: document.querySelector('#introduction').offsetTop,
        graph: introduction.clientHeight - 105,
        board: introduction.clientHeight * 2
    },
    goTo: function(section) {
        switch (section) {
            case 'a_propos':
                this.scroll(0);
                interface.fix(false);
                this.currentSection = 'a_propos';
                break;
                
            case 'reseau':
                this.scroll(this.offset.graph);
                interface.fix(true);
                this.currentSection = 'reseau';
                break;
                
            case 'fiches':
                this.scroll(this.offset.board);
                interface.fix(true);
                this.currentSection = 'fiches';
                fiche.open();
                break;
        }
    },
    scroll: function(offset) {
        // console.log(offset);
        
        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });
    }
}

movement.goTo('reseau');