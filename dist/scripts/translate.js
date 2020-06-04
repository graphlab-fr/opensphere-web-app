var langage = {
    flags: [document.querySelector('#lang-fr'), document.querySelector('#lang-en')],
    actual: 'Fr'
}

langage.flags.forEach(flag => {
    flag.addEventListener('click', (e) => {
        var flag = e.target;
        
        if (flag.dataset.lang == langage.actual) {
            // si le bouton flag cliqué active la langue déjà active
            return;
        }

        // désactiver la surbrillance du flag de la précédante langue
        document.querySelector('[data-lang="' + langage.actual + '"]')
            .classList.remove('lang-box__flag--active');
        // activer la surbrillance du flag de l'actuelle langue
        flag.classList.add('lang-box__flag--active');

        langage.actual = flag.dataset.lang;

        document.querySelectorAll('[data-lang-' + langage.actual.toLowerCase() + ']').forEach(elt => {
            eval('elt.textContent = elt.dataset.lang' + langage.actual);
        });

        if (fiche.activeNodeMetas !== null) {
            fiche.fill(fiche.activeNodeMetas); }
    });
});