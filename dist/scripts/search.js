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
            
            var nodeMetas = getNodeMetas(id - 1);

            volet.fill(nodeMetas);
            volet.open();
        });
    }
}

const options = {
    includeScore: true,
    keys: ['label']
}

function activeSearch() {

    const fuse = new Fuse(nodeList, options);

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
}