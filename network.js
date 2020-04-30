// URL de la feuille de calcul
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1hiONQ5SM82vKTAzMH2NRU3nNGQMToOU-TGaTfxxT0u4/edit#gid=0';

function gSheetLoad() {
    return new Promise((resolve, reject) => {

    Tabletop.init({
        key: publicSpreadsheetUrl,
        callback: function(data, tableMetas) {
            
            data.Entites.elements.forEach(entite => {
                createNode(entite); });
            
            resolve(true);

        },
        simpleSheet: false });

    });
}

let nodeList = [];
function createNode(entite) {
    var nodeObject = {id: entite.id, label: entite.label};
    nodeList.push(nodeObject);
}

gSheetLoad().then(function(bool) {

    var network = {
        container: document.querySelector('#network'),
        options: {},
        data: {
            nodes: new vis.DataSet(nodeList),
            edges: new vis.DataSet()
        }
    }

    var visualisation = new vis.Network(network.container,
        network.data, network.options);
});