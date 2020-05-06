var volet = {
    body: document.querySelector('#volet'),
    content: document.querySelector('#volet-content'),
    btnControl: document.querySelector('#lateral-control'),
    isOpen: false,

    open: function() {
        if (!network.isLoaded) { return; }
        
        volet.body.classList.add('volet--active');
    },
    close: function() {
        volet.body.classList.remove('volet--active');
    },
    fill: function(nodeMetas) {
        var img = '<img class="volet__img" alt="" src="' + nodeMetas.image + '" />';
        var label = '<div class="volet__label">' + nodeMetas.label + '</div>';
        var dates = '<div class="volet__dates">' + nodeMetas.annee_naissance +  ' - '
            + nodeMetas.annee_mort + '</div>';
        var pays = '<div class="volet__pays">' + nodeMetas.pays + '</div>';
        var discipline = '<div class="volet__discipline">' + nodeMetas.discipline + '</div>';
        var description = '<div class="volet__description">' + nodeMetas.description + '</div>';

        volet.content.innerHTML = [img, label, dates, pays, discipline, description].join('');
    }
}

volet.btnControl.addEventListener('click', () => {

    if (volet.isOpen) {
        volet.close();
        volet.isOpen = false;
    } else {
        volet.open();
        volet.isOpen = true;
    }
});