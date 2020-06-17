var commands = {
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
        // si l'échelle de zoom dépasse le maximum, elle s'y limite
        scale = network.zoom.max
    }

    network.visualisation.moveTo({ scale: scale });
});

commands.zoom.btnMoins.addEventListener('click', () => {
    if (!network.isLoaded) { return; }

    var scale = network.visualisation.getScale() - commands.zoom.interval;

    if (scale <= network.zoom.min) {
        // si l'échelle de zoom dépasse le minium, elle s'y limite
        scale = network.zoom.min
    }

    network.visualisation.moveTo({ scale: scale });
});

commands.zoom.btnReinitialiser.addEventListener('click', backToCenterView);