var filter = {
    btnsGroups: document.querySelectorAll('.btn-group'),
    volet: {
        body: document.querySelector('#filter-volet'),
        btnOpen: document.querySelector('#filtre-open'),
        btnClose: document.querySelector('#filtre-close')
    },
    init: function() {
        this.btnsGroups.forEach(btn => {
            var group = btn.dataset.group;
        
            btn.style.backgroundColor = chooseColor(group);
        
            let isActiveGroup = true;
        
            btn.addEventListener('click', () => {

                network.visualisation.stabilize();
        
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
    }
}

filter.init();
filter.volet.btnOpen.addEventListener('click', () => {
    filter.volet.body.classList.add('lateral--active'); });
filter.volet.btnClose.addEventListener('click', () => {
    filter.volet.body.classList.remove('lateral--active'); });