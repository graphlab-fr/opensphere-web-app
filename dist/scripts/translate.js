

/**
 * ================================================================================================
 * translate.js ===================================================================================
 * ================================================================================================
 * Activate translate buttons & translate website elements on click
 */


(function() {
const activFlag = document.querySelector('.lang-flag[data-active="true"]');

if (!activFlag) { return; }

var langage = {
    flags: document.querySelectorAll('.lang-flag'),
    actual: activFlag.dataset.lang,
    translateAll: function() {
        document.querySelectorAll('[data-lang-' + langage.actual.toLowerCase() + ']').forEach(elt => {
            eval('elt.innerHTML = elt.dataset.lang' + langage.actual);
        });
    }
}

langage.flags.forEach(flag => {
    flag.addEventListener('click', (e) => {
        var flagCliked = e.target;
        
        if (flagCliked.dataset.lang == langage.actual) {
            // si le bouton flag cliqué active la langue déjà active
            return;
        }

        // désactiver la surbrillance du flag de la précédante langue
        document.querySelector('[data-lang="' + langage.actual + '"]')
            .dataset.active = 'false';
        // activer la surbrillance du flag de l'actuelle langue
        flagCliked.dataset.active = 'true';

        langage.actual = flagCliked.dataset.lang;

        // translate website interface
        langage.translateAll();

        // translate graph & entities metas
        network.data.nodes.update(
            network.data.nodes.map(function(entite) {
                if (!entite[langage.actual]) { return; }
                return {
                    id: entite.id,
                    title: entite[langage.actual].title,
                    description: entite[langage.actual].description,
                    domaine: entite[langage.actual].domaine,
                    pays: entite[langage.actual].pays,
                };
            })
        );
        network.data.edges.update(
            network.data.nodes.map(function(lien) {
                if (!lien[langage.actual]) { return; }
                return {
                    id: lien.id,
                    title: lien[langage.actual].title,
                };
            })
        );

        fiche.fill();
        board.init();

    });
});
})()