var search = {
    input: document.querySelector('#search'),
    resultContent: document.querySelector('#search-result'),

    showResult: function(resultObj) {
        var display = document.createElement('li');
        display.classList.add('search__result');
        display.textContent = resultObj.item.label;
        search.resultContent.appendChild(display);

        display.addEventListener('click', () => {

            resultObj.item.id--;
            
            var nodeMetas = findNode(resultObj.item.id);

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
        const resultList = fuse.search(search.input.value);
        if (search.input != '') {
            for (let i = 0; i < 5; i++) {
                search.showResult(resultList[i]);
                console.log(resultList[i]);
            }
        }
    });
}