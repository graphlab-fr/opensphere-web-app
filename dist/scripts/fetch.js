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
                    // entite metas, default langage
                    id: entite.id,
                    label: entite.label,
                    title: entite.titre,
                    group: entite.relation_otlet,
                    image: './assets/photos/' + entite.photo,
                    genre: entite.genre,
                    annee_naissance: entite.annee_naissance,
                    annee_mort: ((!entite.annee_mort) ? undefined : ' - ' + entite.annee_mort),
                    pays: entite.pays,
                    domaine: entite.domaine,
                    description: entite.description,
                    lien_wikipedia: entite.lien_wikipedia,
                    // translated metas
                    Fr: {
                        title: entite.titre,
                        pays: entite.pays,
                        domaine: entite.domaine,
                        description: entite.description
                    },
                    En: {
                        title: entite.titre,
                        pays: entite.pays_en,
                        domaine: entite.domaine_en,
                        description: entite.description_en
                    },
        
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

                /**
                 * We set a sortName value without the 'de' particle
                 * sortName value is used on board.js for alphabetical ordering
                 */

                if (entite.nom) {
                    var splitName = entite.nom.split(' ', 2);

                    if (splitName.length == 2 && splitName[0] == 'de') {
                        entiteObj.sortName = splitName[1];
                    } else {
                        entiteObj.sortName = entite.nom;
                    }
                } else {
                    entiteObj.sortName = entite.label
                }

                console.log(entiteObj);
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

                    Fr: {
                        title: lien.label
                    },
                    En: {
                        title: lien.label_en
                    },
                };

                if (lien.from !== 1 && lien.to !== 1) {
                    // if link not about Otlet -> gray color
                    lienObj.color = 'gray'; }

                return lienObj;
            })
        );

        network.init();

    });
});