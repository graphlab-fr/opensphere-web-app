(function() {
const activFlag = document.querySelector('.lang-box__flag[data-active="true"]');

if (!activFlag) { return; }

var langage = {
    flags: document.querySelectorAll('.lang-box__flag'),
    actual: activFlag.dataset.lang,
    translateAll: function() {
        document.querySelectorAll('[data-lang-' + langage.actual.toLowerCase() + ']').forEach(elt => {
            eval('elt.innerHTML = elt.dataset.lang' + langage.actual);
        });
    }
}

// active actual langage button
activFlag.classList.add('lang-box__flag--active');

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

        // translate website interface
        langage.translateAll();
        // translate graph & entities metas
        network.data.nodes.update(
            network.data.nodes.map(entite => ({
                    id: entite.id,
                    title: entite[langage.actual].title,
                    description: entite[langage.actual].description,
                    domaine: entite[langage.actual].domaine,
                    pays: entite[langage.actual].pays,
                })
            )
        );
        network.data.edges.update(
            network.data.edges.map(lien => ({
                    id: lien.id,
                    title: lien[langage.actual].title,
                })
            )
        );

        fiche.fill();
        board.init();

    });
});
})()