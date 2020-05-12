var interface = {
    headerFixeur: document.querySelector('#entete-fixeur'),
    fix: function(bool) {
        if (bool) {
            this.headerFixeur.classList.add('entete__fixe--active');
            fiche.body.classList.add('lateral--fixed');
            filterLateral.body.classList.add('lateral--fixed');
        } else {
            this.headerFixeur.classList.remove('entete__fixe--active');
            fiche.body.classList.remove('lateral--fixed');
            filterLateral.body.classList.remove('lateral--fixed');
        }
    }
}

var movement = {
    offset: {
        introduction: document.querySelector('#introduction').offsetTop,
        graph: introduction.clientHeight - 132,
        // board: document.querySelector('#board-content').offsetTop,
        board: introduction.clientHeight * 2 - 200
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
                break;
        }
    },
    scroll: function(offset) {
        console.log(offset);
        
        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });
    }
}

movement.goTo('graph');