export class MobileMenu {
    constructor() {
        this.$html = document.getElementsByTagName('html')[0];
        this.isOpen = false;
        this.mobileMenuOpenClass = 'mobile-menu-open';
        this.scrollTop = pageYOffset;
    }

    toggle() {
        this.$html.classList.toggle(this.mobileMenuOpenClass);
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            this.scrollTop = pageYOffset;

        } else {
            window.scrollTo(0, pageYOffset);
        }
    }
}