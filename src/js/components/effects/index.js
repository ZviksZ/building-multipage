export class Effects {
    constructor() {
        this.init();
    }

    checkVisibleElements() {
        const sections = document.querySelectorAll('.animate-block');

        if (!document.querySelectorAll('.animate-block:not(.visible)')) return;

        for (const section of sections) {
            if (
                section.getBoundingClientRect().top <= window.innerHeight * 0.75
                && section.getBoundingClientRect().top > 0
            ) {
                section.classList.add('visible');
            }
        }
    }

    init() {
        this.checkVisibleElements();

        window.addEventListener('scroll', () => {
            this.checkVisibleElements();
        });
    }
}