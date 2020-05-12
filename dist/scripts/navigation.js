var movement = {
    offset: {
        introduction: document.querySelector('#introduction').offsetTop,
        header: document.querySelector('#header').offsetTop,
        // board: document.querySelector('#board-content').offsetTop,
        board: document.body.clientHeight
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
                this.scroll(this.offset.board);
                break;
        }
    },
    scroll: function(offset) {
        console.log(offset);
        
        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    movement.goTo('graph');
});