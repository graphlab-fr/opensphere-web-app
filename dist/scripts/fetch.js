let generatedNodesObjectList = [];
function createNodeObject(data) {

    data.forEach(entite => {
                    
        var nodeObject = {
            id: entite.id,
            label: entite.label,
            font: {
                face: 'Source Sans Pro',
                size: 22,
                strokeWidth: 3
            },
            title: entite.titre,
            group: entite.relation_otlet,
            image: './assets/photos/' + entite.photo,
            size : 30,
            borderWidth: 3,
            borderWidthSelected: 60,
            margin: 20,
            metas: {
                genre: entite.genre,
                annee_naissance: entite.annee_naissance,
                annee_mort: entite.annee_mort,
                pays: entite.pays,
                pays_en: entite.pays_en,
                discipline: entite.discipline,
                discipline_en: entite.discipline_en,
                description: entite.description,
                description_en: entite.description_en,
                lien_wikipedia: entite.lien_wikipedia
            },
            interaction: {hover:true},
            hidden: false
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

    return generatedEdgesObjectList;
}

let generatedEdgesObjectList = [];
function createEdgeObject(data) {

    data.forEach(lien => {
                    
        if (lien.from == 1 || lien.to == 1) {
            // si le lien a une relation avec Otlet
            var color = null;
        } else { var color = 'gray'; }
    
        var edgeObject = {
            from: lien.from,
            to: lien.to,
            title: lien.label,
            color: color
        };
        generatedEdgesObjectList.push(edgeObject);
    });

    return generatedEdgesObjectList;
}

Promise.all([
    fetch('./data/entite.json'),
    fetch('./data/lien.json')
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