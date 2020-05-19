/**
 * ============
 * Mouvements réseau
 * ============
 */

var commands = {
    visualiser: {
        btn: document.querySelector('#zoom-selection'),
        allow: function() {
            this.btn.classList.remove('fiche__btn-control--hidde');
            this.btn.disabled = false;
        }
    },
    zoom: {
        btnPlus: document.querySelector('#zoom-plus'),
        btnMoins: document.querySelector('#zoom-moins'),
        btnReinitialiser: document.querySelector('#zoom-general'),
        interval: 0.2
    }
}

commands.zoom.btnPlus.addEventListener('click', () => {
    if (!network.isLoaded) { return; }

    var scale = network.visualisation.getScale() + commands.zoom.interval;

    if (scale >= network.zoom.max) {
        scale = network.zoom.max }

    network.visualisation.moveTo({ scale: scale });
});

commands.zoom.btnMoins.addEventListener('click', () => {
    if (!network.isLoaded) { return; }

    var scale = network.visualisation.getScale() - commands.zoom.interval;

    if (scale <= network.zoom.min) {
        scale = network.zoom.min }

    network.visualisation.moveTo({ scale: scale });
});

commands.zoom.btnReinitialiser.addEventListener('click', backToCenterView);

commands.visualiser.btn.addEventListener('click', () => {
    zoomToNode(fiche.showingNodeMetas.id);
    movement.goTo('reseau');
});

/**
 * ============
 * Filtres
 * ============
 */

var filter = {
    btnsGroups: document.querySelectorAll('.btn-group'),
    init: function() {
        this.btnsGroups.forEach(btn => {
            var group = btn.dataset.group;
        
            btn.style.backgroundColor = chooseColor(group);
        
            let isActiveGroup = true;
        
            btn.addEventListener('click', () => {
        
                if (!network.isLoaded) { return; }
        
                if (isActiveGroup) {
                    network.data.nodes.get({
                        filter: function (item) {
                            if (item.group == group) {
                                network.data.nodes.update({id: item.id, hidden: true}) }
                        }
                    });
        
                    btn.classList.add('active');
        
                    isActiveGroup = false;
                } else {
                    network.data.nodes.get({
                        filter: function (item) {
                            if (item.group == group) {
                                network.data.nodes.update({id: item.id, hidden: false}) }
                        }
                    });
        
                    btn.classList.remove('active');

                    isActiveGroup = true;
                }
        
                search.reset();
                board.init();
            
            });
        });
    },
    translate: function() {
        switch (langage.actual) {
            case 'fr':
                this.btnsGroups.forEach(btn => {
                    btn.textContent = btn.dataset.langFr; });
                break;
            case 'en':
                this.btnsGroups.forEach(btn => {
                    btn.textContent = btn.dataset.langEn; });
                break;
        }
    }
}

filter.init();