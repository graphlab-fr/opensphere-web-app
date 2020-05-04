const btnZoomPlus = document.querySelector('#zoom-plus');
const btnZoomMoins = document.querySelector('#zoom-moins');

btnZoomPlus.addEventListener('click', () => {
    var scale = network.visualisation.getScale() + 0.3;
    if (scale > 2) { return; }
    network.visualisation.moveTo({ scale: scale });
});

btnZoomMoins.addEventListener('click', () => {
    var scale = network.visualisation.getScale() - 0.3;
    if (scale < 0.8) { return; }
    network.visualisation.moveTo({ scale: scale });
});

const btnsGroups = document.querySelectorAll('.btn-group');
btnsGroups.forEach(btn => {
    var group = btn.dataset.group;

    let isActiveGroup = true;

    btn.addEventListener('click', () => {

        search.reset();

        if (isActiveGroup) {
            network.data.nodes.get({
                filter: function (item) {
                    if (item.group == group) {
                        network.data.nodes.update({id: item.id, hidden: true}) }
                }
            });

            isActiveGroup = false;
        } else {
            network.data.nodes.get({
                filter: function (item) {
                    if (item.group == group) {
                        network.data.nodes.update({id: item.id, hidden: false}) }
                }
            });

            isActiveGroup = true;
        }
    
    });
});
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

    var nodeMetas = getNodeMetas(id);

    volet.fill(nodeMetas);
    volet.open();
    
}

function getNodeMetas(id) { 
    var nodeMetas = null;

    network.data.nodes.get({

        filter: function (item) {
            if (item.id == id) {
                nodeMetas = item.metas;
                nodeMetas.label = item.label;
                nodeMetas.image = item.image;

                network.selectedNode = id;
            }
        }
    });

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
var search = {
    input: document.querySelector('#search'),
    resultContent: document.querySelector('#search-result'),

    showResult: function(resultObj) {
        var display = document.createElement('li');
        display.classList.add('search__result');
        display.textContent = resultObj.item.label;
        search.resultContent.appendChild(display);

        var id = resultObj.item.id;

        display.addEventListener('click', () => {

            if (network.selectedNode !== undefined && network.selectedNode == id) {
                return; }

            zoomToNode(id);
            
            var nodeMetas = getNodeMetas(id);

            volet.fill(nodeMetas);
            volet.open();
        });
    },
    reset: function() {
        search.input.value = ''; // form value
        search.resultContent.innerHTML = ''; // results
    }
}

const options = {
    includeScore: true,
    keys: ['label']
}

search.input.value = '';

function activeSearch() {

    search.input.addEventListener('focus', () => {
        
        const fuse = new Fuse(getActiveNodes(), options);

        search.input.addEventListener('input', () => {

            search.resultContent.innerHTML = '';
    
            if (search.input.value == '') {
                return; }
    
            const resultList = fuse.search(search.input.value);
            if (search.input != '') {
                for (let i = 0; i < 5; i++) {
                    search.showResult(resultList[i]);
                }
            }
        });
    });
}

function getActiveNodes() {
    var activeNodes = network.data.nodes.get({
        filter: function (item) {
            return (item.hidden !== true);
        }
    });
    return activeNodes;
}
var volet = {
    body: document.querySelector('#volet'),
    content: document.querySelector('#volet-content'),
    btnClose: document.querySelector('#volet-close'),

    open: function() {
        volet.body.classList.add('volet--active');
    },
    close: function() {
        volet.body.classList.remove('volet--active');
        volet.content.innerHTML = '';

        backToCenterView();
    },
    fill: function(nodeMetas) {
        var img = '<img class="volet__img" alt="" src="' + nodeMetas.image + '" />';
        var label = '<div class="volet__label">' + nodeMetas.label + '</div>';
        var dates = '<div class="volet__dates">' + nodeMetas.annee_naissance +  ' - '
            + nodeMetas.annee_mort + '</div>';
        var pays = '<div class="volet__pays">' + nodeMetas.pays + '</div>';
        var discipline = '<div class="volet__discipline">' + nodeMetas.discipline + '</div>';
        var description = '<div class="volet__description">' + nodeMetas.description + '</div>';

        volet.content.innerHTML = [img, label, dates, pays, discipline, description].join('');
    }
}

volet.btnClose.addEventListener('click', volet.close);