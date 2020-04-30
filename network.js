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
        shape: chooseShape(entite.type),
        color: {
            border: chooseColor(entite.relation_otlet),
            background: 'white'
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
        options: {},
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
            return 'circle';
        case 'Institution':
            return 'box';
        case 'Évènement':
            return 'box';
        case 'Œuvre':
            return 'box';
    }
}