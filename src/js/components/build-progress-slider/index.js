import * as $ from 'jquery';
import Swiper from 'swiper/js/swiper.min.js';

export class BuildProgressSliders {
   constructor() {
      this.$sliders = $('.bp-slider');

      if (this.$sliders.length === 0) return false;

      this.init();
   }

   init = () => {
      this.$sliders.each((_, item) => this.initSlider(item));
   };

   initSlider = (slider) => {
      new Swiper(slider, {
         effect: 'slide',
         loop: false,
         preloadImages: false,
         lazy: true,
         resistance: true,
         slidesPerView: 'auto',
         autoHeight: true,
         spaceBetween: 32,
         freeMode: true
        /* pagination: {
            el: '#gallery-modal-pagination',
            type: 'fraction',
            renderFraction: function(currentClass, totalClass, index) {
               return `<i class="icon-photo"></i><span class="swiper-pagination-current"></span> из <span class="swiper-pagination-total"></span>`;
            }
         },
         navigation: {
            nextEl: '.gallery-modal .swiper-button-next',
            prevEl: '.gallery-modal .swiper-button-prev',
         },    */
      });
   }
}
