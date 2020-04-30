// URL de la feuille de calcul
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1hiONQ5SM82vKTAzMH2NRU3nNGQMToOU-TGaTfxxT0u4/edit#gid=0';

function gSheetLoad() {
    return new Promise((resolve, reject) => {

        Tabletop.init({
            key: publicSpreadsheetUrl,
            callback: function(data, tableMetas) {
                
                data.Entites.elements.forEach(entite => {
                    createNode(entite); });
                
                data.Extraction.elements.forEach(lien => {
                    createEdge(lien); });
                
                resolve(true);

            },
            simpleSheet: false });

    });
}

let nodeList = [];
function createNode(entite) {
    var nodeObject = {
        id: entite.id,
        label: entite.label,
        titre: entite.titre,
        genre: entite.genre,
        group: entite.relation,
        shape: chooseShape(entite.type),
        image: './assets/photos/' + entite.photo,
        size : 30,
        color: {
            border: chooseColor(entite.relation_otlet),
            background: 'black'
        }
    };
    nodeList.push(nodeObject);
}

let edgeList = [];
function createEdge(lien) {
    var edgeObject = {from: lien.from, to: lien.to};
    edgeList.push(edgeObject);
}


gSheetLoad().then(function(bool) {

    var network = {
        container: document.querySelector('#network'),
        options: {
            physics: {
                repulsion: {
                    nodeDistance: 10
                }
            },
            groups: {
                collegue: {color: {background: chooseColor('collegue')}, borderWidth:3},
                contemporain: {color: {background: chooseColor('contemporain')}, borderWidth:3},
                collaborateur: {color: {background: chooseColor('collaborateur')}, borderWidth:3},
                famille: {color: {background: chooseColor('famille')}, borderWidth:3},
                otlet: {color: {background: chooseColor('otlet')}, borderWidth:3},
                institution: {color: {background: chooseColor('institution')}, borderWidth:3},
                œuvre: {color: {background: chooseColor('œuvre')}, borderWidth:3},
                évènement: {color: {background: chooseColor('évènement')}, borderWidth:3}
            }
        },
        data: {
            nodes: new vis.DataSet(nodeList),
            edges: new vis.DataSet(edgeList)
        }
    }

    var visualisation = new vis.Network(network.container,
        network.data, network.options);
});

function chooseColor(relationEntite) {
    switch (relationEntite) {
        case 'collegue':
            return 'purple';
        case 'contemporain':
            return 'green';
        case 'collaborateur':
            return 'orange';
        case 'opposant':
            return 'red';
        case 'famille':
            return 'blue';
        case 'otlet':
            return 'gray';
        case 'institution':
            return 'gray';
        case 'œuvre':
            return 'gray';
        case 'évènement':
            return 'gray';
    }
}

function chooseShape(typeEntite) {
    switch (typeEntite) {
        case 'Personne':
            return 'circularImage';
        case 'Institution':
            return 'image';
        case 'Évènement':
            return 'image';
        case 'Œuvre':
            return 'image';
    }
}