let generatedNodesObjectList = [];
function createNodeObject(data) {

    var imagePath  = '/otletosphere/assets/photos/';

    data.forEach(entite => {
                    
        var nodeObject = {
            // entite metas
            id: entite.id,
            label: entite.label,
            title: entite.titre,
            title_fr: entite.titre,
            title_en: entite.titre_en,
            group: entite.relation_otlet,
            image: imagePath + entite.photo,
            genre: entite.genre,
            annee_naissance: entite.annee_naissance,
            annee_mort: entite.annee_mort,
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
                nodeObject.sortName = splitName[1];
            } else {
                nodeObject.sortName = entite.nom;
            }
        } else {
            nodeObject.sortName = entite.label
        }

        generatedNodesObjectList.push(nodeObject);
    });
}

let generatedEdgesObjectList = [];
function createEdgeObject(data) {

    data.forEach(lien => {
                    
        if (lien.from == 1 || lien.to == 1) {
            // si le lien a une relation avec Otlet
            var color = null;
        } else { var color = 'gray'; }
    
        var edgeObject = {
            // edge metas
            id: lien.id,
            from: lien.from,
            to: lien.to,
            title: lien.label,
            title_fr: lien.label,
            title_en: lien.label_en,

            // edge style
            color: color
        };
        generatedEdgesObjectList.push(edgeObject);
    });
}

Promise.all([
    fetch('/otletosphere/data/entite.json'),
    fetch('/otletosphere/data/lien.json')
]).then(function(data) {
    // console.log(data);
    const entite = data[0]
    const lien = data[1]
    
    Promise.all([
        entite.json(),
        lien.json()
    ]).then(function(data) {
        const entite = data[0]
        const lien = data[1]

        createNodeObject(entite);
        createEdgeObject(lien);

        network.init();

    });
});