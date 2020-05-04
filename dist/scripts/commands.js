const btnZoomPlus = document.querySelector('#zoom-plus');
const btnZoomMoins = document.querySelector('#zoom-moins');

btnZoomPlus.addEventListener('click', () => {
    var scale = network.visualisation.getScale() + 0.3;
    if (scale > 2) { return; }
    network.visualisation.moveTo({ scale: scale });
});

btnZoomMoins.addEventListener('click', () => {
    var scale = network.visualisation.getScale() - 0.3;
    if (scale < 0.8) { return; }
    network.visualisation.moveTo({ scale: scale });
});