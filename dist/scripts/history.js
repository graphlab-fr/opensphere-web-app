var historique = {
    actualiser: function(id) {
        if (history.state == null) { this.init(id); }
        else {
            var timeline = history.state.hist;
            timeline.push(id);
            history.pushState({hist : timeline}, 'entite ' + id, id);
        }
    },
    init: function(id) {
        history.pushState({hist : [id]}, 'entite ' + id, id);
    }
}

window.onpopstate = function(e) {
    if (e.state === null) { return; }

    var timeline = e.state.hist;

    var id = timeline[timeline.length -1];
    switchNode(id);
};