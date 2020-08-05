import Swiper from 'swiper/js/swiper.min';

export default class BuildingProgressSlider {
    constructor(sliderId) {
        this.sliderId = sliderId;
        this.$slider = document.getElementById(sliderId);
        if (!this.$slider) return;

        this.init();
    }

    init() {
        this.initSlider();
    }

    initSlider() {
        return new Swiper(`#${this.sliderId}`, {
            slidesPerView: 'auto',
            loop: false,
            freeMode: true,
            spaceBetween: 24
        });
    }
}