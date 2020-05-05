var volet = {
    body: document.querySelector('#volet'),
    content: document.querySelector('#volet-content'),
    btnClose: document.querySelector('#volet-close'),

    open: function() {
        if (!network.isLoaded) { return; }
        
        volet.body.classList.add('volet--active');
    },
    close: function() {
        volet.body.classList.remove('volet--active');
        volet.content.innerHTML = '';

        backToCenterView();
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

volet.btnClose.addEventListener('click', volet.close);