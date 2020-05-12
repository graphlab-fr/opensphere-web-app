var movement = {
    offset: {
        introduction: document.querySelector('#introduction').offsetTop,
        header: document.querySelector('#header').offsetTop
    },
    goTo: function(section) {
        switch (section) {
            case 'introduction':
                this.scroll(0);
                break;
                
            case 'graph':
                this.scroll(this.offset.header);
                break;
                
            case 'board':
                
                break;
        }
    },
    scroll: function(offset) {
        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    movement.goTo('graph');
});