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


var movement = {
    offset: {
        introduction: document.querySelector('#introduction').offsetTop,
        graph: introduction.clientHeight - 105,
        board: introduction.clientHeight * 2
    },
    goTo: function(section) {
        switch (section) {
            case 'introduction':
                this.scroll(0);
                interface.fix(false);
                break;
                
            case 'graph':
                this.scroll(this.offset.graph);
                interface.fix(true);
                break;
                
            case 'board':
                this.scroll(this.offset.board);
                interface.fix(true);
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

movement.goTo('graph');