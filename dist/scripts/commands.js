/**
 * ============
 * Zoom
 * ============
 */

const btnZoomPlus = document.querySelector('#zoom-plus');
const btnZoomMoins = document.querySelector('#zoom-moins');

btnZoomPlus.addEventListener('click', () => {
    if (!network.isLoaded) { return; }

    var scale = network.visualisation.getScale() + 0.3;

    if (scale >= network.zoom.max) {
        scale = network.zoom.max }

    network.visualisation.moveTo({ scale: scale });
});

btnZoomMoins.addEventListener('click', () => {
    if (!network.isLoaded) { return; }

    var scale = network.visualisation.getScale() - 0.3;

    if (scale <= network.zoom.min) {
        scale = network.zoom.min }

    network.visualisation.moveTo({ scale: scale });
});

const btnZoomGeneral = document.querySelector('#zoom-general');
btnZoomGeneral.addEventListener('click', backToCenterView);

const btnZoomOnSelection = document.querySelector('#zoom-selection');
btnZoomOnSelection.addEventListener('click', () => {
    zoomToNode(network.selectedNode);
});

/**
 * ============
 * Filtres
 * ============
 */

var filterLateral = {
    body: document.querySelector('#filtre'),
    btnControl: document.querySelector('#filtre-control'),
    isOpen: false,
    open: function() {
        if (!network.isLoaded) { return; }
        
        filterLateral.body.classList.add('lateral--active');
        this.isOpen = true;
    },
    close: function() {
        filterLateral.body.classList.remove('lateral--active');
        this.isOpen = false;
    }
}

filterLateral.btnControl.addEventListener('click', () => {
    // toggle du lateral filtre
    if (filterLateral.isOpen) { filterLateral.close(); }
    else { filterLateral.open(); }
});

const btnsGroups = document.querySelectorAll('.btn-group');
btnsGroups.forEach(btn => {
    var group = btn.dataset.group;

    btn.style.backgroundColor = chooseColor(group);

    let isActiveGroup = true;

    btn.addEventListener('click', () => {

        if (!network.isLoaded) { return; }

        search.reset();

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
    
    });
});