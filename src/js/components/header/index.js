export class Header {
    constructor() {
        this.$header = document.getElementById('header');
        this.headerClassName = 'compact';

        this.init();
    }

    init() {
        this.refreshStateHeader();

        window.addEventListener('scroll', () => {
            this.refreshStateHeader();
        });
    }

    refreshStateHeader() {
        if (pageYOffset > 200) {
            this.$header.classList.add(this.headerClassName);
        } else {
            this.$header.classList.remove(this.headerClassName);
        }
    }
}