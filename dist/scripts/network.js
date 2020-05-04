// URL de la feuille de calcul
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1hiONQ5SM82vKTAzMH2NRU3nNGQMToOU-TGaTfxxT0u4/edit#gid=0';

var network = {
    container: document.querySelector('#network'),
    interaction: {
        navigationButtons: true,
        zoomView: false
    },
    options: {
        physics: { repulsion: { nodeDistance: 10 } },
        clickToUse: false,
        groups: {
            collegue: {shape: 'circularImage', color: {border: chooseColor('collegue')}, borderWidth:3},
            contemporain: {shape: 'circularImage', color: {border: chooseColor('contemporain')}, borderWidth:3},
            collaborateur: {shape: 'circularImage', color: {border: chooseColor('collaborateur')}, borderWidth:3},
            famille: {shape: 'circularImage', color: {border: chooseColor('famille')}, borderWidth:3},
            otlet: {shape: 'circularImage', color: {border: chooseColor('otlet')}, borderWidth:3},
            institution: {shape: 'image', color: {border: chooseColor('institution')}, borderWidth:3},
            œuvre: {shape: 'image', color: {border: chooseColor('œuvre')}, borderWidth:3},
            évènement: {shape: 'image', color: {border: chooseColor('évènement')}, borderWidth:3}
        }
    },
    selectedNode: undefined
}

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
        title: entite.titre,
        group: entite.relation_otlet,
        image: './assets/photos/' + entite.photo,
        size : 30,
        metas: {
            genre: entite.genre,
            annee_naissance: entite.annee_naissance,
            annee_mort: entite.annee_mort,
            pays: entite.pays,
            discipline: entite.discipline,
            description: entite.description
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

    network.data = {
        nodes: new vis.DataSet(nodeList),
        edges: new vis.DataSet(edgeList)
    }

    network.visualisation = new vis.Network(network.container,
        network.data, network.options);

    activeSearch();

    network.visualisation.on('click', nodeView);
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

function nodeView(nodeMetasBrutes) {
    
    var id = nodeMetasBrutes.nodes[0];

    if (id === undefined) {
        return; }
    
    if (network.selectedNode !== undefined && network.selectedNode == id) {
        return; }

    zoomToNode(id);

    id -= 1;

    var nodeMetas = getNodeMetas(id);

    volet.fill(nodeMetas);
    volet.open();
    
}

function getNodeMetas(id) { 

    var nodeMetas = nodeList[id].metas;
    nodeMetas.label = nodeList[id].label;
    nodeMetas.image = nodeList[id].image;

    network.selectedNode = id;

    return nodeMetas;
}

function zoomToNode(id) {
    
    var nodesCoordonates = network.visualisation.getPositions();
    network.visualisation.moveTo({
        position: {
            x: nodesCoordonates[id].x,
            y: nodesCoordonates[id].y
        },
        scale: 3,
        animation: true
    });
}

function backToCenterView() {
    network.visualisation.fit({
        animation: true
    });
}