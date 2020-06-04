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

        if (movement.currentSection !== undefined) {
            // désactiver la surbrillance du lien vers la précédante section
            document.querySelector('[data-section="' + movement.currentSection + '"]')
                .classList.remove('navigation__link--active');
        }

        // activer la surbrillance du lien vers la nouvelle section
        document.querySelector('[data-section="' + section + '"]')
            .classList.add('navigation__link--active');
    }
}

navigation.links.forEach(link => {
    link.addEventListener('click', (e) => {
        movement.goTo(e.target.dataset.section);
    })
});

var movement = {
    currentSection: undefined,
    offset: {
        introduction: 0,
        graph: introduction.clientHeight - header.height,
        board: introduction.clientHeight * 2 - header.height
    },
    goTo: function(section) {

        if (section == this.currentSection) { return; }

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

movement.goTo('reseau');

window.onresize = function() {
    movement.offset = {
        introduction: 0,
        graph: introduction.clientHeight - header.height,
        board: introduction.clientHeight * 2 - header.height
    }
    movement.goTo(movement.currentSection);
}