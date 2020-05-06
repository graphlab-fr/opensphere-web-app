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

/**
 * ============
 * Filtres
 * ============
 */

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