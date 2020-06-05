var langage = {
    flags: [document.querySelector('#lang-fr'), document.querySelector('#lang-en')],
    actual: 'Fr',
    translateAll: function() {
        document.querySelectorAll('[data-lang-' + langage.actual.toLowerCase() + ']').forEach(elt => {
            eval('elt.textContent = elt.dataset.lang' + langage.actual);
        });
    }
}

document.querySelector('[data-lang="' + langage.actual + '"]')
    .classList.add('lang-box__flag--active');

langage.flags.forEach(flag => {
    flag.addEventListener('click', (e) => {
        var flagCliked = e.target;
        
        if (flagCliked.dataset.lang == langage.actual) {
            // si le bouton flag cliqué active la langue déjà active
            return;
        }

        // désactiver la surbrillance du flag de la précédante langue
        document.querySelector('[data-lang="' + langage.actual + '"]')
            .classList.remove('lang-box__flag--active');
        // activer la surbrillance du flag de l'actuelle langue
        flagCliked.classList.add('lang-box__flag--active');

        langage.actual = flagCliked.dataset.lang;

        langage.translateAll();

        if (fiche.memory !== undefined) {
            fiche.fill(fiche.memory.activeNodeMetas, fiche.memory.activeNodeConnectedList); }
    });
});