Promise.all([
    fetch('data/entite.json'), // = data[0]
    fetch('data/lien.json') // = data[1]
]).then(function(data) {
    // get data
    const entites = data[0]
    const liens = data[1]
    
    Promise.all([
        entites.json(),
        liens.json()
    ]).then(function(data) {
        // get JSON from data
        const entites = data[0]
        const liens = data[1]

        network.data.nodes.add(
            entites.map(function(entite) {
                var entiteObj = {
                    // entite metas
                    id: entite.id,
                    label: entite.label,
                    title: (entite.titre || ''),
                    title_fr: (entite.titre || ''),
                    title_en: (entite.titre_en || ''),
                    group: entite.relation_otlet,
                    image: './assets/photos/' + entite.photo,
                    genre: entite.genre,
                    annee_naissance: entite.annee_naissance,
                    annee_mort: ((!entite.annee_mort) ? undefined : ' - ' + entite.annee_mort),
                    pays: entite.pays,
                    pays_fr: entite.pays,
                    pays_en: entite.pays_en,
                    domaine: entite.domaine,
                    domaine_fr: entite.domaine,
                    domaine_en: entite.domaine_en,
                    description: entite.description,
                    description_fr: entite.description,
                    description_en: entite.description_en,
                    lien_wikipedia: entite.lien_wikipedia,
        
                    // node style
                    size : 30,
                    borderWidth: 3,
                    borderWidthSelected: 60,
                    margin: 20,
                    interaction: {hover: true},
                    hidden: false,
                    font: {
                        face: 'Open Sans',
                        size: 22,
                        color: '#fff',
                        strokeWidth: 2,
                        strokeColor: '#000'
                    }
                };
            
                if (entite.nom) {
                    var splitName = entite.nom.split(' ', 2);
                    // rejet de la particule "de"
                    if (splitName.length == 2 && splitName[0] == 'de') {
                        entiteObj.sortName = splitName[1];
                    } else {
                        entiteObj.sortName = entite.nom;
                    }
                } else {
                    entiteObj.sortName = entite.label
                }

                return entiteObj;
            })
        );

        network.data.edges.add(
            liens.map(function(lien) {
                var lienObj = {
                    id: lien.id,
                    from: lien.from,
                    to: lien.to,
                    title: lien.label,
                    title_fr: lien.label,
                    title_en: lien.label_en
                };

                if (lien.from == 1 || lien.to == 1) {
                    // si le lien a une relation avec Otlet
                    lienObj.color = null; }
                else {
                    lienObj.color = 'gray'; }

                return lienObj;
            })
        );

        network.init();

    });
});