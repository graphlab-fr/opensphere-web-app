

/**
 * ================================================================================================
 * search.js ======================================================================================
 * ================================================================================================
 * Set search engine parameters & data
 */


var search = {
    input: document.querySelector('#search'),
    resultContent: document.querySelector('#search-result'),
    options: {
        includeScore: true,
        keys: ['label']
    },    

    showResult: function(resultObj) {
        var nodeId = resultObj.item.id;
        var nodeLabel = resultObj.item.label;

        var resultElement = document.createElement('li');
        resultElement.classList.add('search__result');
        resultElement.textContent = nodeLabel;
        search.resultContent.appendChild(resultElement);

        resultElement.addEventListener('click', () => {

            if (network.selectedNode !== undefined && network.selectedNode == nodeId) {
                // si cette id correpond à celle du nœeud selectionné
                return;
            }
            
            search.input.value = nodeLabel;
            this.cleanResultContent();

            switchNode(nodeId);
            historique.actualiser(nodeId);
        });
    },
    reset: function() {
        search.input.value = ''; // form value
        this.cleanResultContent();
    },
    cleanResultContent: function() {
        search.resultContent.innerHTML = ''; // results
    },
    init: function() {

        const noHiddenNodes = network.data.nodes.map(entite => ({
            id: entite.id,
            label: entite.label
        }), {
            filter: function(entite) {
                return(entite.hidden !== true);
            }
        })

        const fuse = new Fuse(noHiddenNodes, search.options);

        search.input.addEventListener('input', () => {
    
            search.resultContent.innerHTML = '';
    
            if (search.input.value == '') { return; }
    
            const resultList = fuse.search(search.input.value);
            
            if (resultList.length > 5) {
                // si plus de 5 résultats, limiter à 5
                var nbResult = 5;
            } else {
                // sinon garder l nombre de résultats
                var nbResult = resultList.length;
            }
            
            for (let i = 0; i < nbResult; i++) {
                search.showResult(resultList[i]); }
        });
    }
}

search.reset();